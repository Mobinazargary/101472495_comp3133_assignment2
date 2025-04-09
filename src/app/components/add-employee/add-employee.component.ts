import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';

// Angular Material modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  selectedFile: File | null = null;
  fileError: string = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    // Initialize the form with updated fields.
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: [''],
      designation: ['', Validators.required],
      salary: [null, [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required],
      profilePicture: [null] // This will store the URL from the file upload.
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    this.fileError = '';
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile && !this.selectedFile.type.startsWith('image/')) {
        this.fileError = 'Selected file is not an image.';
        console.error(this.fileError);
        this.selectedFile = null;
      }
      // Optionally, add file size validations here.
    }
  }

  onSubmit(): void {
    if (!this.employeeForm.valid || this.fileError) return;
    const employeeData = this.employeeForm.value;

    if (this.selectedFile) {
      this.employeeService.uploadFile(this.selectedFile)
        .subscribe({
          next: (res: any) => {
            // Assume the backend returns the file URL as res.fileUrl.
            employeeData.profilePicture = res.fileUrl || null;
            this.createEmployee(employeeData);
          },
          error: (err) => {
            console.error('File upload error:', err);
            this.fileError = 'File upload failed.';
          }
        });
    } else {
      this.createEmployee(employeeData);
    }
  }

  private createEmployee(employeeData: any): void {
    this.employeeService.addEmployee(employeeData)
      .subscribe(() => {
        this.router.navigate(['/employees']);
      });
  }
}
