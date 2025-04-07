import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';

// Angular Material modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-employee',
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
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employeeId: string = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null; // For previewing new file

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      department: ['', Validators.required],
      position: ['', Validators.required],
      profilePicture: [null] // Holds existing or new image URL
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    if (this.employeeId) {
      this.employeeService.getEmployeeById(this.employeeId).subscribe(employee => {
        this.employeeForm.patchValue({
          name: employee.name,
          department: employee.department,
          position: employee.position,
          profilePicture: employee.profilePicture
        });
      });
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        // Optional: validate file type
        if (!this.selectedFile.type.startsWith('image/')) {
          console.error('Selected file is not an image.');
          this.selectedFile = null;
          return;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrl = e.target.result; // Set preview URL to show the new image
        };
        reader.onerror = (error) => {
          console.error('Error reading file:', error);
        };
        // Use non-null assertion operator to ensure TypeScript knows selectedFile is not null
        reader.readAsDataURL(this.selectedFile!);
      }
    }
  }

  onSubmit(): void {
    if (this.employeeForm.valid && this.employeeId) {
      const employeeData = this.employeeForm.value;
      // If a new file is selected, upload it first
      if (this.selectedFile) {
        this.employeeService.uploadFile(this.selectedFile).subscribe({
          next: (res: any) => {
            // Set the profilePicture field with the URL returned by the upload route
            employeeData.profilePicture = res.fileUrl || employeeData.profilePicture;
            this.updateEmployeeRecord(employeeData);
          },
          error: (err) => {
            console.error('File upload error:', err);
            // Optionally display an error message to the user
          }
        });
      } else {
        // No new file selected, so update employee with existing data
        this.updateEmployeeRecord(employeeData);
      }
    }
  }

  private updateEmployeeRecord(employeeData: any): void {
    this.employeeService.updateEmployee(this.employeeId, employeeData).subscribe(() => {
      this.router.navigate(['/employees']);
    });
  }

  // Getter for the image to display: if a new file was selected, show its preview; otherwise, show the existing picture
  get displayedImage(): string | null {
    return this.previewUrl || this.employeeForm.value.profilePicture;
  }
}
