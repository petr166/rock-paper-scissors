import { Component, OnInit, OnDestroy } from '@angular/core';

import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-ongoing-games',
  templateUrl: './ongoing-games.component.html',
  styleUrls: ['./ongoing-games.component.scss']
})
export class OngoingGamesComponent implements OnInit, OnDestroy {
  private games: Object[];
  private receiveActiveObs: any;

  constructor(private _gameService: GameService) { }

  ngOnInit() {
    this.initReceivers();
    this._gameService.sendGetActive();
  }

  ngOnDestroy() {
    this.destroyReceivers();
  }

  initReceivers(): void {
    this.receiveActiveObs = this._gameService.receiveMatches()
      .subscribe(data => {
          this.games = data.matches;
          console.log(data);
      });
  }

  // getPlayersInMatch(){
  //   let players: string[] = [];

  //   for (let game of this.games) {
  //     if (players.indexOf(game['player1']) == -1) {
  //       players.push(game['player1']);
  //     }
  //     if (players.indexOf(game['player2']) == -1) {
  //       players.push(game['player2']);
  //     }
  //   }

  //   return players;
  // }

  destroyReceivers(): void {
    this.receiveActiveObs.unsubscribe();
  }

}
