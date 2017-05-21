import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';

import { GameService } from '../../services/game.service';
import { AuthService } from "../../services/auth.service";


@Component({
  selector: 'app-game-root',
  templateUrl: './game-root.component.html',
  styleUrls: ['./game-root.component.scss']
})

export class GameRootComponent implements OnInit, OnDestroy {
  private username: string;
  private choices: string[];
  private oppRefused: boolean = false;
  private oppChoice: string;
  private resultColor: string = '#ffffff';
  private myScore: number;
  private oppScore: number;
  private showPlayerList: boolean;
  private showMatchList: boolean;
  private choiceInterval; // automatically toggle oppChoices until he chooses one
  private receiveWelcomeObs: any;
  private receiveGameReqObs: any;
  private showWaitModal: boolean;
  private showRequestModal: boolean;
  private opponent: any = {};

  constructor(
    private _gameService: GameService,
    private _authService: AuthService,
    private _el: ElementRef
  ) { }

  ngOnInit() {
    this.initializeChoices();
    this.oppChoice = '';
    this.myScore = 0;
    this.oppScore = 0;
    this.showPlayerList = false;
    this.showMatchList = false;
    this.showWaitModal = false;
    this.showRequestModal = false;

    // this.username = "petru"; // we will use _authService to get the credentials
    this.username = this._authService.getUser().username || "petru";
    this._gameService.connect(this.username);
    this.initReceivers();
  }

  ngOnDestroy() {
    this._gameService.disconnect();
    this.destroyReceivers();
  }

  destroyReceivers(): void {
    this.receiveWelcomeObs.unsubscribe();
    this.receiveGameReqObs.unsubscribe();
  }

  initReceivers(): void {
    this.receiveWelcomeObs = this._gameService.receiveWelcome()
      .subscribe(data => {
        console.log(data.message);
      });

    this.receiveGameReqObs = this._gameService.receiveGameRequest()
      .subscribe(data => {
        console.log("game request:", data);
        this.opponent = data.opponent;
        this.showRequestModal = true;
      });
  }

  initializeChoices(){
    this.choices = ['rock','paper','scissors'];
  }

  sendGameResponse(response: boolean): void {
    this._gameService.sendGameResponse(response, this.opponent.id);
    this.showRequestModal = false;

    console.log("sent response:", response);
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

  onGameReqSend(id: string): void {
    this._gameService.sendGameRequest(id);
    this.showWaitModal = true;
    this.waitForResponse();
  }

  waitForResponse(): void {
    let subscription = this._gameService.receiveGameResponse()
      .subscribe(data => {
        console.log("got response:", data);
        if (data.accepted == true) {
          this.dismissWaitModal();
        } else {
          this.oppRefused = true;
        }

        subscription.unsubscribe();
      });
  };

  dismissWaitModal(): void {
    this.showWaitModal = false;
    this.oppRefused = false;
  }
}
