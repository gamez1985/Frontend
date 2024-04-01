// Import necessary modules and services

import { HubConnectionBuilder } from '@microsoft/signalr';
import { Job } from '../models/job.model';
import { DomainService } from './domain.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
// Create a service to manage WebSocket connections
export class SignalRService {
  private hubConnection: signalR.HubConnection;

  constructor(private domainService: DomainService) {
    const schemaName = this.domainService.mapDomainToSchema();
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(
        `https://localhost:7100/api/jobstatushub?context=${schemaName}`,
        {
          withCredentials: false,
        }
      )
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Customize the delay logic here if needed
          return 5000; // 3 seconds delay between retry attempts
        },
      })
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('WebSocket connection established'))
      .catch((err) =>
        console.error('Error establishing WebSocket connection:', err)
      );
  }

  // Subscribe to job status updates
  onJobDetailsUpdate(callback: (job: Job) => void): void {
    this.hubConnection.on('JobDetailsUpdate', (job: Job) => {
      callback(job);
    });
  }
}
