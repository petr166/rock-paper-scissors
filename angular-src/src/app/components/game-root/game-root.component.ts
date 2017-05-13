import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-root',
  templateUrl: './game-root.component.html',
  styleUrls: ['./game-root.component.scss']
})
export class GameRootComponent implements OnInit {
  private choices: string[];
  private oppChoice: string;

  constructor() { }

  ngOnInit() {
    this.initializeChoices();
    this.oppChoice = 'rock';
  }

  initializeChoices(){
    this.choices = ['rock','paper','scissors'];
  }

  // TODO: use transitions to change from one state to the other
  selectChoice(choice){
    if(this.choices.length == 3){
      this.toggleOppChoice();
      this.choices = [choice];
    }else{ // TODO: remove this
      this.initializeChoices();
    }
  }

  // TODO: set a timer to automatically change the oppChoice every 500 ms
  toggleOppChoice(){
    if(this.oppChoice == 'rock'){
      this.oppChoice = 'paper';
    }else if(this.oppChoice == 'paper'){
      this.oppChoice = 'scissors';
    }else{
      this.oppChoice = 'rock';
    }
  }


}
