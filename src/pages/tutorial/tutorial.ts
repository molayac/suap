import { Component } from '@angular/core';
import { MenuController, NavController, LoadingController, AlertController, ToastController } from 'ionic-angular';

import { WelcomePage } from '../welcome/welcome';
import { StorePage } from '../store/store';

import { TranslateService } from '@ngx-translate/core';
import { MgGlobalProvider } from '../../providers/mg-global';


export interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  slides: Slide[];
  showSkip = true;
  private isLoaded: boolean = false;
  private isLoadedStores: boolean = false;
  disableSkip = true;
  statusLoad: any;
  loading: any;
  error:any = null;

  constructor(public navCtrl: NavController, public menu: MenuController, translate: TranslateService, private mgService: MgGlobalProvider,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toastCtrl:ToastController) {
    this.loading = {
      spinner: "circles",
      showBackdrop: true,
      enableBackdropDismiss: true,
      duration: 3000
    };
    this.statusLoad = [
      { key: "ST", status: false, name: "Tiendas" },
      { key: "CT", status: false, name: "Catálogos" }
    ];
    translate.get(["TUTORIAL_SLIDE1_TITLE",
      "TUTORIAL_SLIDE1_DESCRIPTION",
      "TUTORIAL_SLIDE2_TITLE",
      "TUTORIAL_SLIDE2_DESCRIPTION",
      "TUTORIAL_SLIDE3_TITLE",
      "TUTORIAL_SLIDE3_DESCRIPTION",
    ]).subscribe(
      (values) => {
        console.log('Loaded values', values);
        this.slides = [
          {
            title: values.TUTORIAL_SLIDE1_TITLE,
            description: values.TUTORIAL_SLIDE1_DESCRIPTION,
            image: 'assets/img/ica-slidebox-img-1.png',
          },
          {
            title: values.TUTORIAL_SLIDE2_TITLE,
            description: values.TUTORIAL_SLIDE2_DESCRIPTION,
            image: 'assets/img/ica-slidebox-img-2.png',
          },
          {
            title: values.TUTORIAL_SLIDE3_TITLE,
            description: values.TUTORIAL_SLIDE3_DESCRIPTION,
            image: 'assets/img/ica-slidebox-img-3.png',
          }
        ];
      });
  }

  private showAlert(title, msg, buttons, inputs = null) {
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

  private getStatus(duration: any = 5000, error) {
    let content = "<ol>";
    let status = "";
    let counter = 0;
    let wait = "Por favor espere...";
    this.loading.duration = duration;
    this.statusLoad.forEach(item => {
      if (item.status) {
        counter++;
        content += '<li><strike><b>' + item.name + '</strike></b> --- <bigger><b><u>OK</u></b></bigger></li>';
      } else {
        if (!error)
          content += '<li><b>' + item.name + '</b> --- <bigger><b><u>DESCARGANDO...</u></b></bigger></li>';
        else
          content += '<li><b>' + item.name + '</b> --- <bigger><b><u>ERROR CONEXIÓN (500)</u></b></bigger></li>';
      }
    });
    if (counter == this.statusLoad.length)
      this.disableSkip = false;

    this.loading.content = "<b>Descargando </b> datos desde el Servidor...<hr><b>Progreso: </b> <br>" + content + "</ol>";
    return content;
  }

  startApp() {
    let loading = this.loadingCtrl.create(this.loading);
    if (this.disableSkip) {
      console.log("DISABLED");
      this.getStatus(3000, false);
      loading.present();
    } else {
      loading.dismiss();
      this.navCtrl.setRoot(StorePage, { loaded: true }, {
        animate: true,
        direction: 'forward'
      });
    }
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  private _initLoad(retry = false) {
    let loading: any;
    this.loading.content = "<b>Conectando y descargando </b> datos de las tiendas desde el Servidor...";
    loading = this.loadingCtrl.create(this.loading);
    let loaded = this.mgService.getIsLoaded();
    if( loaded >=2 )
      return;

    loading.present();
    this.mgService.isReady().then((data) => {
      this.statusLoad[this.statusLoad.findIndex((obj => {
        return obj.key == "ST";
      }))].status = true;
      this.mgService.categoriesAreReady().then((data) => {
        this.disableSkip = false;
        this.statusLoad[this.statusLoad.findIndex((obj => obj.key == "CT"))].status = true;
        this.showAlert("Datos Cargados!",
          this.getStatus(3000, false),
          [{
            text: 'Continuar',
            handler: data => {
              this.startApp();
            }
          }]
        );
        console.log("LOAD PAGE");
      }).catch(err => {
        console.warn("Error loading categories");
        this.showAlert("Error de conexión al servidor!",
          "<b>Mientras se descargaban los catálogos<b><br>"+this.getStatus(3000, true),
          [{
            text: 'Reintentar',
            handler: data => {
              this._initLoad();
            }
          }]
        );
      });
    }).catch(err => {
      console.warn("Error loading categories");
      this.error=JSON.stringify(err);
      this.toastCtrl.create({
        message:"Error: "+JSON.stringify(err),
        duration: 10000
      }).present();
      this.showAlert("Error de conexión al servidor!",
        "<b>Mientras se descargaban las tiendas<b><br>"+this.getStatus(3000, true),
        [{
          text: 'Reintentar',
          handler: data => {
            this._initLoad();
          }
        }]
      );
    });
  }

  ionViewDidLoad() {
    this._initLoad();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
