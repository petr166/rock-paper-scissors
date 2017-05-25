import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  private user: any;
  authToken: any;

  constructor(private http: Http) { }

  registerUser(user){
    console.log('hey');
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/user/register', user, {headers: headers})
                    .map((res:Response) => res.json());
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/user/login', user, {headers: headers})
                    .map((res:Response) => res.json());
  }

  changePassword(user){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/user/update-password', user, {headers: headers})
                    .map((res:Response) => res.json());
  }

  deleteUser(user){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/user/remove', user, {headers: headers})
                    .map((res:Response) => res.json());
  }

  getProfile(id){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:8080/user/profile/'+id, {headers: headers})
                    .map((res:Response) => res.json());
  }

  storeUserData(token,user){
    localStorage.setItem('id_token',token);
    localStorage.setItem('user',JSON.stringify(user)); // localStorage can only store strings, not Objects
    this.authToken = token;
    this.user = user;
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn(){
    return tokenNotExpired('id_token');
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  setUser(user: any): void {
    this.user = user;
  }

  getUser(): any {
    return this.user;
  }
}
