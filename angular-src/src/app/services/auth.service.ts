import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  private user: any;
  private authToken: any;
  private apiUrl: string = "http://localhost:8080/user"; // !development! - change to build

  // private apiUrl: string = "/user"; // !build!


  constructor(private http: Http) { }

  registerUser(user){
    let route = this.apiUrl + "/register";
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(route, user, {headers: headers})
                    .map((res:Response) => res.json());
  }

  authenticateUser(user){
    let route = this.apiUrl + "/login";
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(route, user, {headers: headers})
                    .map((res:Response) => res.json());
  }

  changePassword(user){
    let route = this.apiUrl + "/update-password";
    this.loadUserData();
    let headers = new Headers();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post(route, user, {headers: headers})
                    .map((res:Response) => res.json());
  }

  deleteUser(user){
    let route = this.apiUrl + "/remove";
    this.loadUserData();
    let headers = new Headers();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post(route, user, {headers: headers})
                    .map((res:Response) => res.json());
  }

  getProfile(id){
    let route = this.apiUrl + "/profile/" + id;
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.get(route, {headers: headers})
                    .map((res:Response) => res.json());
  }

  storeUserData(token,user){
    localStorage.setItem('id_token',token);
    localStorage.setItem('user',JSON.stringify(user)); // localStorage can only store strings, not Objects
    this.authToken = token;
    this.user = user;
  }

  loadUserData(){
    this.authToken = localStorage.getItem('id_token');
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  getUserData() {
    this.loadUserData();
    return this.user;
  }

  loggedIn(){
    return tokenNotExpired('id_token');
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
