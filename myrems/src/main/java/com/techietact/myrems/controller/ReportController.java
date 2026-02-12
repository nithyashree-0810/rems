package com.techietact.myrems.controller;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.techietact.myrems.entity.Booking;
import com.techietact.myrems.entity.Enquiry;
import com.techietact.myrems.entity.Layout;
import com.techietact.myrems.entity.Plot;
import com.techietact.myrems.entity.Role;
import com.techietact.myrems.repository.BookingRepository;
import com.techietact.myrems.repository.EnquiryRepository;
import com.techietact.myrems.repository.LayoutRepository;
import com.techietact.myrems.repository.PlotRepository;
import com.techietact.myrems.repository.RoleRepository;

@CrossOrigin
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final LayoutRepository layoutRepository;
    private final BookingRepository bookingRepository;
    private final PlotRepository plotRepository;
    private final EnquiryRepository enquiryRepository;
    private final RoleRepository roleRepository;

    public ReportController(
            LayoutRepository layoutRepository,
            BookingRepository bookingRepository,
            PlotRepository plotRepository,
            EnquiryRepository enquiryRepository,
            RoleRepository roleRepository) {

        this.layoutRepository = layoutRepository;
        this.bookingRepository = bookingRepository;
        this.plotRepository = plotRepository;
        this.enquiryRepository = enquiryRepository;
        this.roleRepository = roleRepository;
    }

    /*
     * =========================================================
     * 🔷 COMMON PDF HELPERS
     * =========================================================
     */

    private void addCompanyHeader(Document document, String reportName) throws Exception {
        Font companyFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22);
        Font reportTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
        Font infoFont = FontFactory.getFont(FontFactory.HELVETICA, 10);

        // Company Logo/Name
        Paragraph company = new Paragraph("REMS", companyFont);
        company.setAlignment(Element.ALIGN_CENTER);
        company.setSpacingBefore(10f);
        document.add(company);

        // Report Name
        Paragraph title = new Paragraph(reportName, reportTitleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingBefore(5f);
        document.add(title);

        // Meta Info
        Paragraph info = new Paragraph(
                "Generated on: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")),
                infoFont);
        info.setAlignment(Element.ALIGN_CENTER);
        info.setSpacingAfter(20f);
        document.add(info);
    }

    private void addHeader(PdfPTable table, String text) {
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE);
        PdfPCell cell = new PdfPCell(new Phrase(text, headerFont));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(8f);
        cell.setBackgroundColor(new Color(255, 102, 0)); // Orange
        cell.setBorder(Rectangle.BOX); // Thin borders for professional look
        cell.setBorderColor(Color.LIGHT_GRAY);
        cell.setNoWrap(true);
        table.addCell(cell);
    }

    private void addCell(PdfPTable table, Object value, Color bg, int align) {
        Font font = FontFactory.getFont(FontFactory.HELVETICA, 9);
        PdfPCell cell = new PdfPCell(new Phrase(value == null ? "" : value.toString(), font));
        cell.setBackgroundColor(bg);
        cell.setPadding(6f);
        cell.setHorizontalAlignment(align);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setBorderColor(Color.LIGHT_GRAY);
        table.addCell(cell);
    }

    private void addFooter(Document document) throws Exception {
        Font footerFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
        Paragraph footer = new Paragraph(
                "© " + LocalDateTime.now().getYear() + " REMS | Confidential Report",
                footerFont);
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setSpacingBefore(20f);
        document.add(footer);
    }

    private ResponseEntity<byte[]> pdfResponse(ByteArrayOutputStream baos, String fileName) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", fileName);
        return new ResponseEntity<>(baos.toByteArray(), headers, HttpStatus.OK);
    }

    /*
     * =========================================================
     * 📄 LAYOUTS REPORT
     * =========================================================
     */

    @PostMapping("/layouts/report")
    public ResponseEntity<byte[]> layoutsReport(@RequestBody(required = false) List<Layout> layouts) {
        try {
            // If no layouts sent, fetch all
            if (layouts == null || layouts.isEmpty()) {
                layouts = layoutRepository.findAll();
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4.rotate(), 25, 25, 25, 25);
            PdfWriter.getInstance(document, baos);
            document.open();

            addCompanyHeader(document, "Layouts Master Report");

            PdfPTable table = new PdfPTable(10);
            table.setWidthPercentage(100);
            table.setHeaderRows(1);

            addHeader(table, "S.No");
            addHeader(table, "Layout Name");
            addHeader(table, "Area");
            addHeader(table, "Plots");
            addHeader(table, "Phone");
            addHeader(table, "Location");
            addHeader(table, "Address");
            addHeader(table, "Survey No");
            addHeader(table, "DTCP");
            addHeader(table, "RERA");

            int i = 1;
            for (Layout l : layouts) {
                Color bg = i % 2 == 0 ? new Color(245, 245, 245) : Color.WHITE;
                addCell(table, i++, bg, Element.ALIGN_CENTER);
                addCell(table, l.getLayoutName(), bg, Element.ALIGN_LEFT);
                addCell(table, l.getArea(), bg, Element.ALIGN_CENTER);
                addCell(table, l.getNoOfPlots(), bg, Element.ALIGN_CENTER);
                addCell(table, l.getPhone(), bg, Element.ALIGN_LEFT);
                addCell(table, l.getLocation(), bg, Element.ALIGN_LEFT);
                addCell(table, l.getAddress(), bg, Element.ALIGN_LEFT);
                addCell(table, l.getSurveyNo(), bg, Element.ALIGN_CENTER);
                addCell(table, l.isDtcpApproved() ? "YES" : "NO", bg, Element.ALIGN_CENTER);
                addCell(table, l.isReraApproved() ? "YES" : "NO", bg, Element.ALIGN_CENTER);
            }

            document.add(table);
            addFooter(document);
            document.close();

            return pdfResponse(baos, "layouts-report.pdf");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /*
     * =========================================================
     * 📄 BOOKINGS REPORT
     * =========================================================
     */

    @PostMapping("/bookings")
    public ResponseEntity<byte[]> bookingsReport(@RequestBody List<Booking> bookings) {
        try {

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4.rotate(), 25, 25, 25, 25);
            PdfWriter.getInstance(document, baos);
            document.open();

            addCompanyHeader(document, "Bookings Report");

            float[] columnWidths = { 3f, 13f, 6f, 13f, 10f, 22f, 11f, 11f, 11f };
            PdfPTable table = new PdfPTable(columnWidths);
            table.setWidthPercentage(100);
            table.setHeaderRows(1);

            addHeader(table, "S.No");
            addHeader(table, "Layout");
            addHeader(table, "Plot");
            addHeader(table, "Customer");
            addHeader(table, "Price");
            addHeader(table, "Advances");
            addHeader(table, "Paid");
            addHeader(table, "Balance");
            addHeader(table, "Status");

            int i = 1;
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd-MM-yyyy");

            for (Booking b : bookings) {

                Color bg = i % 2 == 0 ? new Color(245, 245, 245) : Color.WHITE;

                StringBuilder advancesStr = new StringBuilder();
                if (b.getAdvance1() > 0) {
                    advancesStr.append("Advance 1: ₹").append(String.format("%,d", b.getAdvance1()))
                            .append(" (").append(b.getAdvance1Date() != null ? b.getAdvance1Date().format(dtf) : "N/A")
                            .append(")\n");
                }
                if (b.getAdvance2() > 0) {
                    advancesStr.append("Advance 2: ₹").append(String.format("%,d", b.getAdvance2()))
                            .append(" (").append(b.getAdvance2Date() != null ? b.getAdvance2Date().format(dtf) : "N/A")
                            .append(")\n");
                }
                if (b.getAdvance3() > 0) {
                    advancesStr.append("Advance 3: ₹").append(String.format("%,d", b.getAdvance3()))
                            .append(" (").append(b.getAdvance3Date() != null ? b.getAdvance3Date().format(dtf) : "N/A")
                            .append(")\n");
                }
                if (b.getAdvance4() > 0) {
                    advancesStr.append("Advance 4: ₹").append(String.format("%,d", b.getAdvance4()))
                            .append(" (").append(b.getAdvance4Date() != null ? b.getAdvance4Date().format(dtf) : "N/A")
                            .append(")\n");
                }

                double paid = b.getAdvance1() +
                        b.getAdvance2() +
                        b.getAdvance3() +
                        b.getAdvance4();

                double balance = b.getPrice() - paid;

                addCell(table, i++, bg, Element.ALIGN_CENTER);
                addCell(table, b.getLayout().getLayoutName(), bg, Element.ALIGN_LEFT);
                addCell(table, b.getPlot().getPlotNo(), bg, Element.ALIGN_CENTER);
                addCell(table, b.getCustomer().getFirstName(), bg, Element.ALIGN_LEFT);
                addCell(table, String.format("₹%,.0f", b.getPrice()), bg, Element.ALIGN_RIGHT);
                addCell(table, advancesStr.toString().trim(), bg, Element.ALIGN_LEFT);
                addCell(table, String.format("₹%,.0f", paid), bg, Element.ALIGN_RIGHT);
                addCell(table, String.format("₹%,.0f", balance), bg, Element.ALIGN_RIGHT);
                addCell(table, b.getStatus(), bg, Element.ALIGN_CENTER);
            }

            document.add(table);
            addFooter(document);
            document.close();

            return pdfResponse(baos, "bookings-report.pdf");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /*
     * =========================================================
     * 📄 PLOTS REPORT
     * =========================================================
     */

    @PostMapping("/plots")
    public ResponseEntity<byte[]> plotsReport(
            @RequestBody(required = false) List<Plot> plots) {

        try {
            // 🔹 Filter illa na → ALL plots
            if (plots == null || plots.isEmpty()) {
                plots = plotRepository.findAll();
            }

            // 🔥 Sort Plots by Plot No (Numeric if possible, else String)
            plots.sort((p1, p2) -> {
                try {
                    Integer n1 = Integer.parseInt(p1.getPlotNo().replaceAll("[^0-9]", ""));
                    Integer n2 = Integer.parseInt(p2.getPlotNo().replaceAll("[^0-9]", ""));
                    return n1.compareTo(n2);
                } catch (Exception e) {
                    return p1.getPlotNo().compareToIgnoreCase(p2.getPlotNo());
                }
            });

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4.rotate(), 25, 25, 25, 25);
            PdfWriter.getInstance(document, baos);
            document.open();

            addCompanyHeader(document, "Plots Report");

            float[] columnWidths = { 5f, 18f, 10f, 18f, 10f, 14f, 12f };
            PdfPTable table = new PdfPTable(columnWidths);
            table.setWidthPercentage(100);
            table.setHeaderRows(1);

            addHeader(table, "S.No");
            addHeader(table, "Layout");
            addHeader(table, "Plot No");
            addHeader(table, "Owner");
            addHeader(table, "Sqft");
            addHeader(table, "Price");
            addHeader(table, "Status");

            int i = 1;
            for (Plot p : plots) {
                Color bg = i % 2 == 0 ? new Color(245, 245, 245) : Color.WHITE;

                addCell(table, i++, bg, Element.ALIGN_CENTER);
                addCell(table, p.getLayout().getLayoutName(), bg, Element.ALIGN_LEFT);
                addCell(table, p.getPlotNo(), bg, Element.ALIGN_CENTER);
                addCell(table, p.getOwnerName(), bg, Element.ALIGN_LEFT);
                addCell(table, String.format("%,d", (int) p.getSqft()), bg, Element.ALIGN_RIGHT);
                addCell(table, String.format("₹%,.0f", p.getPrice()), bg, Element.ALIGN_RIGHT);
                addCell(table, p.isBooked() ? "BOOKED" : "AVAILABLE",
                        bg, Element.ALIGN_CENTER);
            }

            document.add(table);
            addFooter(document);
            document.close();

            return pdfResponse(baos, "plots-report.pdf");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /*
     * =========================================================
     * 📄 ENQUIRIES REPORT ✅ NEW
     * =========================================================
     */

    @PostMapping("/enquiries")
    public ResponseEntity<byte[]> enquiriesReport(
            @RequestBody(required = false) List<Enquiry> enquiries) {

        try {
            // 🔹 If frontend body empty / null → fetch all
            if (enquiries == null || enquiries.isEmpty()) {
                enquiries = enquiryRepository.findAll();
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4.rotate(), 25, 25, 25, 25);
            PdfWriter.getInstance(document, baos);
            document.open();

            addCompanyHeader(document, "Customer Enquiries Report");

            float[] columnWidths = { 4f, 16f, 10f, 22f, 16f, 16f, 16f };
            PdfPTable table = new PdfPTable(columnWidths);
            table.setWidthPercentage(100);
            table.setHeaderRows(1);

            addHeader(table, "S.No");
            addHeader(table, "Customer Name");
            addHeader(table, "Mobile");
            addHeader(table, "Address");
            addHeader(table, "Referral Name");
            addHeader(table, "Referral Ph Number");
            addHeader(table, "Date");

            int i = 1;
            for (Enquiry e : enquiries) {
                Color bg = i % 2 == 0 ? new Color(245, 245, 245) : Color.WHITE;

                addCell(table, i++, bg, Element.ALIGN_CENTER);
                addCell(table,
                        e.getFirstName() + " " + e.getLastName(),
                        bg, Element.ALIGN_LEFT);
                addCell(table, e.getMobileNo(), bg, Element.ALIGN_CENTER);
                addCell(table, e.getAddress(), bg, Element.ALIGN_LEFT);
                addCell(table, e.getReferralName() != null ? e.getReferralName() : "-", bg, Element.ALIGN_LEFT);
                addCell(table, e.getReferralNumber() != null ? e.getReferralNumber() : "-", bg, Element.ALIGN_CENTER);
                addCell(table, e.getCreatedDate(), bg, Element.ALIGN_CENTER);
            }

            document.add(table);
            addFooter(document);
            document.close();

            return pdfResponse(baos, "enquiries-report.pdf");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/roles")
    public ResponseEntity<byte[]> roleReport(@RequestBody List<Role> roles) {
        try {

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4.rotate(), 25, 25, 25, 25);
            PdfWriter.getInstance(document, baos);
            document.open();

            addCompanyHeader(document, "Role Report");

            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);

            addHeader(table, "S.No");
            addHeader(table, "Name");
            addHeader(table, "Mobile");
            addHeader(table, "Address");

            int i = 1;
            for (Role v : roles) {
                Color bg = i % 2 == 0 ? new Color(245, 245, 245) : Color.WHITE;

                addCell(table, i++, bg, Element.ALIGN_CENTER);
                addCell(table, v.getFirstName() + " " + v.getLastName(), bg, Element.ALIGN_LEFT);
                addCell(table, v.getMobileNo(), bg, Element.ALIGN_CENTER);
                addCell(table, v.getAddress(), bg, Element.ALIGN_LEFT);
            }

            document.add(table);
            document.close();

            return pdfResponse(baos, "roles-report.pdf");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
