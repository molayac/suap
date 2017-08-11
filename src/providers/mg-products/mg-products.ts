import { Injectable } from '@angular/core';
import { RequestOptions, Headers } from '@angular/http';
import { Mg2Search } from '../../models/mg2-search';
import { Api } from '../api';
import 'rxjs/add/operator/map';

/*
  Generated class for the MgProductsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class MgProductsProvider {
  products:any;
  headers:any;
  private mg2Products: Array<{ catalog: any, products: Array<any> }>;
  private mg2Search: any = new Mg2Search();
  constructor(public api: Api) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  getCatalogs() {
    let options = new RequestOptions({ headers: this.headers });
    return this.api.get("categories", options)
      .map(response => response.json());
  }

  getProductsByCategoryId(id) {
    let filter = this.mg2Search.filter("category_id", id, null);
    this.mg2Search.addFilter(filter);
    this.mg2Search.addPageSize(50);
    return this.api.get("products" + "?" + this.mg2Search.getResultFilter())
      .map(response => response.json());
  }

  getProductMediaBySku(sku) {
    return this.api.get("products_media/" + sku + "/media")
      .map(response => response.json());
  }

  setMg2Products(catalog, products) {
    this.mg2Products.push({ catalog: catalog, products: products });
  }

  getMg2Products() {
    return this.mg2Products;
  }

}
