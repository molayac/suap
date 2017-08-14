import { Component } from '@angular/core';
import { MenuController, NavController, LoadingController, AlertController, ToastController } from 'ionic-angular';

import { WelcomePage } from '../welcome/welcome';
import { StorePage } from '../store/store';

import { TranslateService } from '@ngx-translate/core';
import { MgGlobalProvider } from '../../providers/mg-global';
import { Magento2ServiceProvider } from '../../providers/magento2-service/magento2-service';

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
  stores:any = [];

  constructor(public navCtrl: NavController, public menu: MenuController, translate: TranslateService, private mgService: MgGlobalProvider,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toastCtrl:ToastController,
    public mg2Service: Magento2ServiceProvider) {
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
      console.log("Enabled");
      this.organizeStores(this.statusLoad[0]);
      this.organizeCatalogStores(this.statusLoad);
      this.mg2Service.setHistory(this.stores);
      this.toastCtrl.create({
        message: "Completada la descarga!",
        duration: 3000,
        position: 'top',
        showCloseButton:true,
        closeButtonText:"Ok"
      }).present();
      this.navCtrl.setRoot(StorePage, { loaded: true, statusLoad: this.stores }, {
        animate: true,
        direction: 'forward'
      });
    }
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  private _initLoad() {

  }

  ionViewDidLoad() {
    let loading: any;
    this.loading.content = "<b>Conectando y descargando </b> datos de las tiendas desde el Servidor...";
    loading = this.loadingCtrl.create(this.loading);
    let indexParentStore;
    let indexParent;
    loading.present();
    if(!this.mg2Service.isReady()){
      this.loadStores();
      this.loadCategories();
    } else{
      console.log("Loaded Data");
      this.disableSkip = false;
      this.stores = this.mg2Service.getHistory();
    }

    // this._initLoad();
  }

  private loadStores(){
    let indexParentStore;
    this.mg2Service.getStores().subscribe(dataStore=>{
      indexParentStore = this.statusLoad.findIndex((obj => obj.key == "ST"));
      dataStore = dataStore.filter(item=>{return item.name !== "Default";});
      this.statusLoad[indexParentStore].data = dataStore
      console.log("STORES: "+indexParentStore, this.statusLoad[indexParentStore].data, "poppppp",dataStore );
      dataStore.forEach((item, index)=>{
          this.mg2Service.getCategoriesById(item.root_category_id).subscribe(img=>{
            console.log("STATUSLOAD STOIRES: "+index, this.statusLoad[indexParentStore].data[index]);
            this.statusLoad[indexParentStore].status = true;
            this.statusLoad[indexParentStore].data[index].img = img;
            this.toastCtrl.create({
              message: "Tienda Completada: "+item.name,
              duration: 3000
            }).present();
            this.getStatus(3000, false);
          }, err=>{
            this.toastCtrl.create({
              message: "Error descargando imágen tienda: "+item.name,
              duration: 3000
            }).present();
            this.statusLoad[indexParentStore].status = true;
            this.statusLoad[indexParentStore].data[index].img = null;
            this.statusLoad[indexParentStore].data[index].err = true;
          });
      });

    }, err =>{
      indexParentStore = this.statusLoad.findIndex((obj => obj.key == "ST"));
      this.toastCtrl.create({
        message: "Error descargando tiendas!",
        duration: 3000,
        showCloseButton:true,
        closeButtonText:"Nooo!!"
      }).present();
      this.statusLoad[indexParentStore].status = false;
      this.statusLoad[indexParentStore].error = true;
      this.statusLoad[indexParentStore].data = err;
    });
  }

  private loadCategories(){
    let indexParent;
    this.mg2Service.getCategories().subscribe(data=>{
      indexParent = this.statusLoad.findIndex((obj => obj.key == "CT"));
      // this.statusLoad[indexParent].status = true;
      this.statusLoad[indexParent].data = data;
      console.log("****: "+indexParent,data);
      data.children_data.forEach((item, index)=>{
        let childrens:any = [];
        item.children_data.forEach((myItem, myIndex)=>{
            this.mg2Service.getCategoriesById(myItem.id).subscribe(img=>{
              this.statusLoad[indexParent].status = true;
              childrens.push({root_category: item.id, data:img});
              console.log("Imagen Catgorias: ", childrens,"INDEX:"+ index, myIndex, this.statusLoad[indexParent].data );
              this.statusLoad[indexParent].data.children_data[index].children_data[myIndex].img = img;
              this.toastCtrl.create({
                message: "Catálogo Completado "+myItem.name,
                duration: 3000
              }).present();
              this.getStatus(3000, false);
            }, err=>{
              this.toastCtrl.create({
                message: "Error descargando imágen catálogo: "+myItem.name,
                duration: 3000
              }).present();
              this.statusLoad[indexParent].status = true;
              console.warn("Error cargando categorias imagenes!");
            });
        });

      });
    }, err=>{
      indexParent = this.statusLoad.findIndex((obj => obj.key == "CT"));
      console.log("STATUSLOAD CAT: ", this.statusLoad[indexParent]);
      this.statusLoad[indexParent].status = false;
      this.statusLoad[indexParent].error = true;
      this.statusLoad[indexParent].data = err;
      this.loadCategories();
      this.toastCtrl.create({
        message: "Error descargando catálogos!",
        duration: 3000
      }).present();

    });
  }

  private organizeCatalogStores(data) {
    data[1].data.children_data.forEach((myItem, myIndex) => {
      console.log("ITEM: ", myItem);
      let categories: any = [];
      let index = this.stores.findIndex((obj => obj.root_category_id == myItem.id));

      myItem.children_data.forEach(item => {
        let img = item.img;
        console.log("ITEM CAT;:", item);
        let imagen = null;
        if (img != null && img.custom_attributes.length > 0) {
          let index = img.custom_attributes.findIndex(obj => {
            return obj.attribute_code == "image";
          });
          if (index >= 0)
            imagen = this.mg2Service.getPubMediaBaseURL() + "/catalog/category/" + img.custom_attributes[index].value;
        }
        item.imagenPath = imagen;
        categories.push(item);
      });

      console.log("CATEGORIES: ", categories);
      if (index >= 0)
        this.stores[index]["categories"] = myItem.children_data;

    });
    console.log("ALL: ", this.stores);
  }

  private organizeStores(stores) {
    stores.data.forEach((item) => {
      let img = item.img;
      let imagen = null;
      if (img != null && img.custom_attributes.length > 0) {
        let index = img.custom_attributes.findIndex(obj => {
          return obj.attribute_code == "image";
        });
        if (index >= 0)
          imagen = this.mg2Service.getPubMediaBaseURL() + "/catalog/category/" + img.custom_attributes[index].value;
      }
      item.imagenPath = imagen;
      this.stores.push(item);
    })
    console.log("Stores imgapath: ", this.stores);

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
