import { Component, OnInit } from '@angular/core';
import { UserInteractionService } from '../../services/user-interaction.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {
  playerList: Object [];


  constructor(private userService: UserInteractionService) {

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

  askToPlay(player){
    this.userService.askToPlay(player);
  }


}
