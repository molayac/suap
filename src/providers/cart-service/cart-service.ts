import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from '../api';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';

/*
  Generated class for the CartServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CartService {
  items:any[]=[];
  constructor(public api: Api, public alertCtrl: AlertController) {
    console.log('Hello CartServiceProvider Provider');
  }

  addItem( new_item:any){
    for(let item of this.items){
      if(item.id == new_item.id){
        item.cant += new_item.cant;
        return;
      }
    }
  }

}
