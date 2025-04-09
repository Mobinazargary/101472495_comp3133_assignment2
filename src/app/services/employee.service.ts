import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  // Replace these URLs with your actual backend endpoints.
  private graphqlUrl = 'https://backend-assignments-900507d4d58f.herokuapp.com/graphql';
  private uploadUrl = 'https://backend-assignments-900507d4d58f.herokuapp.com/upload';

  constructor() { }

  // Fetch all employees with updated fields.
  getEmployees(): Observable<any> {
    const query = `
      query {
        employees {
          id
          first_name
          last_name
          email
          profilePicture
          gender
          designation
          salary
          date_of_joining
          department
          created_at
          updated_at
        }
      }
    `;
    return from(
      axios.post(this.graphqlUrl, { query })
        .then(response => response.data.data.employees)
    );
  }

  // Fetch a single employee by ID.
  getEmployeeById(id: string): Observable<any> {
    const query = `
      query {
        employee(id: "${id}") {
          id
          first_name
          last_name
          email
          profilePicture
          gender
          designation
          salary
          date_of_joining
          department
          created_at
          updated_at
        }
      }
    `;
    return from(
      axios.post(this.graphqlUrl, { query })
        .then(response => response.data.data.employee)
    );
  }

  // Upload a file and return the file URL.
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return from(
      axios.post(this.uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    ).pipe(
      map(response => response.data) // Expecting { fileUrl: '...' }
    );
  }

  // GraphQL mutation for adding an employee with updated fields.
  addEmployee(employee: any): Observable<any> {
    const mutation = `
      mutation {
        addEmployee(
          first_name: "${employee.first_name}",
          last_name: "${employee.last_name}",
          email: "${employee.email}",
          gender: "${employee.gender || ''}",
          designation: "${employee.designation}",
          salary: ${employee.salary},
          date_of_joining: "${new Date(employee.date_of_joining).toISOString()}",
          department: "${employee.department}",
          profilePicture: "${employee.profilePicture || ''}"
        ) {
          id
          first_name
          last_name
          email
          gender
          designation
          salary
          date_of_joining
          department
          profilePicture
          created_at
          updated_at
        }
      }
    `;
    return from(
      axios.post(this.graphqlUrl, { query: mutation })
        .then(response => response.data.data.addEmployee)
    );
  }

  // GraphQL mutation for updating an employee.
  updateEmployee(id: string, employee: any): Observable<any> {
    const mutation = `
      mutation {
        updateEmployee(
          id: "${id}",
          first_name: "${employee.first_name || ''}",
          last_name: "${employee.last_name || ''}",
          email: "${employee.email || ''}",
          gender: "${employee.gender || ''}",
          designation: "${employee.designation || ''}",
          salary: ${employee.salary || 0},
          date_of_joining: "${employee.date_of_joining ? new Date(employee.date_of_joining).toISOString() : ''}",
          department: "${employee.department || ''}",
          profilePicture: "${employee.profilePicture || ''}"
        ) {
          id
          first_name
          last_name
          email
          gender
          designation
          salary
          date_of_joining
          department
          profilePicture
          created_at
          updated_at
        }
      }
    `;
    return from(
      axios.post(this.graphqlUrl, { query: mutation })
        .then(response => response.data.data.updateEmployee)
    );
  }

  // GraphQL mutation for deleting an employee.
  deleteEmployee(id: string): Observable<any> {
    const mutation = `
      mutation {
        deleteEmployee(id: "${id}") {
          id
        }
      }
    `;
    return from(
      axios.post(this.graphqlUrl, { query: mutation })
        .then(response => response.data.data.deleteEmployee)
    );
  }
}
