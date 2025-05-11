import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://localhost:5211/api';

  constructor(private http: HttpClient) {}

  /**
   * GET /api/{resource}
   */
  getAll<T>(resource: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${resource}`);
  }

  /**
   * GET /api/{resource}/{id}
   */
  getById<T>(resource: string, id: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${resource}/${id}`);
  }

  /**
   * POST /api/{resource}
   */
  create<TRequest, TResponse = { id: string }>(
    resource: string,
    body: TRequest
  ): Observable<TResponse> {
    return this.http.post<TResponse>(`${this.baseUrl}/${resource}`, body, {
      headers: this.defaultHeaders(),
    });
  }

  /**
   * DELETE /api/{resource}/{id}
   */
  delete<TResponse>(resource: string, id: string): Observable<TResponse> {
    return this.http.delete<TResponse>(`${this.baseUrl}/${resource}/${id}`, {
      headers: this.defaultHeaders(),
    });
  }

  /**
   * GET /api/{resource}?param1=value1&param2=value2
   */
  get<T>(
    resource: string,
    queryParams: Record<string, string | number | boolean>
  ): Observable<T> {
    let params = new HttpParams();

    for (const key in queryParams) {
      const value = queryParams[key];
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    }

    return this.http.get<T>(`${this.baseUrl}/${resource}`, {
      params,
      headers: this.defaultHeaders(),
    });
  }

  /**
   * Headers padrão
   */
  private defaultHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }
  /**
   * PATCH /api/{resource}/{id}
   */
  patch<TRequest, TResponse = void>(
    resource: string,
    id: string,
    body: TRequest
  ): Observable<TResponse> {
    return this.http.patch<TResponse>(
      `${this.baseUrl}/${resource}/${id}`,
      body,
      {
        headers: this.defaultHeaders(),
      }
    );
  }
}
