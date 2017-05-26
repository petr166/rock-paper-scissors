import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';

import { GameService } from '../../services/game.service';
import { AuthService } from "../../services/auth.service";


@Component({
  selector: 'app-game-root',
  templateUrl: './game-root.component.html',
  styleUrls: ['./game-root.component.scss']
})

export class GameRootComponent implements OnInit, OnDestroy {
  private user: any;
  private choices: string[];
  private oppRefused: boolean;
  private oppChoice: string;
  private resultColor: string = '#ffffff';
  private showPlayerList: boolean;
  private showMatchList: boolean;
  private choiceInterval; // automatically toggle oppChoices until he chooses one
  private receiveGameReqObs: any;
  private receiveMatchObs: any;
  private receiveRoundResObs: any;
  private receiveLeaveMatchObs: any;
  private showWaitModal: boolean;
  private showEndMatchModal: boolean;
  private showRequestModal: boolean;
  private showLeaveMatchModal: boolean;
  private opponent: any = {};
  private match: any;
  private round: any;
  private gameInfo: any = {};
  private matchOn: boolean;
  private dropAnimation: boolean;

  constructor(
    private _gameService: GameService,
    private _authService: AuthService,
    private _el: ElementRef
  ) { }

  ngOnInit() {
    this.initializeChoices();
    this.oppChoice = '';
    this.oppRefused = false;
    this.showPlayerList = false;
    this.showMatchList = false;
    this.showWaitModal = false;
    this.showRequestModal = false;
    this.showEndMatchModal = false;
    this.showLeaveMatchModal = false;

    this.user = this._authService.getUserData();
    this._gameService.connect(this.user.username);
    this.initReceivers();
  }

  ngOnDestroy() {
    this._gameService.disconnect();
    this.destroyReceivers();
  }

  destroyReceivers(): void {
    this.receiveGameReqObs.unsubscribe();
  }

  initReceivers(): void {
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
    this._gameService.sendGameResponse(response, this.opponent);
    this.showRequestModal = false;

    if (response == true) {
      this.receiveMatchObs = this._gameService.receiveMatchData()
        .subscribe(data => {
          this.match = data.match;
          this.verifyPlayer();
          this.startMatch();

          console.log("match:", data);
        });
    }

    console.log("sent response:", response);
  }

  // TODO: use transitions to change from one state to the other
  selectChoice(choice: string){
    this.sendChoice(this.match.room, this.user.username, choice);

    this.receiveRoundResObs = this._gameService.receiveRoundResult()
      .subscribe(data => {
        this.round = data;
        this.verifyWinner(choice);

        this.resetRound();

        this.receiveRoundResObs.unsubscribe();

        console.log(data);
    });



    if(this.choices.length == 3){
      this.toggleOppChoice();
      this.choices = [choice];
      // this.resultColor = this.getResult(choice);
    }else{
      clearInterval(this.choiceInterval);
      this.initializeChoices();// TODO: remove this
      this.resultColor = '#ffffff';
    }
  }

  sendChoice(room: string, username: string, choice: string){
    this._gameService.sendChoice(room, username, choice);
    console.log("send choice:" + choice + " from:" + username + " to: " + room);
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
    }, 200);
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
        this.showPlayerList = !this.showPlayerList;
        if (data.accepted == true) {
          this.dismissWaitModal();
          this._gameService.sendJoinRequest(data.room);

          this.receiveMatchObs = this._gameService.receiveMatchData()
            .subscribe(data => {
              this.match = data.match;
              this.verifyPlayer();
              this.startMatch();

              console.log("match:", data);
            });

        } else {
          this.oppRefused = true;
        }

        subscription.unsubscribe();
      });
  };

  verifyPlayer(): void {
    let match = {
      "player": {},
      "opponent": {}
    };

    if(this.user.username == this.match.player1.username) {
      match.player = this.match.player1;
      match.opponent = this.match.player2;
    } else {
      match.player = this.match.player2;
      match.opponent = this.match.player1;
    }

    this.gameInfo.match = match;
  }

  verifyWinner(choice: string): void {
    clearInterval(this.choiceInterval);
    if(choice == this.round.choice1){
      this.oppChoice = this.round.choice2;
    } else {
      this.oppChoice = this.round.choice1;
    }

    if(this.round.winner == 0) {
      this.resultColor = '#033c73';
    } else {
      if (this.user.username == this.round.winner){
        this.resultColor = '#73a839';
        this.gameInfo.match.player.score++;
      } else {
        this.resultColor = '#c71c22';
        this.gameInfo.match.opponent.score++;
      }
    }
  }

  startMatch(): void {
    this.matchOn = true;
    this.leaveMatch();
  }

  leaveMatch(): void {
    this.receiveLeaveMatchObs = this._gameService.receiveLeaveMatch()
      .subscribe(data => {
        this.showLeaveMatchModal = true;
        this.endMatch();
        console.log(data);
      });
  }

  resetRound(): void {
    if(this.round.ended == true) {
      setTimeout(() => {
        this.showEndMatchModal = true;
      }, 1000);
    } else {
      setTimeout(()=>{
        this.resultColor = '#ffffff';
        this.initializeChoices();
    }, 2000);
    }
  }

  endMatch():void {
    this.dropAnimation = !this.dropAnimation;
    this.gameInfo = {};

    setTimeout(() => {
      this.resultColor = '#ffffff';
      this.matchOn = false;
      this.dropAnimation = !this.dropAnimation;
      this.initializeChoices();
      this.receiveLeaveMatchObs.unsubscribe();
    }, 300);
  }

  dismissWaitModal(): void {
    this.showWaitModal = false;
    this.oppRefused = false;
  }

  dismissEndMatchModal(): void {
    this.endMatch();
    this.showEndMatchModal = false;
  }

  dismissLeaveMatchModal(): void {
    this.endMatch();
    this.showLeaveMatchModal = false;
  }
}
