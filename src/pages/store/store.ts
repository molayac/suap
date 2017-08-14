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
    console.log("STORE: ", this.data);
    this.isReady = this.navParams.get("loaded");

  }

  openStore(store) {
    this.navCtrl.setRoot(CatalogPage, { store: store, loaded: true });
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      spinner: "circles",
      content: "<b>Conectando y descargando </b> datos de Servidor..."
    });
    loading.present();
    if(this.mg2Service.isReady())
      this.isReady = true;
    if (!this.isReady) {
      this.mgService.isReady().then(val => {
        this.stores = val;
        console.log("VAL: ", val, "Stores:", this.stores);
        loading.dismiss();
      }).catch(err => {
        loading.dismiss();
        this.toastCtrl.create({
          message: "No hemos podido conectarnos con el servidor, por favor verifique su conexión a internet e intente nuevamente.",
          duration: 2500
        }).present();
        console.error("Error STORE: ", err);
      });
    } else {
      // if (this.data != null && this.data.length > 0)
      //   this.organizeStores(this.data[0]);
      //
      // if (this.data != null && this.data.length > 0)
      //   this.organizeCatalogStores(this.data);
      loading.dismiss();
      this.stores= this.mg2Service.getHistory();
    }
  }



  ionViewDidLeave() {
    this.effects.effectFlip();
  }

}
