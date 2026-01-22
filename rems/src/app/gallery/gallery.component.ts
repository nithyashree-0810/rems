import { Component, OnInit } from '@angular/core';
import { GalleryServiceService } from '../services/gallery-service.service';

@Component({
  selector: 'app-gallery',
  standalone:false,
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  selectedFile?: File;

  galleryList: any[] = [];

  constructor(private galleryService: GalleryServiceService) {}

  ngOnInit() {
    this.loadGallery();
  }

  // Load gallery images from backend
  loadGallery() {
    this.galleryService.getAll().subscribe(res => {
      this.galleryList = res;
      console.log(this.galleryList);

    });
  }

  // Select file
  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Upload file and update gallery immediately
  upload() {
    if (!this.selectedFile) return alert('Please select a file first');
    this.galleryService.upload(this.selectedFile).subscribe(
      res => {
        alert('Uploaded Successfully');
        this.galleryList.push(res); // Add the uploaded image to gallery
        this.selectedFile = undefined; // reset input
      },
      err => {
        console.error(err);
        alert('Upload failed');
      }
    );
  }

  // Debug methods
  onImageError(event: any, item: any) {
    console.error('Image failed to load:', item.filePath, event);
  }

  onImageLoad(event: any, item: any) {
    console.log('Image loaded successfully:', item.filePath);
  }
}
