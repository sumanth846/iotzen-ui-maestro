import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";

export const authenticationInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authToken = localStorage.getItem('token');

  if (authToken) {
    req = req.clone({
      headers: req.headers.set('Authorization', authToken),
    });
  }
  if (req.method === 'POST' || req.method === 'PUT') {
    req = req.clone({
      headers: req.headers.set('Content-Type', 'application/json')
    });
  }

  // console.log('authenticationInterceptor', req.url, authToken)
  return next(req);
};
