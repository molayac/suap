import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';


import { WelcomePage } from '../welcome/welcome';
import { StorePage } from '../store/store';

import { MgGlobalProvider } from '../../providers/mg-global';
import { EffectsProvider } from '../../providers/providers';

import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: 'test@example.com',
    password: 'test'
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public mgService: MgGlobalProvider,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public effects:EffectsProvider) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  doLogin() {
    this.mgService.login(this.account).then((resp) => {
      console.log("logged in!");
      this.navCtrl.setRoot(StorePage);
    }).catch(err => {
      // this.navCtrl.push(WelcomePage);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  ionViewDidLeave(){
    this.effects.effectFlip();
  }
}
