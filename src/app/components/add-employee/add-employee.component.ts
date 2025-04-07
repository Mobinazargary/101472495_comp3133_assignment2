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
    MatButtonModule
  ],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  selectedFile: File | null = null;
  fileError: string = "";  // Property to hold file error messages

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      department: ['', Validators.required],
      position: ['', Validators.required],
      // We'll store the final file URL here (once we get it from the backend)
      profilePicture: [null]
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    // Reset previous file error
    this.fileError = "";
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        // Optional: Check if the file is an image
        if (!this.selectedFile.type.startsWith('image/')) {
          this.fileError = 'Selected file is not an image.';
          console.error(this.fileError);
          this.selectedFile = null;
        }
        // Optional: Check file size, if you want to limit
        // ...
      }
    }
  }

  onSubmit(): void {
    // Check required fields
    if (!this.employeeForm.valid) return;

    // If there's a file error, don't proceed
    if (this.fileError) return;

    const employeeData = this.employeeForm.value;

    // If a file is selected, upload it first
    if (this.selectedFile) {
      this.employeeService.uploadFile(this.selectedFile)
        .subscribe({
          next: (res: any) => {
            // res.fileUrl is the URL from the backend
            employeeData.profilePicture = res.fileUrl || null;
            this.createEmployee(employeeData);
          },
          error: (err) => {
            console.error('File upload error:', err);
            this.fileError = 'File upload failed.';
          }
        });
    } else {
      // No file selected, just create employee with no profilePicture
      this.createEmployee(employeeData);
    }
  }

  // Helper method to call the GraphQL addEmployee
  private createEmployee(employeeData: any) {
    this.employeeService.addEmployee(employeeData).subscribe(() => {
      this.router.navigate(['/employees']);
    });
  }
}
