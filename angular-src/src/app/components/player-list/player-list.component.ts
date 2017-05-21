import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})

export class PlayerListComponent implements OnInit, OnDestroy {
  private playerList: any[];
  private receiveActiveObs: any;
  @Output() gameRequestSend = new EventEmitter<string>();
  private username: string;

  constructor(private _gameService: GameService, private _authService: AuthService) {}

  ngOnInit() {
    this.initReceivers();
    this._gameService.sendGetActive();
    this.username = this._authService.getUser().username || "petru";
  }

  ngOnDestroy() {
    this.destroyReceivers();
  }

  initReceivers(): void {
    this.receiveActiveObs = this._gameService.receiveActive()
      .subscribe(data => {
        if (data.active.length > 0) {
          this.playerList = data.active;
          this.removePlayer();
          console.log(data);
        }
      });
  }

  onPlayerClick(id: string): boolean {
    this.gameRequestSend.emit(id);
    return false;
  }

  removePlayer(): void {
    for(let i = 0; i < this.playerList.length; i++) {
      if(this.username == this.playerList[i].username) {
        this.playerList.splice(i, 1);
      }
    }
  }

  destroyReceivers(): void {
    this.receiveActiveObs.unsubscribe();
  }

}
