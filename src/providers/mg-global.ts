import { Injectable } from '@angular/core';
import { RequestOptions, Headers } from '@angular/http';
import { Api } from './api';
import { MgProductsProvider, MgCustomerProvider, MgCategoriesProvider } from './providers';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class MgGlobalProvider {
  _customer: any = null;
  private _stores: any = null;
  private _auxStores: any= null;
  headers:any;
  loaded:number = 0;
  percentStores:any=0;
  constructor(public api: Api,
    private mgPService: MgProductsProvider,
    private mgCgService: MgCategoriesProvider,
    private mgCService: MgCustomerProvider) {
      this.headers = new Headers({ 'Content-Type': 'application/json' });
  }
  login(account){
    return this.mgCService.login(account);
  }

  getCategories(){
    return this.mgPService.getCatalogs();
  }

  getCategoriesById(id){
    return this.mgCgService.getCategoriesById(id);
  }

  getProductsByCatalogId(id:any){
    return this.mgPService.getProductsByCategoryId(id);
  }

  getProductMediaBySku(id:any){
    return this.mgPService.getProductMediaBySku(id);
  }

  isLoggedIn(){
    return this._customer != null? true: false;
  }

  private getStoreGroups(){
    this.mgCgService.storesAreReady().then(data=>{
      return data;
    }).catch(err=>{
      console.log("Error getting stores");
      return null;
    });
  }
  getProgressStore(){
    this.percentStores = 100/this.mgCgService.getStores().length;
    return
  }

  getStores(){
    let stores = this.mgCgService.getStores();
    return stores;
  }

  isReady(){
    this.loaded++;
    let stores = this.mgCgService.getStores();
    if(stores != null  && stores != undefined && stores.length > 0 )
      return new Promise((resolve, reject)=>{
        console.log("Resolve ready");
        resolve(stores);
      });
    else
      return this.mgCgService.storesAreReady();
  }

  categoriesAreReady(){
    this.loaded++;
    return this.mgCgService.categoriesAreReady();
  }

  getIsLoaded(){
    let loaded = this.loaded;
    if(loaded > 2)
      this.loaded = 0;

    return loaded;
  }
  
}
