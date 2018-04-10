import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  loadToken(){
    const token = localStorage.getItem('token');
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

  storeUserData(token, user){
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getProfile(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/authentication/profile', this.options);
  }

}
