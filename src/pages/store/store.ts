import { Component } from '@angular/core';
import { IonicPage, NavController,
         NavParams, LoadingController,
         ToastController } from 'ionic-angular';
import { MgGlobalProvider } from '../../providers/mg-global';
import { CatalogPage } from '../catalog/catalog';
import { EffectsProvider } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-store',
  templateUrl: 'store.html',
})
export class StorePage {
  stores:any;
  contador:number=0;
  isLoaded:boolean = false;
  isReady:boolean = false;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public mgService: MgGlobalProvider,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              public effects: EffectsProvider) {
    this.isReady = this.navParams.get("loaded");
  }

  openStore(store){
    this.navCtrl.setRoot(CatalogPage, {store:store, loaded:true});
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      spinner:"circles",
      content:"<b>Conectando y descargando </b> datos de Servidor..."
    });
    loading.present();
    if(!this.isReady){
      this.mgService.isReady().then(val =>{
        this.stores = val;
        console.log("VAL: ",val, "Stores:", this.stores);
        loading.dismiss();
      }).catch(err=>{
        loading.dismiss();
        this.toastCtrl.create({
          message:"No hemos podido conectarnos con el servidor, por favor verifique su conexión a internet e intente nuevamente.",
          duration:2500
        }).present();
        console.error("Error STORE: ", err);
      });
    }else{
      this.stores = this.mgService.getStores();
      loading.dismiss();

    }
  }

  ionViewDidLeave(){
    this.effects.effectFlip();
  }

}
