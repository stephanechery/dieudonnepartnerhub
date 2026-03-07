import Foundation
import AppKit
import PDFKit

enum BuildError: Error {
    case contextCreationFailed(String)
}

let fileManager = FileManager.default
let cwd = "/Users/stephanechery/Documents/New project 2"
let buildDir = "\(cwd)/hfi_december_packet_build"
let outputPacket = "\(cwd)/HFI_Dieudonne_December_2025_Invoice_Packet.pdf"

try? fileManager.removeItem(atPath: buildDir)
try fileManager.createDirectory(atPath: buildDir, withIntermediateDirectories: true)

let pageWidth: CGFloat = 612
let pageHeight: CGFloat = 792
let contentX: CGFloat = 72
let contentWidth: CGFloat = pageWidth - 144

func makeParagraphStyle(alignment: NSTextAlignment = .left, lineSpacing: CGFloat = 3) -> NSParagraphStyle {
    let paragraph = NSMutableParagraphStyle()
    paragraph.alignment = alignment
    paragraph.lineBreakMode = .byWordWrapping
    paragraph.lineSpacing = lineSpacing
    return paragraph
}

@discardableResult
func drawWrappedText(
    _ text: String,
    x: CGFloat,
    y: CGFloat,
    width: CGFloat,
    font: NSFont,
    color: NSColor = .black,
    alignment: NSTextAlignment = .left,
    lineSpacing: CGFloat = 3
) -> CGFloat {
    let attrs: [NSAttributedString.Key: Any] = [
        .font: font,
        .foregroundColor: color,
        .paragraphStyle: makeParagraphStyle(alignment: alignment, lineSpacing: lineSpacing)
    ]

    let nsText = NSString(string: text)
    let bounds = nsText.boundingRect(
        with: CGSize(width: width, height: 4000),
        options: [.usesLineFragmentOrigin, .usesFontLeading],
        attributes: attrs
    )

    let height = ceil(bounds.height)
    nsText.draw(
        with: CGRect(x: x, y: y, width: width, height: height),
        options: [.usesLineFragmentOrigin, .usesFontLeading],
        attributes: attrs
    )

    return y + height
}

func drawHorizontalLine(y: CGFloat, x1: CGFloat = 72, x2: CGFloat = 540, color: NSColor = NSColor(white: 0.75, alpha: 1.0)) {
    let path = NSBezierPath()
    path.move(to: CGPoint(x: x1, y: y))
    path.line(to: CGPoint(x: x2, y: y))
    color.setStroke()
    path.lineWidth = 1
    path.stroke()
}

func createSinglePagePDF(path: String, draw: () -> Void) throws {
    var mediaBox = CGRect(x: 0, y: 0, width: pageWidth, height: pageHeight)
    guard let cgContext = CGContext(URL(fileURLWithPath: path) as CFURL, mediaBox: &mediaBox, nil) else {
        throw BuildError.contextCreationFailed(path)
    }

    cgContext.beginPDFPage(nil)

    let nsContext = NSGraphicsContext(cgContext: cgContext, flipped: true)
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = nsContext

    NSColor.white.setFill()
    NSBezierPath(rect: mediaBox).fill()
    draw()

    NSGraphicsContext.restoreGraphicsState()

    cgContext.endPDFPage()
    cgContext.closePDF()
}

func currency(_ amount: Double) -> String {
    let formatter = NumberFormatter()
    formatter.numberStyle = .currency
    formatter.locale = Locale(identifier: "en_US")
    return formatter.string(from: NSNumber(value: amount)) ?? String(format: "$%.2f", amount)
}

let logoPath = "/Users/stephanechery/Downloads/Dieudonne Foundation Header Logo.png"
let ctmaLogoPath = "/Users/stephanechery/Downloads/Chery Talent Management Agency Logo.png"

let coverSheetPath = "\(buildDir)/01_cover_sheet_dec2025.pdf"
try createSinglePagePDF(path: coverSheetPath) {
    var y: CGFloat = 28

    if let logo = NSImage(contentsOfFile: logoPath) {
        let logoRect = CGRect(x: contentX, y: y, width: 330, height: 82)
        logo.draw(in: logoRect)
        y = logoRect.maxY + 18
    }

    y = drawWrappedText(
        "Health First Indiana Invoice Packet Cover Sheet",
        x: contentX,
        y: y,
        width: contentWidth,
        font: NSFont.systemFont(ofSize: 24, weight: .bold)
    )

    y = drawWrappedText(
        "December 2025",
        x: contentX,
        y: y + 4,
        width: contentWidth,
        font: NSFont.systemFont(ofSize: 20, weight: .semibold)
    )

    y += 12
    y = drawWrappedText("Awardee: Dieudonne Foundation", x: contentX, y: y, width: contentWidth, font: NSFont.systemFont(ofSize: 13))
    y = drawWrappedText("PO#: 2500012008", x: contentX, y: y + 2, width: contentWidth, font: NSFont.systemFont(ofSize: 13))
    y = drawWrappedText("Award Period: 05/10/2025 - 05/10/2026", x: contentX, y: y + 2, width: contentWidth, font: NSFont.systemFont(ofSize: 13))
    y = drawWrappedText("Contact: contact@dieudonnefoundation.org | (317) 914-3863", x: contentX, y: y + 2, width: contentWidth, font: NSFont.systemFont(ofSize: 13))

    y += 12
    drawHorizontalLine(y: y)
    y += 16

    y = drawWrappedText(
        "Reimbursement Summary (This Period)",
        x: contentX,
        y: y,
        width: contentWidth,
        font: NSFont.systemFont(ofSize: 16, weight: .bold)
    )

    let summaryLines = [
        "• \(currency(2500.00)) - Chery Talent Management Agency LLC (Invoice CTMA-1225)",
        "• \(currency(3200.00)) - The Mothership Institute (Doula Trainer fee)",
        "• \(currency(810.00)) - Contractor payments for doulas and intake coordination (see attached summary/proof)",
        "• \(currency(780.00)) - Farah Célestin Chéry (HFI contractor - December 2025)",
        "Supplies: \(currency(0.00))",
        "Equipment: \(currency(0.00))",
        "TOTAL REQUESTED THIS PERIOD: \(currency(7290.00))"
    ]

    for line in summaryLines {
        y = drawWrappedText(
            line,
            x: contentX + 6,
            y: y + 4,
            width: contentWidth - 6,
            font: line.hasPrefix("TOTAL") ? NSFont.systemFont(ofSize: 14, weight: .bold) : NSFont.systemFont(ofSize: 13)
        )
    }

    y += 10
    drawHorizontalLine(y: y)
    y += 16

    y = drawWrappedText(
        "Checklist (this order)",
        x: contentX,
        y: y,
        width: contentWidth,
        font: NSFont.systemFont(ofSize: 16, weight: .bold)
    )

    let checklist = [
        "1. MCPHD HFI Invoice (first page) - signed",
        "2. Cover sheet (this page)",
        "3. Monthly Expense Tracking - December 2025",
        "4. CTMA contractor invoice (CTMA-1225)",
        "5. Contractor invoice - Doula Trainer (The Mothership Institute)",
        "6. Proof of payment - Doula Trainer Monica Thomas Cooper",
        "7. Contractor invoice - Farah Célestin Chéry (December 2025)",
        "8. Proof of payment - Contractor Farah Célestin Chéry",
        "9. Contractor invoice summary - Doula Wrap-Around Care (December 2025)",
        "10. Contractor payment summary - Doulas and Intake Coordinator (December 2025)"
    ]

    for item in checklist {
        y = drawWrappedText(item, x: contentX + 6, y: y + 4, width: contentWidth - 6, font: NSFont.systemFont(ofSize: 12.5))
    }

    y += 8
    drawHorizontalLine(y: y)
    _ = drawWrappedText(
        "Notes: Highlight requested amounts on supporting pages and keep service descriptions aligned with contractual activities.",
        x: contentX,
        y: y + 10,
        width: contentWidth,
        font: NSFont.systemFont(ofSize: 12)
    )
}

let ctmaInvoicePath = "\(buildDir)/02_ctma_invoice_dec2025.pdf"
try createSinglePagePDF(path: ctmaInvoicePath) {
    var y: CGFloat = 32

    if let logo = NSImage(contentsOfFile: ctmaLogoPath) {
        let logoRect = CGRect(x: contentX, y: y, width: 190, height: 58)
        logo.draw(in: logoRect)
    }

    _ = drawWrappedText("INVOICE", x: 430, y: y + 8, width: 110, font: NSFont.systemFont(ofSize: 26, weight: .bold), alignment: .right)
    y += 70

    y = drawWrappedText("Chery Talent Management Agency LLC", x: contentX, y: y, width: 290, font: NSFont.systemFont(ofSize: 15, weight: .bold))
    y = drawWrappedText("2126 N Pennsylvania St\nIndianapolis, IN 46202\nstephanechery@cherytalents.com\n(317) 914-2647", x: contentX, y: y + 4, width: 290, font: NSFont.systemFont(ofSize: 12))

    let rightX: CGFloat = 340
    var rightY: CGFloat = 102
    rightY = drawWrappedText("Invoice Number: CTMA-1225", x: rightX, y: rightY, width: 200, font: NSFont.systemFont(ofSize: 12.5, weight: .semibold))
    rightY = drawWrappedText("Invoice Date: March 2, 2026", x: rightX, y: rightY + 4, width: 200, font: NSFont.systemFont(ofSize: 12.5))
    _ = drawWrappedText("Service Period: December 1-31, 2025", x: rightX, y: rightY + 4, width: 200, font: NSFont.systemFont(ofSize: 12.5))

    y += 16
    drawHorizontalLine(y: y)
    y += 16

    y = drawWrappedText("BILL TO", x: contentX, y: y, width: contentWidth, font: NSFont.systemFont(ofSize: 12, weight: .bold))
    y = drawWrappedText("Dieudonne Foundation\n1347 N Park Ave\nIndianapolis, IN 46202\ncontact@dieudonnefoundation.org", x: contentX, y: y + 2, width: 240, font: NSFont.systemFont(ofSize: 12))

    y += 16
    drawHorizontalLine(y: y)
    y += 12

    let tableX = contentX
    let tableWidth = contentWidth
    let amountColumnWidth: CGFloat = 130
    let descriptionWidth = tableWidth - amountColumnWidth

    NSColor(white: 0.95, alpha: 1.0).setFill()
    NSBezierPath(rect: CGRect(x: tableX, y: y, width: tableWidth, height: 24)).fill()
    drawWrappedText("DESCRIPTION OF SERVICE", x: tableX + 8, y: y + 5, width: descriptionWidth - 16, font: NSFont.systemFont(ofSize: 11, weight: .bold))
    drawWrappedText("AMOUNT", x: tableX + descriptionWidth + 8, y: y + 5, width: amountColumnWidth - 16, font: NSFont.systemFont(ofSize: 11, weight: .bold), alignment: .right)

    let tablePath = NSBezierPath()
    tablePath.appendRect(CGRect(x: tableX, y: y, width: tableWidth, height: 182))
    NSColor(white: 0.7, alpha: 1.0).setStroke()
    tablePath.lineWidth = 1
    tablePath.stroke()

    let divider = NSBezierPath()
    divider.move(to: CGPoint(x: tableX + descriptionWidth, y: y))
    divider.line(to: CGPoint(x: tableX + descriptionWidth, y: y + 182))
    divider.lineWidth = 1
    divider.stroke()

    let serviceText = "Consulting, mentoring, strategic planning, and implementation support for Dieudonne Foundation's doula programming and grant deliverables for December 2025.\n\nHours Worked: 50 hours\nRate: $50.00 per hour"
    _ = drawWrappedText(serviceText, x: tableX + 8, y: y + 34, width: descriptionWidth - 16, font: NSFont.systemFont(ofSize: 12))
    _ = drawWrappedText(currency(2500.00), x: tableX + descriptionWidth + 8, y: y + 34, width: amountColumnWidth - 16, font: NSFont.systemFont(ofSize: 12, weight: .semibold), alignment: .right)

    y += 195
    drawHorizontalLine(y: y)
    y += 12

    _ = drawWrappedText("TOTAL DUE: \(currency(2500.00))", x: 330, y: y, width: 210, font: NSFont.systemFont(ofSize: 16, weight: .bold), alignment: .right)

    y += 40
    _ = drawWrappedText(
        "Payment Information:\nPlease remit payment to Chery Talent Management Agency LLC.",
        x: contentX,
        y: y,
        width: contentWidth,
        font: NSFont.systemFont(ofSize: 11.5)
    )
}

let farahInvoicePath = "\(buildDir)/03_farah_invoice_dec2025.pdf"
try createSinglePagePDF(path: farahInvoicePath) {
    var y: CGFloat = 56

    y = drawWrappedText("INVOICE", x: contentX, y: y, width: contentWidth, font: NSFont.systemFont(ofSize: 28, weight: .bold))
    y += 6

    y = drawWrappedText("Contractor: Farah Célestin Chéry", x: contentX, y: y, width: contentWidth, font: NSFont.systemFont(ofSize: 13, weight: .semibold))
    y = drawWrappedText("Organization: Dieudonne Foundation", x: contentX, y: y + 3, width: contentWidth, font: NSFont.systemFont(ofSize: 13))
    y = drawWrappedText("Month of Service: December 2025", x: contentX, y: y + 3, width: contentWidth, font: NSFont.systemFont(ofSize: 13))

    y += 14
    y = drawWrappedText("Description of Services:", x: contentX, y: y, width: contentWidth, font: NSFont.systemFont(ofSize: 13, weight: .bold))

    let description = "Project management services provided by Farah Célestin Chéry, including partnerships coordination, doula interviews and onboarding, client resource navigation, supplies management, and training and meeting coordination in alignment with Health First Indiana (HFI) program needs."
    y = drawWrappedText(description, x: contentX, y: y + 4, width: contentWidth, font: NSFont.systemFont(ofSize: 12.5), lineSpacing: 3.5)

    y += 14
    y = drawWrappedText("Hours Worked: 19.5 hours", x: contentX, y: y, width: contentWidth, font: NSFont.systemFont(ofSize: 13))
    y = drawWrappedText("Rate: $40.00 per hour", x: contentX, y: y + 2, width: contentWidth, font: NSFont.systemFont(ofSize: 13))
    y = drawWrappedText("Total Amount Due: $780.00", x: contentX, y: y + 2, width: contentWidth, font: NSFont.systemFont(ofSize: 13, weight: .bold))

    y += 18
    y = drawWrappedText("Payment To:", x: contentX, y: y, width: contentWidth, font: NSFont.systemFont(ofSize: 12.5, weight: .semibold))
    y = drawWrappedText("Farah Célestin Chéry\n1347 N Park Ave\nIndianapolis IN, 46202", x: contentX, y: y + 2, width: contentWidth, font: NSFont.systemFont(ofSize: 12.5))

    y += 18
    y = drawWrappedText("Prepared By:", x: contentX, y: y, width: contentWidth, font: NSFont.systemFont(ofSize: 12.5, weight: .semibold))
    y = drawWrappedText("Dieudonne Foundation\ncontact@dieudonnefoundation.org", x: contentX, y: y + 2, width: contentWidth, font: NSFont.systemFont(ofSize: 12.5))

    _ = drawWrappedText("Invoice Date: March 2, 2026", x: contentX, y: 680, width: contentWidth, font: NSFont.systemFont(ofSize: 11))
}

func createPaymentProofPage(
    path: String,
    title: String,
    paymentTo: String,
    amount: String,
    paidOn: String,
    description: String,
    paymentType: String,
    transactionNumber: String,
    account: String
) throws {
    try createSinglePagePDF(path: path) {
        var y: CGFloat = 58

        y = drawWrappedText(title, x: contentX, y: y, width: contentWidth, font: NSFont.systemFont(ofSize: 22, weight: .bold))
        y = drawWrappedText("Source: Submitted payment detail screenshot", x: contentX, y: y + 2, width: contentWidth, font: NSFont.systemFont(ofSize: 11), color: NSColor(white: 0.35, alpha: 1))

        y += 14
        drawHorizontalLine(y: y)
        y += 16

        y = drawWrappedText("Payment To", x: contentX, y: y, width: 200, font: NSFont.systemFont(ofSize: 12, weight: .bold))
        y = drawWrappedText(paymentTo, x: contentX, y: y + 2, width: contentWidth, font: NSFont.systemFont(ofSize: 15))

        y += 12
        y = drawWrappedText("Amount", x: contentX, y: y, width: contentWidth, font: NSFont.systemFont(ofSize: 12, weight: .bold))
        y = drawWrappedText(amount, x: contentX, y: y + 2, width: contentWidth, font: NSFont.systemFont(ofSize: 28, weight: .bold))

        y += 10
        y = drawWrappedText("Paid On", x: contentX, y: y, width: contentWidth, font: NSFont.systemFont(ofSize: 12, weight: .bold))
        y = drawWrappedText(paidOn, x: contentX, y: y + 2, width: contentWidth, font: NSFont.systemFont(ofSize: 15))

        y += 12
        y = drawWrappedText("Description", x: contentX, y: y, width: contentWidth, font: NSFont.systemFont(ofSize: 12, weight: .bold))
        y = drawWrappedText(description, x: contentX, y: y + 2, width: contentWidth, font: NSFont.systemFont(ofSize: 13))

        y += 16
        drawHorizontalLine(y: y)
        y += 16

        y = drawWrappedText("Details", x: contentX, y: y, width: contentWidth, font: NSFont.systemFont(ofSize: 16, weight: .bold))
        y = drawWrappedText("Payment type: \(paymentType)", x: contentX, y: y + 6, width: contentWidth, font: NSFont.systemFont(ofSize: 13))
        y = drawWrappedText("Transaction number: \(transactionNumber)", x: contentX, y: y + 4, width: contentWidth, font: NSFont.systemFont(ofSize: 13))
        y = drawWrappedText("Contractor account: \(account)", x: contentX, y: y + 4, width: contentWidth, font: NSFont.systemFont(ofSize: 13))
    }
}

let monicaProofPath = "\(buildDir)/04_proof_payment_monica.pdf"
try createPaymentProofPage(
    path: monicaProofPath,
    title: "Proof of Payment - Doula Trainer (Monica)",
    paymentTo: "Monica Thomas Cooper (Mama Mawusi)",
    amount: "$3,250.00",
    paidOn: "12/01/2025",
    description: "The Mothership Institute of Wombwellness and Wholistic Health - November Class",
    paymentType: "Direct Deposit",
    transactionNumber: "673",
    account: "Checking ...2932"
)

let farahProofPath = "\(buildDir)/05_proof_payment_farah.pdf"
try createPaymentProofPage(
    path: farahProofPath,
    title: "Proof of Payment - Farah Célestin Chéry",
    paymentTo: "Farah Célestin Chéry",
    amount: "$780.00",
    paidOn: "01/07/2026",
    description: "HFI Contractor Farah Chery (December 2025)",
    paymentType: "Direct Deposit",
    transactionNumber: "741",
    account: "Checking ...5702"
)

let hfiWorkbookPath = "/Users/stephanechery/Downloads/HFI Invoice Workbook - Dieudonne Foundation 25' 2.xlsx - Dec (1).pdf"
let expenseTrackingPath = "/Users/stephanechery/Downloads/HFI Monthly Expense Tracking - Dieudonne Foundation.xlsx - December 25.pdf"
let mothershipInvoicePath = "/Users/stephanechery/Downloads/TheMothership_December_Invoice.pdf"
let wraparoundInvoicePath = "/Users/stephanechery/Downloads/Dieudonne Foundation_Doula_Wraparound_PP_Dec2025.pdf"
let contractorPaymentsPath = "/Users/stephanechery/Downloads/DieudonneFoundation_ContractorPayments_December_2025.pdf"

let orderedSources = [
    hfiWorkbookPath,
    coverSheetPath,
    expenseTrackingPath,
    ctmaInvoicePath,
    mothershipInvoicePath,
    monicaProofPath,
    farahInvoicePath,
    farahProofPath,
    wraparoundInvoicePath,
    contractorPaymentsPath
]

let merged = PDFDocument()
var insertIndex = 0

for source in orderedSources {
    guard let doc = PDFDocument(url: URL(fileURLWithPath: source)) else {
        print("Warning: Could not open \(source)")
        continue
    }

    for pageIndex in 0..<doc.pageCount {
        if let page = doc.page(at: pageIndex) {
            merged.insert(page, at: insertIndex)
            insertIndex += 1
        }
    }
}

if merged.write(to: URL(fileURLWithPath: outputPacket)) {
    print("Created packet: \(outputPacket)")
    print("Page count: \(merged.pageCount)")
} else {
    print("Failed to write merged packet")
}

if let verifyDoc = PDFDocument(url: URL(fileURLWithPath: outputPacket)) {
    for i in 0..<verifyDoc.pageCount {
        let snippet = (verifyDoc.page(at: i)?.string ?? "")
            .replacingOccurrences(of: "\\s+", with: " ", options: .regularExpression)
        print("[Page \(i + 1)] \(String(snippet.prefix(110)))")
    }
}
