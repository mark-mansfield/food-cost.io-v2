//  take all incomming requests and add a header then foward new request onward
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './app/error/error.component';

//  this runs for <any> outgoing requests
// must clone request before manipulating it
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknow error occured';
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        console.log(errorMessage);
        this.dialog.open(ErrorComponent, { data: { message: errorMessage } });
        return throwError(error);
      })
    );
  }
}
