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

      this.sendUser(username);
      callback();
    });
  }

  disconnect(): void {
    this.socket.disconnect();
    console.log("disconnected from the game server");
  }

  sendUser(username: string): void {
    let event = "username";
    let data = {username: username};

    this.genericSend(event, data);
  }

  sendGetActive(): void {
    let event = "get-active";

    this.genericSend(event);
  }

  receiveWelcome(): any {
    return this.genericReceiver("welcome");
  }

  receiveActive(): any {
    return this.genericReceiver("active");
  }
  

  // generic method for creating an observable listening to a specific event
  genericReceiver(event: string): any {
    let observable = new Observable(observer => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });
    });

    return observable;
  }

  // generic method for sending data with a specific event
  genericSend(event: string, data: any = {}) {
    this.socket.emit(event, data);
  }

}
