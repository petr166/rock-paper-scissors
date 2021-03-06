import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateRegister(user){
    if(user.name == undefined || user.username == undefined ||
       user.email == undefined || user.password == undefined){
         return false;
    }

    if(user.name == "" || user.username == "" ||
       user.email == "" || user.password == ""){
         return false;
    }

    return true;
  }

  validateUsername(username) {
    if (username.length > 8) {
      return false;
    }
    return true;
  }

  validateEmail(email){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  isUndefined(field){
    if(field == undefined){
      return true;
    }
    return false;
  }
}
