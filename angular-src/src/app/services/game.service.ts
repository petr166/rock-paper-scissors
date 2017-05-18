import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';

@Injectable()
export class GameService {
  private socket: any;
  // development
  private serverUrl: string = "http://localhost:8080"; // change to backend URL

  // build
  // private serverUrl: string = "/";

  constructor() { }

  connect(username: string, callback: Function = ()=>{}): void {
    // initialize the connection
    this.socket = io(this.serverUrl);

    this.socket.on("connect", () => {
      // this.sendUser(username);
      console.log("connected to the game server");

      this.socket.emit("username", {username: username});
      callback();
    });
  }

  disconnect(): void {
    this.socket.disconnect();
    console.log("disconnected from the game server");
  }

}
