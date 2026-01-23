import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GalleryServiceService {

   private baseUrl = 'http://localhost:8080/api/gallery';

  constructor(private http: HttpClient) {}

upload(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return this.http.post<any>(this.baseUrl + '/upload', formData); // returns JSON
}

getAll() {
  return this.http.get<any[]>(this.baseUrl + '/list');
}

delete(id: number) {
  console.log('Gallery service: attempting to delete ID', id);
  const url = this.baseUrl + '/delete/' + id;
  console.log('Delete URL:', url);
  return this.http.delete(url, { responseType: 'text' });
}

}
