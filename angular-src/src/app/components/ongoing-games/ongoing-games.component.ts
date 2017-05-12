import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ongoing-games',
  templateUrl: './ongoing-games.component.html',
  styleUrls: ['./ongoing-games.component.scss']
})
export class OngoingGamesComponent implements OnInit {
  private games: Object[];

  constructor() { }

  ngOnInit() {
    this.games = [
      {"player1":"Test","player2":"Haha","score1":1,"score2":1},
      {"player1":"Petru","player2":"Boy","score1":1,"score2":2},
      {"player1":"Miau","player2":"Blabla","score1":0,"score2":1},
      {"player1":"Miau","player2":"Blabla","score1":0,"score2":1},
      {"player1":"Miau","player2":"Blabla","score1":0,"score2":1},
      {"player1":"Miau","player2":"Blabla","score1":0,"score2":1},
      {"player1":"Miau","player2":"Blabla","score1":0,"score2":1},
      {"player1":"Miau","player2":"Blabla","score1":0,"score2":1},
      {"player1":"Miau","player2":"Blabla","score1":0,"score2":1},
      {"player1":"Miau","player2":"Blabla","score1":0,"score2":1},
      {"player1":"Miau","player2":"Blabla","score1":0,"score2":1},
      {"player1":"Miau","player2":"Blabla","score1":0,"score2":1},
      {"player1":"Miau","player2":"Blabla","score1":0,"score2":1},
      {"player1":"Miau","player2":"Blabla","score1":0,"score2":1},
      {"player1":"Miau","player2":"Blabla","score1":0,"score2":1},
      {"player1":"el","player2":"ea","score1":0,"score2":0}
    ];
  }

}
