import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class UserInteractionService {

  constructor() { }

  askToPlay(player){
    console.log('waiting for '+player);
  }
}
