import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  name: string;
  username: string;
  email: string;
  password: string;

  constructor(private flashMessage: FlashMessagesService,
              private validateService: ValidateService,
              private router: Router) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password
    }

    // Custom Validations
    if(!this.validateService.validateRegister(user)){
      this.flashMessage.show('Please fill in all fields.', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    if(!this.validateService.validateUsername(user.username)){
      this.flashMessage.show('Username should not exceed 8 characters.', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    if(!this.validateService.validateEmail(user.email)){
      this.flashMessage.show('Please use a valid email.', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    this.flashMessage.show('You are now registered and can log in.', {cssClass: 'alert-success', timeout: 3000});
    this.router.navigate(['/login']);
  }
}
