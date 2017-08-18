import {Injectable} from '@angular/core';
import {Http, RequestOptions, URLSearchParams} from '@angular/http';
import {ToastController, Platform} from 'ionic-angular';
import 'rxjs/add/operator/map';
import {Settings} from './settings';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  urlAPI: string = '/rest/V1';
  urlMedia: string = '/pub/media';
  urlAll: string = '/rest/all/V1';
  url: string;
  urlbase: string = "";

  constructor(public http: Http, public toastCtrl: ToastController, private settings: Settings, private platform: Platform) {


    this.urlbase = this.settings.getDefaults("URLBASE");
    if (!platform.is("cordova"))
      this.url = this.urlAPI;
    else
      this.url = this.urlbase + this.urlAPI

    console.log("URL BASE: ", this.url);

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
    this.url = (this.urlbase != null && this.platform.is("cordova")) ? this.urlbase + this.urlMedia : this.urlMedia;
  }

  setUrlAllApi() {
    this.url = (this.urlbase != null && this.platform.is("cordova")) ? this.urlbase + this.urlAll : this.urlAll;
  }

  getUrlMedia(strict = false) {
    return (this.urlbase != null && this.platform.is("cordova") || strict) ? this.urlbase + this.urlMedia : this.urlMedia;
  }

  setUrl(url: string) {
    this.urlbase = url;
    this.url = (this.urlbase != null && this.platform.is("cordova")) ? url + this.urlAPI : this.urlAPI;
  }

  setUrlAPI() {
    this.url = (this.urlbase != null && this.platform.is("cordova")) ? this.urlbase + this.urlAPI : this.urlAPI;
  }
}
