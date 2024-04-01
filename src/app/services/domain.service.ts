import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DomainService {
  constructor() {}

  // Function to map domain to schema
  mapDomainToSchema(): string {
    const domain = window.location.hostname;
    // Your mapping logic here
    if (domain === 'backend1.website.local') {
      return 'backend1';
    } else if (domain === 'backend2.website.local') {
      return 'backend2';
    } else {
      // Default schema if domain doesn't match expected patterns
      return 'default';
    }
  }
}
