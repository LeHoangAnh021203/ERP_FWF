import { NextRequest, NextResponse } from "next/server";
import { sendBookingConfirmationEmail } from "@/app/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      service,
      branchName,
      branchAddress,
      bookingDate,
      bookingTime,
      bookingId
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !service || !branchName || !bookingDate || !bookingTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate booking ID if not provided
    const finalBookingId = bookingId || `FWF${Date.now()}`;

    // Send confirmation email
    const emailResult = await sendBookingConfirmationEmail({
      customerName,
      customerEmail,
      customerPhone: customerPhone || "Chưa cung cấp",
      service,
      branchName,
      branchAddress: branchAddress || "Chưa cung cấp",
      bookingDate,
      bookingTime,
      bookingId: finalBookingId,
      bookingCustomer: "1" // Default to 1 customer
    });

    if (emailResult.success) {
      const customerSuccess = emailResult.details?.customer?.success;
      const businessSuccess = emailResult.details?.business?.success;
      
      let message = "Email xác nhận đã được gửi thành công";
      if (customerSuccess && businessSuccess) {
        message = "📧 Email đã được gửi cho khách hàng và nhà cáo";
      } else if (customerSuccess) {
        message = "📧 Email đã được gửi cho khách hàng (nhà cáo chưa nhận được)";
      } else if (businessSuccess) {
        message = "📧 Email đã được gửi cho nhà cáo (khách hàng chưa nhận được)";
      }

      return NextResponse.json({
        success: true,
        message,
        bookingId: finalBookingId,
        emailMessageId: emailResult.messageId,
        emailDetails: {
          customer: emailResult.details?.customer,
          business: emailResult.details?.business
        }
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Không thể gửi email xác nhận",
          details: emailResult.error
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("❌ Booking confirmation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi hệ thống",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
