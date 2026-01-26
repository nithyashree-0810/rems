package com.techietact.myrems.config;

import java.io.File;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	 @Override
	    public void addResourceHandlers(ResourceHandlerRegistry registry) {
		     String uploadPath = new File("uploads").getAbsolutePath();
		     System.out.println("Configuring static resource handler for uploads at: " + uploadPath);
		     registry.addResourceHandler("/uploads/**")
             .addResourceLocations("file:" + uploadPath + File.separator);
		 }

	 @Override
	 public void addCorsMappings(CorsRegistry registry) {
	     registry.addMapping("/**")
	             .allowedOrigins("http://localhost:4200")
	             .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
	             .allowedHeaders("*")
	             .allowCredentials(true);
	 }
}
