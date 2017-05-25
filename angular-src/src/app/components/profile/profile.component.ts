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
  changePassForm: FormGroup;

  constructor(private flashMessage: FlashMessagesService,
              private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
    // pull user data from backend
    this.user = {
      name: "Petru Birzu",
      email: "petru.birzu96@gmail.com",
      username: "petru",
      avatar: "https://api.adorable.io/avatars/140/abott@adorable.png",
      played: 10,
      wins: 6
    };
    this.user.loses = this.calcLoses(this.user);
    this.user.winRatio = this.calcWinRatio(this.user);

    this.changePassForm = this.formBuilder.group({
      oldPass: ['', Validators.required],
      newPass: ['', Validators.required]
    });

  }

  onChangePassSubmit() {
    window.scrollTo(0,0);

    const user = this.changePassForm.value;
    user.id = JSON.parse(localStorage.getItem('user'))._id;

    this.authService.changePassword(user).subscribe(data => {
      if(data.success){
        this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
      }else{
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
      }
    });

    this.changePassForm.setValue({ oldPass: "", newPass: "" });
  }

  calcLoses(user: any): number {
    let loses = user.played - user.wins;
    return loses;
  }

  calcWinRatio(user: any): string {
    let ratio = "";
    ratio += user.wins/user.played * 100;
    ratio += "%";
    return ratio;
  }

  deleteUser() {
    const user = {
      id: JSON.parse(localStorage.getItem('user'))._id
    }

    this.authService.deleteUser(user).subscribe(data => {
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
