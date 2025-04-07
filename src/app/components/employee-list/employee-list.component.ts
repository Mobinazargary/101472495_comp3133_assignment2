// src/app/components/employee-list/employee-list.component.ts
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'; // Added here

// Optional pipe if you have it
import { NameFormatPipe } from '../../pipes/name-format.pipe';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatCardModule,
    MatIconModule, // Added in the imports array
    NameFormatPipe
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];          // Full list from server
  filteredEmployees: any[] = [];  // Displayed list in the table
  searchQuery: string = '';

  constructor(private employeeService: EmployeeService, public router: Router) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
      this.filteredEmployees = data; // Start with everything visible
    });
  }

  onSearch(): void {
    if (this.searchQuery) {
      this.filteredEmployees = this.employees.filter(emp =>
        emp.department.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        emp.position.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      // If search query is empty, restore the full list
      this.filteredEmployees = this.employees;
    }
  }

  viewDetails(id: string): void {
    this.router.navigate(['/employee', id]);
  }

  editEmployee(id: string): void {
    this.router.navigate(['/employee/edit', id]);
  }

  deleteEmployee(id: string): void {
    this.employeeService.deleteEmployee(id).subscribe(() => {
      this.loadEmployees();
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
