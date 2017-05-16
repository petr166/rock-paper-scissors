import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
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
    private el: ElementRef
  ) { }

  ngOnInit() {
  }

  onLogoutClick(): boolean {
    this.onNavigate();
    console.log('log out');

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
