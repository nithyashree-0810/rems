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
  showModal: boolean = false;
  selectedImage: any = null;

  constructor(private galleryService: GalleryServiceService) {}

  ngOnInit() {
    this.loadGallery();
  }

  // Load gallery images from backend
  loadGallery() {
    this.galleryService.getAll().subscribe({
      next: (res) => {
        this.galleryList = res.map(item => ({
          ...item,
          fullPath: 'http://localhost:8080' + item.filePath
        }));
        console.log('Gallery loaded successfully. Total images:', this.galleryList.length);
      },
      error: (err) => {
        console.error('Failed to load gallery:', err);
        alert('Failed to load gallery images. Please check if the backend is running.');
      }
    });
  }

  // Select file
  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Upload file and update gallery immediately
  upload() {
    if (!this.selectedFile) {
      alert('Please select a file first');
      return;
    }
    
    this.galleryService.upload(this.selectedFile).subscribe({
      next: (res) => {
        alert('Uploaded Successfully');
        res.fullPath = 'http://localhost:8080' + res.filePath;
        this.galleryList.push(res);
        this.selectedFile = undefined;
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: (err) => {
        console.error('Upload failed:', err);
        alert('Upload failed: ' + (err.error?.message || err.message || 'Unknown error'));
      }
    });
  }

  // View image in modal
  viewImage(item: any) {
    this.selectedImage = item;
    this.showModal = true;
  }

  // Close modal
  closeModal() {
    this.showModal = false;
    this.selectedImage = null;
  }

  // Delete image
  deleteImage(item: any) {
    if (!item || !item.id) {
      alert('Invalid image data - missing ID');
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${item.fileName}?`)) {
      this.galleryService.delete(item.id).subscribe({
        next: (response) => {
          console.log('Delete successful:', response);
          alert('Image deleted successfully');
          // Remove from local array
          this.galleryList = this.galleryList.filter(img => img.id !== item.id);
          // Close modal if it's the selected image
          if (this.showModal && this.selectedImage?.id === item.id) {
            this.closeModal();
          }
        },
        error: (error) => {
          console.error('Delete failed:', error);
          alert('Failed to delete image. Please try again.');
        }
      });
    }
  }

  // Debug methods
  onImageError(event: any, item: any) {
    console.error('Image failed to load:', {
      filePath: item.filePath,
      fullPath: item.fullPath,
      fileName: item.fileName,
      event: event
    });
    
    // Set a fallback image or hide the broken image
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
    
    // You could also set a placeholder image:
    // imgElement.src = 'assets/images/placeholder.png';
  }

  onImageLoad(event: any, item: any) {
    console.log('Image loaded successfully:', {
      filePath: item.filePath,
      fullPath: item.fullPath,
      fileName: item.fileName
    });
  }

  // Refresh gallery
  refreshGallery() {
    this.loadGallery();
  }
}
