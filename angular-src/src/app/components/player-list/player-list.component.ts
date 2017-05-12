import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {
  playerList: Object [];


  constructor() {

  }

  ngOnInit() {
    this.playerList = [
      {"nickname":"Player1", "inMatch":false},
      {"nickname":"Dana213", "inMatch":false},
      {"nickname":"Petr166", "inMatch":true},
      {"nickname":"AndreiDog", "inMatch":true},
      {"nickname":"Random", "inMatch":false},
      {"nickname":"Random", "inMatch":false},
      {"nickname":"Random", "inMatch":false},
      {"nickname":"Random", "inMatch":false},
      {"nickname":"Random", "inMatch":false},
      {"nickname":"Random", "inMatch":false},
      {"nickname":"Random", "inMatch":false},
      {"nickname":"Random", "inMatch":false},
      {"nickname":"Random", "inMatch":false},
      {"nickname":"Random", "inMatch":false},
      {"nickname":"Random", "inMatch":false},
      {"nickname":"Random", "inMatch":false},
      {"nickname":"Random", "inMatch":false},
      {"nickname":"Random", "inMatch":false}
    ]
  }

}
