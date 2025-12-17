package com.techietact.myrems.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.techietact.myrems.entity.Enquiry;
import com.techietact.myrems.repository.EnquiryRepository;
import com.techietact.myrems.service.EnquiryService;
@CrossOrigin("*")
@RequestMapping("/api/customer")
@RestController
public class EnquiryController {
	@Autowired
	private EnquiryService enquiryService;
	//private EnquiryRepository enquiryRepository;
	
	@PostMapping
    public ResponseEntity<?> create(@RequestBody Enquiry enquiry) {
        try {
            return ResponseEntity.ok(enquiryService.create(enquiry));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<Enquiry> getAll() {
        return enquiryService.getAll();
    }

    @GetMapping("/{mobileNo}")
    public Enquiry getById(@PathVariable Long mobileNo) {
        return enquiryService.getByMobileNo(mobileNo);
    }

    @PutMapping("/{mobileNo}")
    public ResponseEntity<?> update(@PathVariable Long mobileNo, @RequestBody Enquiry enquiry) {
        try {
            return ResponseEntity.ok(enquiryService.update(mobileNo, enquiry));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{mobileNo}")
    public ResponseEntity<String> delete(@PathVariable Long mobileNo) {
    	enquiryService.delete(mobileNo);
        return ResponseEntity.ok("Deleted Successfully");
    }

    // Duplicate check
    @GetMapping("/check-mobile/{mobileNo}")
    public boolean checkMobile(@PathVariable Long mobileNo) {
        return enquiryService.mobileExists(mobileNo);
    }

    @GetMapping("/check-email/{email}")
    public boolean checkEmail(@PathVariable String email) {
        if (email == null || email.trim().isEmpty()) {
            return false; 
        }
        return enquiryService.emailExists(email);
    }
    
    @GetMapping("/search/{keyword}")
    public List<Enquiry> search(@PathVariable String keyword) {
        return enquiryService.search(keyword);
    }
    
    @PostMapping("/{mobileNo}/image")
    public ResponseEntity<Enquiry> uploadImage(@PathVariable Long mobileNo, @RequestParam("file") MultipartFile file) {
        Enquiry enquiry = enquiryService.getByMobileNo(mobileNo);
        try {
            String baseDir = System.getProperty("user.dir") + "/uploads/customers/";
            java.nio.file.Files.createDirectories(java.nio.file.Path.of(baseDir));
            String original = file.getOriginalFilename();
            String ext = "";
            if (original != null && original.contains(".")) {
                ext = original.substring(original.lastIndexOf("."));
            }
            String filename = mobileNo + ext;
            java.nio.file.Path path = java.nio.file.Path.of(baseDir + filename);
            java.nio.file.Files.write(path, file.getBytes());
            enquiry.setProfileImagePath("/uploads/customers/" + filename);
            enquiryService.update(mobileNo, enquiry);
            return ResponseEntity.ok(enquiry);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

}
	


