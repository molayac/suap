import { MgCustomer } from '../../models/mg2-customer';
import { Mg2Search } from '../../models/mg2-search';
import { AdminSystem } from '../../config/admin.security';
import { Injectable } from '@angular/core';
import { Api } from '../api';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Settings } from '../settings';
/*
  Generated class for the Magento2ServiceProvider provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Magento2ServiceProvider {
  private _adminSystem: any = new MgCustomer(AdminSystem);
  private magentoAPI: string;
  private mg2Search: any = new Mg2Search();
  private mg2Customer: MgCustomer;
  private mg2Catalog:any;
  catalogs:any;
  stores:any;
  isReadyAll:boolean = false;
  private _adminToken:any;
  private token: any;
  private mg2Products: Array<{ catalog: any, products: Array<any> }>;
  private _history:any;
  public headers: any = new Headers({ 'Content-Type': 'application/json' });

  constructor(public http: Http, public api:Api, private settings: Settings) {
    this.magentoAPI = "http://192.168.2.51/magento/rest/V1/"; // Used for app builder
    // this.magentoAPI = "/magentoAPI/";
    this.mg2Catalog = [];
    this.mg2Products = [];
    this.token = null;
    console.log('Hello Magento2ServiceProvider Provider');
  }

  customerInfoService() {
    let headers = this.headers;
    headers.append('Authorization', "Bearer " + this.token);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.magentoAPI + "customers/me", options)
      .map(response => response.json());
  }

  signup(request) {
    let headers = this.headers;
    headers.append('Authorization', "Bearer " + this._adminToken);
    let options = new RequestOptions({ headers: headers });
    let data = {
      customer : {
        email: request.email,
        firstname: request.name,
        lastname: request.lastname,
        gender: ()=>{switch(request.gender){ case "male": return 1; case "female": return 2; default : return 0;}}
      },password: request.password
    }
    console.log(JSON.stringify(data));
    return this.http.post(this.magentoAPI + "customers", data, options)
      .map(response => response.json());

  }

  adminServiceToken() {
    // let options = new RequestOptions({ headers: this.headers });
    return new Promise((resolve, reject)=>{
      this.http.post(this.magentoAPI + "integration/admin/token",
        this._adminSystem.getLoginParams()).map(response => response.json()).subscribe(data=>{
          this._adminToken = data;
          resolve(true);
        }, err=>{
          console.warn("Error obteniendo admin Token: ", err);
          reject(false);
        });
    });

  }

  login(data) {
    let options = new RequestOptions({ headers: this.headers });
    //Data contiene username y password
    return this.http.post(this.magentoAPI + "integration/customer/token",
      this.mg2Customer.getLoginParamsData(data)).map(response => response.json());
    // .subscribe(data => { console.log(data, "STRING:", JSON.stringify("data")) });
  }

  activateCustomerService(email, key) {
    let headers = this.headers;
    headers.append('Authorization', "Bearer " + this._adminToken);
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.magentoAPI + "customers/" + email + "/activate",
      { confirmationKey: key }, options)
      .map(response => response.json());

  }

  getStores(){
    this.api.setUrlAPI();
    let options = new RequestOptions({ headers: this.headers });
    let seq = this.api.get("store/storeGroups", options).share();
    return seq.map(response => response.json());
  }

  getCategories() {
    let options = new RequestOptions({ headers: this.headers });
    this.api.setUrlAllApi();
    return this.api.get("categories", options)
      .map(response => response.json());

  }

  getCategoriesById(id){
    let options = new RequestOptions({ headers: this.headers });
    this.api.setUrlAllApi();
    return this.api.get("categories/"+id, options)
      .map(response => response.json());
  }

  getProductsByCategoryId(id) {
    this.api.setUrlAllApi();
    let filter = this.mg2Search.filter("category_id", id, null);
    this.mg2Search.addFilter(filter);
    // filter = this.mg2Search.filter("entity_id", id, null);
    this.mg2Search.addPageSize(10);
    return this.http.get(this.magentoAPI + "products" + "?" + this.mg2Search.getResultFilter())
      .map(response => response.json());
    // .subscribe(data => {
    //   console.log( data );
    // });
  }

  getProductsByCategoryIdPaginated(id, pagId) {
    let filter = this.mg2Search.filter("category_id", id, null);
    this.mg2Search.addFilter(filter);
    // filter = this.mg2Search.filter("entity_id", id, null);
    this.mg2Search.addPageSize(10);
    return this.http.get(this.magentoAPI + "products" + "?" + this.mg2Search.getResultFilter())
      .map(response => response.json());
    // .subscribe(data => {
    //   console.log( data );
    // });
  }

  getProductMediaBySku(sku) {
    return this.http.get(this.magentoAPI + "products_media/" + sku + "/media")
      .map(response => response.json());
  }

  /* GETTERS AND SETTERS*/
  setMg2Products(catalog, products) {
    this.mg2Products.push({ catalog: catalog, products: products });
  }

  getMg2Products() {
    return this.mg2Products;
  }

  setMg2Catalog(items) {
    this.mg2Catalog = items;
  }

  getMg2Catalog() {
    return this.mg2Catalog;
  }

  getToken() {
    return this.token;
  }

  setToken(token) {
    this.mg2Customer.setToken(token);
    this.token = token;
    console.log("TOKEN Updated", token);
  }

  setHistory(history){
    this.isReadyAll = true;
    this.settings.setValue("stores", history );
    this._history = history;
  }

  setBaseUrl(url){
    this.api.setUrl(url);
    return this.settings.setValue("URLBASE", url);
  }

  getHistory(){
    return this.settings.getValue("stores");
    // return this._history;
  }

  getPubMediaBaseURL(){
    return this.api.getUrlMedia();
  }

  settingsLoad(){
    return this.settings.load();
  }

  isReady(){
    return this.isReadyAll;
  }
  setReady(){
    this.isReadyAll  =true;
  }

}
