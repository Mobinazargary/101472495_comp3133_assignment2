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
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

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
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
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
    // Initialize the form with updated fields from your model.
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: [''],
      designation: ['', Validators.required],
      salary: [null, [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required],
      profilePicture: [null]  // Holds existing or new image URL.
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    if (this.employeeId) {
      this.employeeService.getEmployeeById(this.employeeId).subscribe(employee => {
        // Convert the backend date_of_joining string into a Date object.
        let doj: Date = new Date(employee.date_of_joining);
        // If the conversion is invalid, default to the current date.
        if (isNaN(doj.getTime())) {
          doj = new Date();
        }
        this.employeeForm.patchValue({
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          gender: employee.gender,
          designation: employee.designation,
          salary: employee.salary,
          date_of_joining: doj,
          department: employee.department,
          profilePicture: employee.profilePicture
        });
      });
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        if (!this.selectedFile.type.startsWith('image/')) {
          console.error('Selected file is not an image.');
          this.selectedFile = null;
          return;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrl = e.target.result; // Set preview URL for display.
        };
        reader.onerror = (error) => {
          console.error('Error reading file:', error);
        };
        reader.readAsDataURL(this.selectedFile);
      }
    }
  }

  onSubmit(): void {
    if (this.employeeForm.valid && this.employeeId) {
      const employeeData = this.employeeForm.value;
      if (this.selectedFile) {
        // Upload new file if selected.
        this.employeeService.uploadFile(this.selectedFile).subscribe({
          next: (res: any) => {
            // Assume the backend returns the URL under res.fileUrl.
            employeeData.profilePicture = res.fileUrl || employeeData.profilePicture;
            this.updateEmployeeRecord(employeeData);
          },
          error: (err) => {
            console.error('File upload error:', err);
          }
        });
      } else {
        // No new file selected; update using existing data.
        this.updateEmployeeRecord(employeeData);
      }
    }
  }

  private updateEmployeeRecord(employeeData: any): void {
    this.employeeService.updateEmployee(this.employeeId, employeeData).subscribe(() => {
      this.router.navigate(['/employees']);
    });
  }

  // Getter to display the image: if a new file is selected, show its preview; otherwise, show the existing image.
  get displayedImage(): string | null {
    return this.previewUrl || this.employeeForm.value.profilePicture;
  }
}
