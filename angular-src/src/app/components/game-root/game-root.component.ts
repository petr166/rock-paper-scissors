import { Component, OnInit } from '@angular/core';

import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-root',
  templateUrl: './game-root.component.html',
  styleUrls: ['./game-root.component.scss']
})

export class GameRootComponent implements OnInit {
  private choices: string[];
  private oppConnected: boolean = false;
  private oppChoice: string;
  private resultColor: string = '#ffffff';
  private myScore: number;
  private oppScore: number;
  private showPlayerList: boolean;
  private showMatchList: boolean;
  private choiceInterval; // automatically toggle oppChoices until he chooses one

  constructor(private _gameService: GameService) { }

  ngOnInit() {
    this.initializeChoices();
    this.oppConnected = true;
    this.oppChoice = '';
    this.myScore = 0;
    this.oppScore = 0;
    this.showPlayerList = false;
    this.showMatchList = false;

    this._gameService.connect("petru");
  }

  initializeChoices(){
    this.choices = ['rock','paper','scissors'];
  }

  // TODO: use transitions to change from one state to the other
  selectChoice(choice){
    if(this.choices.length == 3){
      this.toggleOppChoice();
      this.choices = [choice];
      this.resultColor = this.getResult(choice);
    }else{
      clearInterval(this.choiceInterval);
      this.initializeChoices();// TODO: remove this
      this.resultColor = '#ffffff';
    }
  }

  // TODO: set a timer to automatically change the oppChoice every 500 ms
  toggleOppChoice(){
    this.choiceInterval = setInterval(()=>{
      if(this.oppChoice == 'rock'){
        this.oppChoice = 'paper';
      }else if(this.oppChoice == 'paper'){
        this.oppChoice = 'scissors';
      }else{
        this.oppChoice = 'rock';
      }
    },500);
  }

  getResult(myChoice){
    if((myChoice == 'rock' && this.oppChoice == 'paper') ||
       (myChoice == 'paper' && this.oppChoice == 'scissors') ||
       (myChoice == 'scissors' && this.oppChoice == 'rock')){
         this.oppScore ++;
         return '#c71c22'; //lose
    }else if(myChoice == this.oppChoice){
      return '#033c73'; //draw
    }
    this.myScore ++;
    return '#73a839'; //win
  }

  endGame(){
    this.myScore = 0;
    this.oppScore = 0;
  }

  onPlayersClick(): void {
    this.showMatchList = false;
    this.showPlayerList = !this.showPlayerList;
  }

  onMatchesClick(): void {
    this.showPlayerList = false;
    this.showMatchList = !this.showMatchList;
  }
}
