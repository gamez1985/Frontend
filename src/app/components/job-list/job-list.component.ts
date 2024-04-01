// job-list.component.ts

import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/services/job.service';
import { Job } from 'src/app/models/job.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { JobFormComponent } from '../job-form/job-form.component';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css'],
})
export class JobListComponent implements OnInit {
  dataSource: MatTableDataSource<Job> = new MatTableDataSource<Job>();
  displayedColumns: string[] = [
    'jobType',
    'createdDate',
    'jobStatus',
    'actions',
  ];

  constructor(
    private jobService: JobService,
    public dialog: MatDialog,
    private signalrService: SignalRService
  ) {}

  ngOnInit(): void {
    this.loadJobs();
    this.signalrService.onJobDetailsUpdate((job) => {
      this.updateJob(job);
    });
  }

  updateJob(updatedJob: Job): void {
    const updatedJobs = this.dataSource.data.map((job) => {
      if (job.jobId === updatedJob.jobId) {
        return updatedJob;
      }
      return job;
    });

    this.dataSource.data = updatedJobs;
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe(
      (jobs) => {
        this.dataSource = new MatTableDataSource(jobs);
      },
      (error) => {
        console.error('Error loading jobs:', error);
      }
    );
  }

  deleteJob(jobId: number): void {
    this.jobService.deleteJob(jobId).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(
        (job) => job.jobId !== jobId
      );
    });
  }

  editJob(jobId: number): void {
    const dialogRef = this.dialog.open(JobFormComponent, {
      width: '400px',
      data: { jobId: jobId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Reload jobs after editing (you can adjust this based on your implementation)
      if (result === 'edited') {
        this.loadJobs();
      }
    });
  }

  openCreateJobDialog(): void {
    const dialogRef = this.dialog.open(JobFormComponent, {
      width: '400px',
      data: { jobId: null }, // Pass null or any default values for a new job
    });

    dialogRef.componentInstance.jobCreated.subscribe((newJob: Job) => {
      // Add the new job to the top of the table
      this.dataSource.data = [newJob, ...this.dataSource.data];
    });
  }
}
