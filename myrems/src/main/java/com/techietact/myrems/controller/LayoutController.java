package com.techietact.myrems.controller;

import java.io.File;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.techietact.myrems.bean.LayoutBO;
import com.techietact.myrems.entity.Layout;
import com.techietact.myrems.service.LayoutService;

@RestController
@RequestMapping("/api/layouts")
@CrossOrigin("*")
public class LayoutController {

    @Autowired
    private LayoutService layoutService;

    private static final String PDF_UPLOAD_PATH = "D:/layout-pdfs/";

    @PostMapping("/create")
    public ResponseEntity<Layout> createLayout(@RequestBody LayoutBO layoutBO) {
        return ResponseEntity.ok(layoutService.createLayout(layoutBO));
    }

    @GetMapping
    public List<Layout> getAllLayouts() {
        return layoutService.findAllLayoutsAsc();
    }

    @GetMapping("/{layoutName}")
    public LayoutBO getLayout(@PathVariable String layoutName) {
        return layoutService.getLayoutByLayoutName(layoutName);
    }

    @PutMapping("/{layoutName}")
    public LayoutBO updateLayout(@PathVariable String layoutName,
                                 @RequestBody LayoutBO layoutBO) {
        return layoutService.updateLayout(layoutName, layoutBO);
    }

    @DeleteMapping("/{layoutName}")
    public void deleteLayout(@PathVariable String layoutName) {
        layoutService.deleteLayout(layoutName);
    }

    // ⭐ Upload Layout + PDF
    @PostMapping("/createWithPdf")
    public ResponseEntity<Layout> createLayoutWithPdf(
            @RequestPart("layoutData") LayoutBO layoutBO,
            @RequestPart("layoutPdf") MultipartFile file) throws Exception {

        File dir = new File(PDF_UPLOAD_PATH);
        if (!dir.exists()) dir.mkdirs();

        String filePath = PDF_UPLOAD_PATH + file.getOriginalFilename();
        file.transferTo(new File(filePath));

        Layout savedLayout = layoutService.createLayout(layoutBO);
        savedLayout.setPdfPath(filePath);

        Layout updated = layoutService.saveLayout(savedLayout);

        return ResponseEntity.ok(updated);
    }

    // ⭐ VIEW PDF API
    @GetMapping("/pdf/{layoutName}")
    public ResponseEntity<?> getLayoutPdf(@PathVariable String layoutName) throws Exception {

        Layout layout = layoutService.getLayoutEntity(layoutName);

        if (layout == null || layout.getPdfPath() == null)
            return ResponseEntity.notFound().build();

        File pdfFile = new File(layout.getPdfPath());

        if (!pdfFile.exists())
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(new FileSystemResource(pdfFile));
    }
}
