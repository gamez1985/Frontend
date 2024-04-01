// src/app/job.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomainService } from './domain.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private domainService: DomainService) {}

  getJobs(): Observable<any> {
    const schemaName = this.domainService.mapDomainToSchema();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Schema: schemaName,
    });

    return this.http.get(this.apiUrl, { headers });
  }

  getJob(jobId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${jobId}`);
  }

  createJob(job: any): Observable<any> {
    const schemaName = this.domainService.mapDomainToSchema();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Schema: schemaName,
    });

    return this.http.post(this.apiUrl, job, { headers });
  }

  updateJob(id: number, job: any): Observable<any> {
    const schemaName = this.domainService.mapDomainToSchema();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Schema: schemaName,
    });

    return this.http.put(`${this.apiUrl}/${id}`, job, { headers });
  }

  deleteJob(id: number): Observable<any> {
    const schemaName = this.domainService.mapDomainToSchema();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Schema: schemaName,
    });

    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
