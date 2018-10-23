//  take all incomming requests and add a header then foward new request onward
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

// so we can inject a service into this service
@Injectable()
//  thsi runs for <any> outgoing requests
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();

    // must clone request before manipulating it
    const authRequest = req.clone({
      // set() adds Authorization to the header or if the item being added to the header exists it get overwritten
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)

    });
    return next.handle(authRequest);
  }
}
