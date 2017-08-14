import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { ToastController } from 'ionic-angular';
import 'rxjs/add/operator/map';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  urlAPI: string = 'http://192.168.2.51/magento/rest/V1';
  urlMedia: string = 'http://192.168.2.51/magento/pub/media';
  urlAll: string = 'http://192.168.2.51/magento/rest/all/V1';
  // urlAPI: string = '/magentoAPI';
  // urlMedia: string = '/magentoMedia';
  url: string;
  // urlAll: string = '/magentoAllApi';
  constructor(public http: Http, public toastCtrl: ToastController) {
    this.url = this.urlAPI;
  }

  get(endpoint: string, params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }
    console.log(this.url + "/" + endpoint);
    // Support easy query params for GET requests
    if (params) {
      let p = new URLSearchParams();
      for (let k in params) {
        p.set(k, params[k]);
      }
      // Set the search field if we have params and don't already have
      // a search field set in options.
      options.search = !options.search && p || options.search;
    }
    this.toastCtrl.create({
      message: this.url + "/" + endpoint,
      duration: 5000
    }).present();

    return this.http.get(this.url + '/' + endpoint, options);
  }

  post(endpoint: string, body: any, options?: RequestOptions) {
    this.toastCtrl.create({
      message: this.url + "/" + endpoint,
      duration: 1000
    }).present();
    return this.http.post(this.url + '/' + endpoint, body, options);
  }

  put(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.url + '/' + endpoint, body, options);
  }

  delete(endpoint: string, options?: RequestOptions) {
    return this.http.delete(this.url + '/' + endpoint, options);
  }

  patch(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.url + '/' + endpoint, body, options);
  }

  setUrlMedia() {
    this.url = this.urlMedia;
  }
  setUrlAllApi() {
    this.url = this.urlAll;
  }

  setUrl(url: string) {
    this.url = url;
  }

  setUrlAPI() {
    this.url = this.urlAPI;
  }
}
