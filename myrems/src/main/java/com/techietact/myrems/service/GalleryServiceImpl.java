package com.techietact.myrems.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.techietact.myrems.entity.Gallery;
import com.techietact.myrems.repository.GalleryRepository;

@Service
public class GalleryServiceImpl implements GalleryService {

	@Autowired
    private GalleryRepository repo;
    
    public Gallery uploadFile(MultipartFile file) throws IOException {
        String folderPath = "uploads/";
        File folder = new File(folderPath);
        if (!folder.exists()) folder.mkdirs();

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(folderPath);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Files.copy(file.getInputStream(), uploadPath.resolve(fileName));

        Gallery gallery = new Gallery();
        gallery.setFileName(fileName);
        gallery.setFilePath("/uploads/" + fileName);
        gallery.setFileType(file.getContentType());

        System.out.println("Saved file: " + fileName + " with path: " + gallery.getFilePath());
        System.out.println("Physical file location: " + uploadPath.resolve(fileName).toAbsolutePath());

        return repo.save(gallery);
    }

    

    public List<Gallery> getAll() {
        return repo.findAll();
    }
    
    @Transactional
    public void deleteById(int id) {
        System.out.println("Attempting to delete gallery with id: " + id);
        
        // Find the gallery record
        Gallery gallery = repo.findById(id).orElseThrow(() -> 
            new RuntimeException("Image not found with id: " + id));
        
        System.out.println("Found gallery record: " + gallery.getFileName());
        
        // Delete from database
        repo.deleteById(id);
        System.out.println("Deleted database record for id: " + id);
        
        // Delete physical file
        String fileName = gallery.getFileName();
        Path filePath = Paths.get("uploads", fileName);
        
        try {
            boolean deleted = Files.deleteIfExists(filePath);
            if (deleted) {
                System.out.println("Successfully deleted physical file: " + fileName);
            } else {
                System.out.println("Physical file did not exist: " + fileName);
            }
        } catch (IOException e) {
            System.err.println("Failed to delete physical file: " + fileName + " - " + e.getMessage());
            // Don't throw exception since database record is already deleted
        }
        
        System.out.println("Delete operation completed for id: " + id);
    }


	}
	
	

