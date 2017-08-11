import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { MgGlobalProvider } from '../../providers/mg-global';
import { MgImagen } from '../../models/mg-imagen';
import { EffectsProvider } from '../../providers/providers';

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
  _store: any;
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
      this._store = store;
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

  private loadCatalog(categories) {
    var ofertas = categories.children_data[0].children_data[0];
    ofertas.description = "Las mejores ofertas!";
    ofertas.icon = "star";
    ofertas.imagen = "./assets/images/ofertas.png";
    var alimentos = categories.children_data[0].children_data[1];
    alimentos.description = "Todo en alimentos!";
    alimentos.icon = "basket";
    alimentos.imagen = "./assets/images/alimentos.png";
    var aseo = categories.children_data[0].children_data[2];
    aseo.description = "Productos para el hogar!";
    aseo.icon = "home";
    aseo.imagen = "./assets/images/aseohogar.jpg";
    var cuidado = categories.children_data[0].children_data[3];
    cuidado.description = "Productos para la familia!";
    cuidado.icon = "body";
    cuidado.imagen = "./assets/images/cuidadopersonal.jpg";
    this.categories.push(ofertas);
    this.categories.push(alimentos);
    this.categories.push(aseo);
    this.categories.push(cuidado);
  }

  ionViewDidLeave() {
    this.effects.effectFlip();
  }

}
