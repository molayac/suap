import { Component } from '@angular/core';
import {
  IonicPage, NavController,
  NavParams, LoadingController,
  ToastController
} from 'ionic-angular';
import { MgGlobalProvider } from '../../providers/mg-global';
import { CatalogPage } from '../catalog/catalog';

import { EffectsProvider } from '../../providers/providers';
import { Magento2ServiceProvider } from '../../providers/magento2-service/magento2-service';


@IonicPage()
@Component({
  selector: 'page-store',
  templateUrl: 'store.html',
})
export class StorePage {

  stores: any = [];
  contador: number = 0;
  isLoaded: boolean = false;
  isReady: boolean = false;
  data: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public mgService: MgGlobalProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public effects: EffectsProvider,
    private mg2Service: Magento2ServiceProvider) {

    this.stores = this.navParams.get("statusLoad");
    console.log("STORES: ", this.stores);
    this.isReady = this.navParams.get("loaded");

  }

  openStore(store) {
    this.navCtrl.push(CatalogPage, { store: store, loaded: true });
  }

  ionViewDidLoad() {
    this.effects.effectFlip();
    let loading = this.loadingCtrl.create({
      spinner: "circles",
      content: "<b>Conectando y descargando </b> datos de Servidor..."
    });
    loading.present();

    console.log("YES SETTINGS");
    this.mg2Service.getHistory().then(data => {
      loading.dismiss();
      console.log("Loaded data: ", data);
      if (data != null && data.length > 0) {
        this.stores = data
      } else {

      }
    });

  }

  ionViewDidEnter() {
  }

}
