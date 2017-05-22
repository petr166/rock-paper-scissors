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

  sendGameResponse(response: boolean, opponent: any): void {
    let event = "game-response";
    let data = {"accepted": response, "opponent": opponent};

    this.genericSend(event, data);
  }

  sendGameRequest(id: string): void {
    let event = "game-request";
    let data = {id: id};

    this.genericSend(event, data);
  }

  sendJoinRequest(room: string): void {
    let event = "join";
    let data = {room: room};

    this.genericSend(event, data);
  }

  sendChoice(room: string, username: string, choice: string): void {
    let event = "choice";
    let data = {
      "room": room,
      "username": username,
      "choice": choice
    };

    this.genericSend(event, data);
  }

  receiveWelcome(): any {
    return this.genericReceiver("welcome");
  }

  receiveActive(): any {
    return this.genericReceiver("active");
  }

  receiveMatches(): any {
    return this.genericReceiver("active-matches");
  }

  receiveGameRequest(): any {
    return this.genericReceiver("game-request");
  }

  receiveGameResponse(): any {
    return this.genericReceiver("game-response");
  }

  receiveMatchData(): any {
    return this.genericReceiver("match");
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
