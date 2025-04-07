import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  // Replace with your actual backend URLs:
  private graphqlUrl = 'https://backend-assignments-900507d4d58f.herokuapp.com/graphql';
  private uploadUrl = 'https://backend-assignments-900507d4d58f.herokuapp.com/upload';

  constructor() { }

  getEmployees(): Observable<any> {
    const query = `
      query {
        employees {
          id
          name
          department
          position
          profilePicture
        }
      }
    `;
    return from(
      axios.post(this.graphqlUrl, { query })
        .then(response => response.data.data.employees)
    );
  }

  getEmployeeById(id: string): Observable<any> {
    const query = `
      query {
        employee(id: "${id}") {
          id
          name
          department
          position
          profilePicture
        }
      }
    `;
    return from(
      axios.post(this.graphqlUrl, { query })
        .then(response => response.data.data.employee)
    );
  }

  // New method to handle file uploads
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return from(
      axios.post(this.uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    ).pipe(
      map(response => response.data)  // Expecting { fileUrl: '...' }
    );
  }

  addEmployee(employee: any): Observable<any> {
    const mutation = `
      mutation {
        addEmployee(
          name: "${employee.name}",
          department: "${employee.department}",
          position: "${employee.position}",
          profilePicture: "${employee.profilePicture || ''}"
        ) {
          id
          name
          department
          position
          profilePicture
        }
      }
    `;
    return from(
      axios.post(this.graphqlUrl, { query: mutation })
        .then(response => response.data.data.addEmployee)
    );
  }

  updateEmployee(id: string, employee: any): Observable<any> {
    const mutation = `
      mutation {
        updateEmployee(
          id: "${id}",
          name: "${employee.name}",
          department: "${employee.department}",
          position: "${employee.position}",
          profilePicture: "${employee.profilePicture || ''}"
        ) {
          id
          name
          department
          position
          profilePicture
        }
      }
    `;
    return from(
      axios.post(this.graphqlUrl, { query: mutation })
        .then(response => response.data.data.updateEmployee)
    );
  }

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
