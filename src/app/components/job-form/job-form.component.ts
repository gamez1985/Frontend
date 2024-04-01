// job-form.component.ts

import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from 'src/app/services/job.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Job } from 'src/app/models/job.model';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.css'],
})
export class JobFormComponent implements OnInit {
  jobForm: FormGroup = this.formBuilder.group({
    jobType: ['MLoD', Validators.required],
    jobStatus: ['Running', Validators.required],
  });

  isEditMode = false;
  jobId!: number;

  @Output() jobCreated = new EventEmitter(); // Emit event when a job is created

  constructor(
    private formBuilder: FormBuilder,
    private jobService: JobService,
    private dialogRef: MatDialogRef<JobFormComponent>, // Inject MatDialogRef
    @Inject(MAT_DIALOG_DATA) private dialogData: { jobId: number | null } // Inject MAT_DIALOG_DATA
  ) {}

  ngOnInit(): void {
    this.jobId = this.dialogData.jobId || 0; // Use dialogData.jobId
    this.isEditMode = !!this.jobId;

    if (this.isEditMode) {
      this.loadJob();
    }
  }

  loadJob(): void {
    this.jobService.getJob(this.jobId).subscribe((job) => {
      this.jobForm.patchValue(job);
    });
  }

  saveJob(): void {
    const jobData = this.jobForm.value;

    if (this.isEditMode) {
      this.jobService.updateJob(this.jobId, jobData).subscribe(() => {
        this.dialogRef.close('edited'); // Close the dialog after editing
      });
    } else {
      this.jobService.createJob(jobData).subscribe((newJob: Job) => {
        this.jobCreated.emit(newJob);
        this.dialogRef.close('created');
      });
    }
  }
}
