import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { MgGlobalProvider } from '../../providers/mg-global';
import { MgImagen } from '../../models/mg-imagen';
import { EffectsProvider } from '../../providers/providers';
import { WelcomePage } from '../welcome/welcome';
/**
 * Generated class for the CatalogPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-catalog',
  templateUrl: 'catalog.html',
})
export class CatalogPage {
  welcomePage:any=WelcomePage;
  store: any;
  _products: any = null;
  _catalogs: any = [];
  categories: any;
  isReady: boolean = false;
  loading: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private mgService: MgGlobalProvider,
    private effects: EffectsProvider) {
    let store = navParams.get("store");
    let isReady = navParams.get("loaded");
    if (store != null && store != undefined) {
      console.log("Loading Store on Categories: ", store);
      this.store = store;
      this.categories = store.categories;
    }
  }

  ionViewDidLoad() {

  }

  showAlert(title, msg, inputs, buttons) {
    let alert;
    if (inputs == null) {
      alert = this.alertCtrl.create({
        title: title,
        subTitle: msg,
        buttons: buttons
      });
    } else {
      alert = this.alertCtrl.create({
        title: title,
        subTitle: msg,
        inputs: inputs,
        buttons: buttons
      });

    }
    alert.present();
  }

  ionViewDidLeave() {
    this.effects.effectFlip();
  }

}
