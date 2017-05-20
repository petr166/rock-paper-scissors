import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})

export class PlayerListComponent implements OnInit, OnDestroy {
  private playerList: Object [];
  private receiveActiveObs: any;
  @Output() gameRequestSend = new EventEmitter<string>();

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
        if (data.active.length > 0) {
          this.playerList = data.active;
          console.log(data);
        }
      });
  }

  onPlayerClick(id: string): boolean {
    this.gameRequestSend.emit(id);
    return false;
  }

  destroyReceivers(): void {
    this.receiveActiveObs.unsubscribe();
  }

}
