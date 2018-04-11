import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()  
export class AuthService {

	domain = "http://localhost:8080"; // Development Domain - Not needed in production
  authToken;
  user;
  options;

  constructor(
  	private http: HttpClient,
  ) { }

  createAuthenticationHeaders(){
    this.loadToken();
    this.options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.authToken
      })
    };
  }

  // Function to get token from client local storage
  loadToken(){
    const token = localStorage.getItem('token'); // Get token and asssign to variable to be used elsewhere
    this.authToken = token;
  }

  // Function to register user accounts
  registerUser(user){
  	return this.http.post(this.domain + '/authentication/register', user);
  }

  // Function to check if username is taken
  checkUsername(username){
  	return this.http.get(this.domain + '/authentication/checkUsername/' + username);
  }

  // Function to check if email is taken
  checkEmail(email){
  	return this.http.get(this.domain + '/authentication/checkEmail/' + email);
  }

  login(user) {
    return this.http.post(this.domain + '/authentication/login', user);
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
  
  // Store user's data in client local storage
  storeUserData(token, user){
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  // Get user's profile data
  getProfile(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/authentication/profile', this.options);
  }

  // Check if user's loggin expiered
  loggedInExpired(){
    const jwtHelper: JwtHelperService = new JwtHelperService();
    const token = localStorage.getItem('token');
    return jwtHelper.isTokenExpired(token);
  }

}
