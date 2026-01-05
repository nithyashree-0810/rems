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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
import com.techietact.myrems.repository.BookingRepository;
import com.techietact.myrems.repository.EnquiryRepository;
import com.techietact.myrems.repository.LayoutRepository;
import com.techietact.myrems.repository.PlotRepository;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final LayoutRepository layoutRepository;
    private final BookingRepository bookingRepository;
    private final PlotRepository plotRepository;
    private final EnquiryRepository enquiryRepository;

    public ReportController(
            LayoutRepository layoutRepository,
            BookingRepository bookingRepository,
            PlotRepository plotRepository,
            EnquiryRepository enquiryRepository) {

        this.layoutRepository = layoutRepository;
        this.bookingRepository = bookingRepository;
        this.plotRepository = plotRepository;
        this.enquiryRepository = enquiryRepository;
    }

    /* =========================================================
       🔷 COMMON PDF HELPERS
    ========================================================= */

    private void addCompanyHeader(Document document, String reportName) throws Exception {
        Font companyFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);
        Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 9);

        Paragraph company = new Paragraph(
                "REMS – Real Estate Management System",
                companyFont);
        company.setAlignment(Element.ALIGN_CENTER);
        document.add(company);

        Paragraph subtitle = new Paragraph(
                reportName + "\nGenerated on: " +
                LocalDateTime.now()
                        .format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")),
                subtitleFont);
        subtitle.setAlignment(Element.ALIGN_CENTER);
        subtitle.setSpacingAfter(20f);
        document.add(subtitle);
    }

    private void addHeader(PdfPTable table, String text) {
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE);
        PdfPCell cell = new PdfPCell(new Phrase(text, headerFont));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(10f);
        cell.setBackgroundColor(new Color(45, 45, 45));
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setNoWrap(true);
        table.addCell(cell);
    }

    private void addCell(PdfPTable table, Object value, Color bg, int align) {
        Font font = FontFactory.getFont(FontFactory.HELVETICA, 8);
        PdfPCell cell = new PdfPCell(new Phrase(value == null ? "" : value.toString(), font));
        cell.setBackgroundColor(bg);
        cell.setPadding(9f);
        cell.setMinimumHeight(28f);
        cell.setHorizontalAlignment(align);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        table.addCell(cell);
    }

    private void addFooter(Document document) throws Exception {
        Font footerFont = FontFactory.getFont(FontFactory.HELVETICA, 9);
        Paragraph footer = new Paragraph(
                "© " + LocalDateTime.now().getYear() + " REMS | Confidential",
                footerFont);
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setSpacingBefore(15f);
        document.add(footer);
    }

    private ResponseEntity<byte[]> pdfResponse(ByteArrayOutputStream baos, String fileName) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", fileName);
        return new ResponseEntity<>(baos.toByteArray(), headers, HttpStatus.OK);
    }

    /* =========================================================
       📄 LAYOUTS REPORT
    ========================================================= */

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
                Color bg = i % 2 == 0 ? new Color(245,245,245) : Color.WHITE;
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


    /* =========================================================
       📄 BOOKINGS REPORT
    ========================================================= */

    @PostMapping("/bookings")
    public ResponseEntity<byte[]> bookingsReport(@RequestBody List<Booking> bookings) {
        try {

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4.rotate(), 25, 25, 25, 25);
            PdfWriter.getInstance(document, baos);
            document.open();

            addCompanyHeader(document, "Bookings Report");

            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100);
            table.setHeaderRows(1);

            addHeader(table, "S.No");
            addHeader(table, "Layout");
            addHeader(table, "Plot");
            addHeader(table, "Customer");
            addHeader(table, "Price");
            addHeader(table, "Paid");
            addHeader(table, "Balance");
            addHeader(table, "Status");

            int i = 1;
            for (Booking b : bookings) {

                Color bg = i % 2 == 0 ? new Color(245,245,245) : Color.WHITE;

                double paid =
                    b.getAdvance1() +
                    b.getAdvance2() +
                    b.getAdvance3() +
                    b.getAdvance4();

                double balance = b.getPrice() - paid;

                addCell(table, i++, bg, Element.ALIGN_CENTER);
                addCell(table, b.getLayout().getLayoutName(), bg, Element.ALIGN_LEFT);
                addCell(table, b.getPlot().getPlotNo(), bg, Element.ALIGN_CENTER);
                addCell(table, b.getCustomer().getFirstName(), bg, Element.ALIGN_LEFT);
                addCell(table, b.getPrice(), bg, Element.ALIGN_RIGHT);
                addCell(table, paid, bg, Element.ALIGN_RIGHT);
                addCell(table, balance, bg, Element.ALIGN_RIGHT);
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


    /* =========================================================
       📄 PLOTS REPORT
    ========================================================= */

    @PostMapping("/plots")
    public ResponseEntity<byte[]> plotsReport(
            @RequestBody(required = false) List<Plot> plots) {

        try {
            // 🔹 Filter illa na → ALL plots
            if (plots == null || plots.isEmpty()) {
                plots = plotRepository.findAll();
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4.rotate(), 25, 25, 25, 25);
            PdfWriter.getInstance(document, baos);
            document.open();

            addCompanyHeader(document, "Plots Report");

            PdfPTable table = new PdfPTable(7);
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
                Color bg = i % 2 == 0 ? new Color(245,245,245) : Color.WHITE;

                addCell(table, i++, bg, Element.ALIGN_CENTER);
                addCell(table, p.getLayout().getLayoutName(), bg, Element.ALIGN_LEFT);
                addCell(table, p.getPlotNo(), bg, Element.ALIGN_CENTER);
                addCell(table, p.getOwnerName(), bg, Element.ALIGN_LEFT);
                addCell(table, p.getSqft(), bg, Element.ALIGN_RIGHT);
                addCell(table, p.getPrice(), bg, Element.ALIGN_RIGHT);
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


    /* =========================================================
       📄 ENQUIRIES REPORT  ✅ NEW
    ========================================================= */

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

            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setHeaderRows(1);

            addHeader(table, "S.No");
            addHeader(table, "Customer Name");
            addHeader(table, "Mobile");
            addHeader(table, "Location");
            addHeader(table, "Address");
            addHeader(table, "Date");

            int i = 1;
            for (Enquiry e : enquiries) {
                Color bg = i % 2 == 0 ? new Color(245,245,245) : Color.WHITE;

                addCell(table, i++, bg, Element.ALIGN_CENTER);
                addCell(table,
                        e.getFirstName() + " " + e.getLastName(),
                        bg, Element.ALIGN_LEFT);
                addCell(table, e.getMobileNo(), bg, Element.ALIGN_CENTER);
                addCell(table, e.getAddress(), bg, Element.ALIGN_LEFT);
                addCell(table, e.getAddress(), bg, Element.ALIGN_LEFT);
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

}
