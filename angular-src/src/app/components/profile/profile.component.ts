import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  user: any;
  userId: string;
  changePassForm: FormGroup;

  constructor(private flashMessage: FlashMessagesService,
              private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
    this.user = {};
    this.userId = this.authService.getUserData()._id;

    // pull user data from backend
    this.authService.getProfile(this.userId).subscribe(profile => {
      this.user = profile.user;
      this.user.loses = this.calcLoses(this.user);
      this.user.winRatio = this.calcWinRatio(this.user);
    }, err => {
      return false;
    });

    this.changePassForm = this.formBuilder.group({
      oldPass: ['', Validators.required],
      newPass: ['', Validators.required]
    });
  }

  onChangePassSubmit() {
    const data = this.changePassForm.value;
    data.id = this.userId;

    this.authService.changePassword(data).subscribe(data => {
      if(data.success){
        this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
      }else{
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
      }
    });

    window.scrollTo(0,0);
    this.changePassForm.setValue({ oldPass: "", newPass: "" });
  }

  calcLoses(user: any): number {
    let loses = user.played - user.wins;
    return loses;
  }

  calcWinRatio(user: any): string {
    let ratioNum = (user.wins / user.played) * 100;
    if (isNaN(ratioNum)) {
      return "0%";
    }
    let ratio = "" + ratioNum.toFixed(1) + "%";
    return ratio;
  }

  deleteUser() {
    let data = {id: this.userId};

    this.authService.deleteUser(data).subscribe(data => {
        if(data.success){
          this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
          this.authService.logout();
          this.router.navigate(['/register']);
        }else{
          this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
        }
      });
  }
}
