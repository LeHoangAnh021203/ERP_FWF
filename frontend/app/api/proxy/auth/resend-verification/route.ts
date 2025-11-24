import { NextRequest, NextResponse } from "next/server";
import { getApiEndpoint } from "@/app/lib/auth-config";

const RESEND_VERIFICATION_ENDPOINT = getApiEndpoint(
  "auth/register/resend-verification"
);

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

if (
  process.env.NODE_ENV === "production" &&
  process.env.ALLOW_INSECURE_SSL === "true"
) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.warn("⚠️ SSL verification disabled in production - this is insecure!");
}

async function proxyResendVerification(email?: string, username?: string) {
  if (!email && !username) {
    return NextResponse.json(
      { error: "Email or username is required" },
      { status: 400 }
    );
  }

  console.log("🔍 Resend verification attempt:", {
    email,
    username,
    endpoint: RESEND_VERIFICATION_ENDPOINT,
  });

  try {
    const url = new URL(RESEND_VERIFICATION_ENDPOINT);
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    const init: RequestInit = {
      method: "POST",
      headers,
      signal: AbortSignal.timeout(10000),
    };

    if (email) {
      url.searchParams.set("email", email);
    }

    if (!email && username) {
      headers["Content-Type"] = "application/json";
      init.body = JSON.stringify({ username });
    }

    console.log("📬 Forwarding resend request", {
      url: url.toString(),
      method: init.method,
      hasBody: Boolean(init.body),
    });

    const res = await fetch(url.toString(), init);
    const text = await res.text();

    console.log("📡 Resend response status:", res.status);
    console.log("📡 Resend response body:", text);

    if (!res.ok) {
      let errorData: Record<string, unknown> | null = null;
      try {
        errorData = JSON.parse(text);
      } catch {
        errorData = {
          error: text || `HTTP ${res.status}: ${res.statusText}`,
        };
      }

      const errorMessage =
        errorData?.error ||
        errorData?.message ||
        errorData?.details ||
        "Failed to resend verification email";

      return NextResponse.json(
        { error: String(errorMessage), details: errorData },
        { status: res.status }
      );
    }

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text || "Verification email sent successfully" };
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Resend verification error:", error);
    return NextResponse.json(
      {
        error: "Connection failed",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch (parseError) {
      if (parseError instanceof SyntaxError) {
        console.warn("⚠️ Resend verification POST received empty body");
      } else {
        throw parseError;
      }
    }

    const emailParam = request.nextUrl.searchParams.get("email") ?? undefined;
    const email = (body.email as string | undefined) ?? emailParam;
    const username = body.username as string | undefined;

    return proxyResendVerification(email, username);
  } catch (error) {
    console.error("❌ Resend verification error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email") ?? undefined;
  const username = searchParams.get("username") ?? undefined;
  return proxyResendVerification(email, username);
}
