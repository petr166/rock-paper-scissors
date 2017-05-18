import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})

export class PlayerListComponent implements OnInit, OnDestroy {
  private playerList: Object [];
  private receiveActiveObs: any;

  constructor(private _gameService: GameService) {}

  ngOnInit() {
    // this.playerList = [
    //   {"nickname":"Player1", "inMatch":false},
    //   {"nickname":"Dana213", "inMatch":false},
    //   {"nickname":"Petr166", "inMatch":true},
    //   {"nickname":"AndreiDog", "inMatch":true},
    //   {"nickname":"Random", "inMatch":false},
    //   {"nickname":"Random", "inMatch":false},
    //   {"nickname":"Random", "inMatch":false},
    //   {"nickname":"Random", "inMatch":false},
    //   {"nickname":"Random", "inMatch":false},
    //   {"nickname":"Random", "inMatch":false},
    //   {"nickname":"Random", "inMatch":false},
    //   {"nickname":"Random", "inMatch":false},
    //   {"nickname":"Random", "inMatch":false},
    //   {"nickname":"Random", "inMatch":false},
    //   {"nickname":"Random", "inMatch":false},
    //   {"nickname":"Random", "inMatch":false},
    //   {"nickname":"Random", "inMatch":false},
    //   {"nickname":"Random", "inMatch":false}
    // ]

    this.initReceivers();
    this._gameService.sendGetActive();

  }

  ngOnDestroy() {
    this.destroyReceivers();
  }

  initReceivers(): void {
    this.receiveActiveObs = this._gameService.receiveActive()
      .subscribe(data => {
        this.playerList = data.active;
      });
  }

  destroyReceivers(): void {
    this.receiveActiveObs.unsubscribe();
  }

}
