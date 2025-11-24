"use client"

import { useState } from "react"

type VietQRParsed = {
  accountName?: string
  amount?: string
  bankBin?: string
  accountNumber?: string
  merchantName?: string
  currency?: string
  countryCode?: string
  merchantCity?: string
  rawText?: string
  crc?: string
  qrTypeCode?: string
  method?: string
  bankName?: string
}

type TLV = Record<string, unknown>

function parseTLV(data: string): TLV {
  const result: TLV = {}
  let i = 0
  while (i + 4 <= data.length) {
    const tag = data.substring(i, i + 2)
    const len = parseInt(data.substring(i + 2, i + 4), 10)
    if (Number.isNaN(len) || len < 0) break
    const value = data.substring(i + 4, i + 4 + len)
    i += 4 + len
    if (["26", "27", "38", "62"].includes(tag)) {
      result[tag] = parseTLV(value)
    } else {
      result[tag] = value
    }
  }
  return result
}

function extractInfoFromTLV(parsed: TLV): VietQRParsed {
  const info: VietQRParsed = {
    rawText: "",
    merchantName: (parsed["59"] as string) || undefined,
    accountName: (parsed["59"] as string) || undefined,
    currency: (parsed["53"] as string) || undefined,
    amount: (parsed["54"] as string) || undefined,
    countryCode: (parsed["58"] as string) || undefined,
  }

  // In VietQR, banking data may be under tag 38 or 26, and nested again
  const bankBlocks: TLV[] = []
  const t38 = parsed["38"]
  const t26 = parsed["26"]
  if (t38 && typeof t38 === "object") bankBlocks.push(t38 as TLV)
  if (t26 && typeof t26 === "object") bankBlocks.push(t26 as TLV)

  const scanBankBlock = (block: TLV) => {
    // If this block itself has tags "00","01","02", use them
    const guid = block["00"]
    const v01 = block["01"]
    const v02 = block["02"]
    if (typeof guid === "string" && guid.toUpperCase() === "A000000727") {
      // Common VietQR: 01 = BIN, 02 = account number
      if (typeof v01 === "string") info.bankBin = v01
      if (typeof v02 === "string") info.accountNumber = v02
    } else if (typeof guid === "string" && !info.bankBin && !info.accountNumber) {
      // Some banks may swap: 00=BIN, 01=ACCOUNT
      if (/^97\d{3,4}$/.test(guid)) info.bankBin = guid
      if (typeof v01 === "string" && /^\d{6,}$/.test(v01)) info.accountNumber = v01
    }
    // Search nested levels
    for (const sub of Object.values(block)) {
      if (sub && typeof sub === "object") {
        scanBankBlock(sub as TLV)
      }
    }
  }
  bankBlocks.forEach(scanBankBlock)

  return info
}

function parseEMVTag(text: string, tag: string, startIndex: number = 0): { value: string; nextIndex: number } | null {
  const tagIndex = text.indexOf(tag, startIndex)
  if (tagIndex === -1 || tagIndex + 4 > text.length) {
    return null
  }

  const lengthStr = text.substring(tagIndex + 2, tagIndex + 4)
  const length = parseInt(lengthStr, 10)
  if (isNaN(length) || tagIndex + 4 + length > text.length) {
    return null
  }

  const value = text.substring(tagIndex + 4, tagIndex + 4 + length)
  return {
    value,
    nextIndex: tagIndex + 4 + length,
  }
}

function getAllEMVTags(text: string, tag: string): string[] {
  const results: string[] = []
  let startIndex = 0
  while (startIndex < text.length) {
    const parsed = parseEMVTag(text, tag, startIndex)
    if (!parsed) break
    results.push(parsed.value)
    startIndex = parsed.nextIndex
  }
  return results
}

function parseVietQR(text: string): VietQRParsed {
  // 1) Try robust TLV parsing first
  let data: VietQRParsed = { rawText: text }
  try {
    const tlv = parseTLV(text)
    const tlvInfo = extractInfoFromTLV(tlv)
    data = { ...data, ...tlvInfo }
    // additional top-level tags
    data.qrTypeCode = (tlv["01"] as string) || data.qrTypeCode
    data.crc = (tlv["63"] as string) || data.crc
  } catch {
    // ignore and fallback to regex/EMV
  }

  const merchantNames = getAllEMVTags(text, "59")
  if (merchantNames.length > 0) data.merchantName = data.accountName = data.accountName || merchantNames[0].trim()

  const amounts = getAllEMVTags(text, "54")
  if (amounts.length > 0 && !data.amount) data.amount = amounts[0]

  const currencies = getAllEMVTags(text, "53")
  if (currencies.length > 0 && !data.currency) data.currency = currencies[0]

  const countryCodes = getAllEMVTags(text, "58")
  if (countryCodes.length > 0 && !data.countryCode) data.countryCode = countryCodes[0]

  const merchantCities = getAllEMVTags(text, "60")
  if (merchantCities.length > 0 && !data.merchantCity) data.merchantCity = merchantCities[0].trim()

  const merchantAccountInfos = getAllEMVTags(text, "38")
  for (const merchantAccountInfo of merchantAccountInfos) {
    const guidTags = getAllEMVTags(merchantAccountInfo, "00")
    for (const guid of guidTags) {
      if (guid === "A000000727") {
        const bankBins = getAllEMVTags(merchantAccountInfo, "01")
        if (bankBins.length > 0 && !data.bankBin) data.bankBin = bankBins[0]

        const accountNumbers = getAllEMVTags(merchantAccountInfo, "02")
        if (accountNumbers.length > 0 && !data.accountNumber) data.accountNumber = accountNumbers[0]
        break
      }
    }
    if (data.bankBin && data.accountNumber) {
      break
    }
  }

  if (!data.bankBin) {
    const binMatch = text.match(/970(\d{3})/)
    if (binMatch) {
      data.bankBin = "970" + binMatch[1]
    }
  }

  if (!data.accountNumber && data.bankBin) {
    const accMatch = text.match(new RegExp(`${data.bankBin}(\\d{6,})`))
    if (accMatch) {
      data.accountNumber = accMatch[1]
    }
  }

  // derive CRC (tag 63, last 4 typically)
  const crcMatch = text.match(/63\d{2}([0-9A-F]{4})$/i)
  if (crcMatch) data.crc = crcMatch[1].toUpperCase()

  // derive method: look for QRIBFTTA token
  if (!data.method && /QRIBFTTA/i.test(text)) data.method = "QRIBFTTA"

  // derive bank name from BIN map (basic set; extendable)
  const bankMap: Record<string, string> = {
    "970418": "BIDV",
    "970436": "Vietcombank",
    "970405": "Techcombank",
  }
  if (data.bankBin && bankMap[data.bankBin]) data.bankName = bankMap[data.bankBin]

  return data
}

function prettyQrType(code?: string): string {
  if (!code) return "-"
  // 11: static, 12: dynamic per EMVCo
  if (code === "11") return "QR thanh toán tĩnh (Static)"
  if (code === "12") return "QR thanh toán động (Merchant-presented)"
  return code
}

function prettyCurrency(code?: string): string {
  if (!code) return "VND"
  if (code === "704") return "VND"
  return code
}

export default function TestQRPage() {
  const [rawText, setRawText] = useState("")
  const [parsed, setParsed] = useState<VietQRParsed | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleParse = () => {
    if (!rawText.trim()) {
      setParsed(null)
      return
    }
    setParsed(parseVietQR(rawText.trim()))
  }

  const resetState = () => {
    setParsed(null)
    setRawText("")
    setImagePreview(null)
    setError(null)
    setLoading(false)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)
    setParsed(null)
    setRawText("")
    if (!file) {
      setImagePreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setImagePreview(url)
    setLoading(true)
    try {
      const Supported = typeof window !== "undefined" && "BarcodeDetector" in window
      if (!Supported) {
        throw new Error("Trình duyệt không hỗ trợ BarcodeDetector. Vui lòng nhập chuỗi QR thủ công.")
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - BarcodeDetector is a browser API not in TypeScript lib
      const detector = new BarcodeDetector({ formats: ["qr_code"] })
      const img = await createImageBitmap(file)
      const results = await detector.detect(img)
      if (!results || results.length === 0) {
        throw new Error("Không phát hiện được QR trong ảnh. Vui lòng thử ảnh khác.")
      }
      const qrText = results[0].rawValue as string
      setRawText(qrText)
      setParsed(parseVietQR(qrText))
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không thể đọc QR từ ảnh"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">VietQR Parser</h1>
      <div className="space-y-3 mb-6">
        <div className="text-sm text-gray-700">Tải ảnh QR để tự động đọc, hoặc dán chuỗi QR thủ công.</div>
        <input type="file" accept="image/*" onChange={handleFileChange} className="block text-sm" />
        {imagePreview && (
          <div className="mt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="QR preview" className="max-h-56 rounded border" />
          </div>
        )}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {loading && <div className="text-sm text-gray-600">Đang xử lý ảnh...</div>}
      </div>
      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        rows={8}
        className="w-full border rounded p-2 font-mono text-sm"
        placeholder="Dán nội dung QR tại đây..."
      />
      <div className="mt-3 flex gap-2">
        <button onClick={handleParse} className="px-3 py-2 bg-blue-600 text-white rounded">
          Parse
        </button>
        <button onClick={resetState} className="px-3 py-2 border rounded">
          Clear
        </button>
      </div>
      {parsed && (
        <div className="mt-6 border rounded p-4 bg-gray-50">
          <h2 className="font-medium mb-3">Kết quả</h2>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-600 font-medium">Ngân hàng:</span>
                <div className="mt-1">
                  {parsed.bankName ? `${parsed.bankName} (BIN ${parsed.bankBin})` : parsed.bankBin ? `(BIN ${parsed.bankBin})` : "-"}
                </div>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Số tài khoản nhận:</span>
                <div className="mt-1">{parsed.accountNumber || "-"}</div>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Loại QR:</span>
                <div className="mt-1">{prettyQrType(parsed.qrTypeCode)}</div>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Phương thức:</span>
                <div className="mt-1">{parsed.method || "-"}</div>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Số tiền cố định:</span>
                <div className="mt-1">
                  {parsed.amount ? `${Number(parsed.amount).toLocaleString("vi-VN")} ${prettyCurrency(parsed.currency)}` : "-"}
                </div>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Quốc gia:</span>
                <div className="mt-1">{parsed.countryCode === "VN" ? "Việt Nam" : parsed.countryCode || "-"}</div>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Tên chủ tài khoản:</span>
                <div className="mt-1">{parsed.accountName || "Không có trong mã (không có Tag 59)"}</div>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Mã CRC:</span>
                <div className="mt-1">{parsed.crc || "-"}</div>
              </div>
            </div>
            {parsed.rawText && (
              <div className="mt-4 pt-3 border-t">
                <span className="text-gray-600 font-medium text-xs">Raw QR Text:</span>
                <div className="mt-1 text-xs font-mono break-all text-gray-500">{parsed.rawText}</div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="mt-6 text-xs text-gray-500">
        Ghi chú: Decode ảnh QR trực tiếp trong trình duyệt cần thêm thư viện decode; hiện trang này chỉ parse từ chuỗi QR.
      </div>
    </div>
  )
}
