package com.techietact.myrems.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.techietact.myrems.entity.Gallery;

public interface GalleryService {
	
	    Gallery uploadFile(MultipartFile file) throws IllegalStateException, IOException;

	    List<Gallery> getAll();

}
