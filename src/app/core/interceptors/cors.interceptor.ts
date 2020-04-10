import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CorsInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const authReq = request.clone({
            headers: request.headers
                .set("Access-Control-Allow-Origin", "http://localhost:8080")
                .set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                .set("Access-Control-Allow-Headers", "X-Requested-With,content-type")
                .set("Access-Control-Allow-Credentials", 'true')
        });
        return next.handle(authReq);
    }
}
