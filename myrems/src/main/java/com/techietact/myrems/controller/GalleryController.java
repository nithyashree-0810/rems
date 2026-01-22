package com.techietact.myrems.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.techietact.myrems.entity.Gallery;
import com.techietact.myrems.service.GalleryService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/gallery")
public class GalleryController {
	
	 @Autowired
	    private GalleryService service;

	 @PostMapping("/upload")
	 public ResponseEntity<Gallery> upload(@RequestParam("file") MultipartFile file) {
	     try {
	         Gallery gallery = service.uploadFile(file);
	         return ResponseEntity.ok(gallery); // returns JSON of uploaded file
	     } catch (Exception e) {
	         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	     }
	 }


	    @GetMapping("/list")
	    public List<Gallery> list() {
	        return service.getAll();
	    }

	    @GetMapping("/test")
	    public ResponseEntity<String> test() {
	        return ResponseEntity.ok("Gallery API is working. Check /uploads/filename.ext for static files.");
	    }

}
