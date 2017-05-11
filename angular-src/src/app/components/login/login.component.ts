import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;

  constructor(private flashMessage: FlashMessagesService,
              private validateService: ValidateService,
              private router: Router) { }

  ngOnInit() {
  }

  onLoginSubmit(){
    const user = {
      username: this.username,
      password: this.password
    }

    // Custom Validations
    if(user.username == 'test' && user.password == '123'){
      this.flashMessage.show('You are now logged in', {cssClass: 'alert-success', timeout: 3000});
      this.router.navigate(['']);
    }
    if(this.validateService.isUndefined(user.username) || this.validateService.isUndefined(user.password)){
      this.flashMessage.show('Please fill in all fields.', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }
    if(user.username != 'test'){
      this.flashMessage.show("Username doesn't exist.", {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }
    if(user.password != '123'){
      this.flashMessage.show("Wrong password.", {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }
  }

}
