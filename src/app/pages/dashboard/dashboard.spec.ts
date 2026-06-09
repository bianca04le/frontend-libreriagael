import { HttpClient } from '@angular/common/http';

export function getDashboardResumen(http: HttpClient) {
  return http.get('http://localhost:3000/dashboard');
}