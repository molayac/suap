import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams,
  LoadingController, ToastController,
  ModalController } from 'ionic-angular';
import {Magento2ServiceProvider} from '../../providers/magento2-service/magento2-service';
import {OfflineService} from '../../providers/offline';
import {ProductDetailsPage} from "../product-details/product-details";
import {WelcomePage} from "../welcome/welcome";


@IonicPage()
@Component({
  selector: 'page-catalog-products',
  templateUrl: 'catalog-products.html',
})
export class CatalogProductsPage {
  welcomePage:any= WelcomePage;
  public products: any=[];
  public catalog: any;
  public loading: any;
  private _loadingImages: boolean = true;
  private _loadingItem: boolean = false;
  private _lastItem: any;
  public  _imagesAreReady:boolean = false;
  _enableInfiniteScrolling = true;

  constructor(public modalCtrl:ModalController,
              public navCtrl: NavController,
              public navParams: NavParams,
              private offline: OfflineService,
              public mg2Service: Magento2ServiceProvider,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {
    this.catalog = this.navParams.data;
    this._lastItem = {id: -1};
    this.products = [];
    this.loading = {
      content: "Estamos cargando la información...",
      spinner: "circles"
    };
  }

  ionViewDidLoad() {

    //let productsHistory = this.mgService.getCatalogProductsHistory();
    console.log("Offline: ", this.offline.getValue("NONE"));
    this.offline.getValue("products_"+this.catalog.id).then(data=>{
      console.log("DATA: ", data)
      if(data != undefined ){
        this.products = data;
        if(this.products.length < this.catalog.product_count){
          this._lastItem = data.slice(-1).pop();
          this.loadPagedItems(this.catalog.id);
        }else{
          this.loadImages(this.products.length);
        }
      }else{
        if (this.products.length < this.catalog.product_count) {
          console.log("Cargando,,,");
          this.loadPagedItems(this.catalog.id);
        }
      }

    }).catch(err=>{
      this.loadPagedItems(this.catalog.id);
    });

    console.log('ionViewDidLoad ProductosPage');
  }

  viewProductDetails(product){
    let modal = this.modalCtrl.create(ProductDetailsPage,{product:product});
    modal.present();
  }


  doInfinite(infiniteScroll) {
    if (this.products.length < this.catalog.product_count) {
      this.loadPagedItems(this.catalog.id, infiniteScroll);
    } else {

      if(!this._imagesAreReady)
        this.loadImages(this.products.length, infiniteScroll);

      else {
        this.offline.setValue("products_"+this.catalog.id, this.products)
        infiniteScroll.complete();
      }

    }

  }

  private loadPagedItems(id, infiniteScroll = null) {
    let loading = this.loadingCtrl.create(this.loading);
    if (!this._loadingItem) {
      loading.present();
      this._loadingItem=true;
      this.mg2Service.getProductsByCategoryIdPaginated(id, this._lastItem.id + 1).subscribe(data => {
        this._loadingItem = false;

        this.products = this.products.concat(data.items);
        this._lastItem = data.items.slice(-1).pop();
        this.loadImages(this.products.length, infiniteScroll);
        this.offline.setValue("products_"+this.catalog.id, this.products);
        console.log("REPSONSE PITEMS: ", data.items, this._lastItem, this.offline.getValue("products"), ""+this.products.length);
        loading.dismiss();
        if (infiniteScroll != null) {
          infiniteScroll.complete();
        }
      }, err => {
        if (infiniteScroll != null) {
          infiniteScroll.complete();
        }
        this._loadingItem = false;
        this.toastCtrl.create({
          message: "Se presentó un error, estamos reintentando",
          duration: 3000
        }).present();
        loading.dismiss();
        /*this.loadPagedItems(id);*/
      });
    }else{
      if (infiniteScroll != null) {
        console.log("LOADING, SCROLL LOADING DISBALE");
        infiniteScroll.complete();
      }
    }

  }

  private loadImages(counter, infiniteScroll = null) {
    let mediaUrl = this.mg2Service.getPubMediaBaseURL(true);
    let loadData = this.loading;
    loadData.content="Descargando Imágenes!";
    loadData.duration = 2500;
    let loading = this.loadingCtrl.create(loadData);
    if (this._loadingImages) {
      //Bloquea la carga de imágenes, mientras realiza la descarga de imágenes.
      this._loadingImages = false;
      loading.present();
      let counterOk = 0;
      this.products.forEach((item, index) => {
        if (item.imagenPath == null) {
          this.mg2Service.getProductMediaBySku(item.sku).subscribe(data => {

            console.log("DATA IMAGEN: ",data);
            this.products[index].imagenPath = mediaUrl +"/catalog/product" +data[0].file;

            if (counter >= index) {
              this._loadingImages = true;
              this.offline.setValue("products_"+this.catalog.id, this.products);
            }
            this._imagesAreReady= true;

            if (infiniteScroll != null) {
              infiniteScroll.complete();
            }

          }, err => {
            console.log("Error cargando imagen");
            this._imagesAreReady= false;
            console.log("INFINITE SCROLL: ", infiniteScroll);
            if (infiniteScroll != null) {
              infiniteScroll.complete();
            }
          });
        } else {
          counterOk++;
          console.log("SKIP Item", item.id);
          if(counterOk>= counter) {
            this._enableInfiniteScrolling = false;
            loading.dismiss();
          }else if(infiniteScroll != null)
            this._loadingImages = true;

        }
      });
    }else{
      if (infiniteScroll != null) {
        console.log("LOADING, SCROLL LOADING DISBALE");
        infiniteScroll.complete();
      }
    }
  }

  ionViewCanLeave(){
    console.log("LEAVING ",this.products.length,this.catalog.id);
    return (this.products.length == this.catalog.product_count) || !this._enableInfiniteScrolling;
  }


}
