package com.techietact.myrems.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.techietact.myrems.entity.Gallery;
import com.techietact.myrems.service.GalleryService;

@RestController
@CrossOrigin
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

	    @DeleteMapping("/delete/{id}")
	    public ResponseEntity<String> delete(@PathVariable int id) {
	        System.out.println("Delete request received for id: " + id);
	        
	        try {
	            service.deleteById(id);
	            System.out.println("Delete operation completed successfully for id: " + id);
	            return ResponseEntity.ok("Image deleted successfully");
	        } catch (RuntimeException e) {
	            System.err.println("Runtime error during delete: " + e.getMessage());
	            return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                    .body("Image not found: " + e.getMessage());
	        } catch (Exception e) {
	            System.err.println("Error during delete: " + e.getMessage());
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                    .body("Failed to delete image: " + e.getMessage());
	        }
	    }

}
