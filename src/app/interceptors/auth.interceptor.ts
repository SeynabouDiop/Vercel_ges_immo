import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('🔐 Intercepting request:', req.url);
  console.log('📝 Token present:', !!token);

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ Adding Authorization header');
    return next(authReq);
  }

  console.log('❌ No token found');
  return next(req);

};
