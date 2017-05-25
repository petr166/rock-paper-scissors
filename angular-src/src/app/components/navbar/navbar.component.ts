import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {

  constructor(
    private flashMessage: FlashMessagesService,
    private router: Router,
    private el: ElementRef,
    private authService: AuthService) { }

  ngOnInit() {
  }

  onLogoutClick(): boolean {
    this.authService.logout();
    this.flashMessage.show('You are logged out.', {cssClass: 'alert-success', timeout: 3000});
    this.router.navigate(['/login']);
    return false;
  }

  onNavigate(): void {
    let butt = this.el.nativeElement.querySelector(".navbar-toggle");
    let isCollapsed = this.hasClass(butt, "collapsed");
    if (isCollapsed == false) {
      butt.click();
    }
  }

  hasClass(element, cls): boolean {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }

}
