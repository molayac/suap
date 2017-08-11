import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { MgGlobalProvider } from '../../providers/mg-global';

@IonicPage()
@Component({
  selector: 'page-catalog-products',
  templateUrl: 'catalog-products.html',
})
export class CatalogProductsPage {
  public products: any;
  public catalog: any;
  public loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public mgService:MgGlobalProvider,
              public loadingCtrl: LoadingController) {
    this.catalog = this.navParams.get("catalog");
    this.products = [];
    this.loading = this.loadingCtrl.create({
      content: "Estamos cargando la información...",
      spinner: "circles"
    });
  }

  ionViewDidLoad() {
    //let productsHistory = this.mgService.getCatalogProductsHistory();
    let productsHistory = [];
    let index = 0;
    let doLoad = true;
    if(productsHistory.length > 0){
      index = productsHistory.findIndex((data)=>{ if(data.catalog == this.catalog.id){return true}});
      console.log("LOG PRODUCTS: ", index, "PRODUCTS", JSON.stringify(productsHistory));
      if(index >= 0){
        doLoad = false;
        this.products = productsHistory[index].products;
        console.log("PRODUCTS", this.products);
      }
    }
    if(doLoad){
      this.loading.present();
      this.mgService.getProductsByCatalogId(this.catalog.id).subscribe(data => {
        this.products = data.items;
        //this.mgService.setMg2Products(this.catalog.id, this.products); Save on history
        this.loading.dismiss();
      });
    }
    console.log('ionViewDidLoad ProductosPage');
  }

}
