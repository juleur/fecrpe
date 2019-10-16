import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileUploaderService {

  constructor(private http: HttpClient) { }

  addFile(data: FormGroup): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('title', data.controls.title.value);
    formData.append('description', data.controls.description.value);
    formData.append('refresherCourse', data.controls.refresherCourse.value);
    formData.append('part', data.controls.part.value);
    formData.append('type', data.controls.type.value);
    formData.append('recordedOn', data.controls.recordedOn.value);
    formData.append('file', data.controls.file.value);
    formData.append('price', data.controls.price.value);
    return this.http.post('http://localhost:5454/api/upload-file', formData, {
      reportProgress: true,
      observe: 'events',
    }).pipe(
      catchError((err: HttpErrorResponse) => {
        let errMessage = '';
        if (err.error instanceof ErrorEvent) {
          errMessage = err.error.message;
        } else {
          errMessage = `Error Code: ${err.status}\nMessage: ${err.message}`;
        }
        return throwError(errMessage);
      })
    );
  }
}
