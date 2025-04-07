// src/app/services/authentication.service.ts
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Replace with your actual Heroku URL + /graphql
  private graphqlUrl = 'https://backend-assignments-900507d4d58f.herokuapp.com/graphql';

  constructor() { }

  login(credentials: { email: string; password: string }): Observable<any> {
    const mutation = `
      mutation {
        login(email: "${credentials.email}", password: "${credentials.password}") {
          token
        }
      }
    `;
    return from(
      axios.post(this.graphqlUrl, { query: mutation })
        .then(response => response.data.data.login)
    );
  }

  signup(user: { name: string; email: string; password: string }): Observable<any> {
    // *** IMPORTANT FIX: No "userInput" ***
    const mutation = `
      mutation {
        signup(name: "${user.name}", email: "${user.email}", password: "${user.password}") {
          token
        }
      }
    `;
    return from(
      axios.post(this.graphqlUrl, { query: mutation })
        .then(response => response.data.data.signup)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
