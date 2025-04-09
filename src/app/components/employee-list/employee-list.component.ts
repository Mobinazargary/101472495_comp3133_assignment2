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
import { MatIconModule } from '@angular/material/icon';

// Optional pipe if you use one (for example, to format a full name)
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
    MatIconModule,
    NameFormatPipe
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];          // Full list from the server
  filteredEmployees: any[] = [];  // List displayed in the table
  searchQuery: string = '';

  constructor(private employeeService: EmployeeService, public router: Router) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
      this.filteredEmployees = data; // Display everything initially
    });
  }

  onSearch(): void {
    if (this.searchQuery) {
      this.filteredEmployees = this.employees.filter(emp =>
        emp.department.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        // Use "designation" (updated field) instead of position.
        emp.designation.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredEmployees = this.employees;
    }
  }

  viewDetails(id: string): void {
    // Updated route to match new routing convention
    this.router.navigate(['/employee', id]);
  }

  editEmployee(id: string): void {
    // Updated route for editing
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
