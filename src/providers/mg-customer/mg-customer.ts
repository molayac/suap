import { Injectable } from '@angular/core';
import { MgCustomer } from '../../models/mg2-customer';
import { AdminSystem } from '../../config/admin.security';
import { Api } from '../api';
import { RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MgCustomerProvider {
  private _adminSystem: any = new MgCustomer(AdminSystem);
  private _adminToken: any = { ready: false, token: null };
  private _customer: MgCustomer;
  headers: any;
  constructor(private api: Api) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });

  }

  adminServiceToken() {
    let options = new RequestOptions({ headers: this.headers });
    let data = this._adminSystem.getLoginParams();
    let promise = new Promise((resolve, reject) => {
      this.api.setUrlAPI();
      this.api.post("integration/admin/token", data, options).map(response => response.json()).subscribe(data => {
        this._adminToken.ready = true;
        this._adminToken.token = data;
        resolve(true);
      }, err => {
        console.warn("Unspected Server Error");
        reject(err);
      });
    });
    return promise;
  }

  login(account) {
    console.log("Customer login");
    this.api.setUrlAPI();
    this._customer = new MgCustomer("");
    let accountInfo = this._customer.getLoginParamsData(account);
    let promise = new Promise((resolve, reject) => {
      this.api.post("integration/customer/token", accountInfo).map(res => res.json())
        .subscribe(res => {
          // If the API returned a successful response, mark the user as logged in
          if (res !== null && res !== undefined) {
            console.log("Token: " + res);
            this._customer.setToken(res);
            resolve(true);
          }
        }, err => {
          console.error('LOGIN ERROR', err);
          reject(err);
        });
    })

    return promise;
  }

  activateCustomerService(token, email, key) {
    let headers = this.headers;
    headers.append('Authorization', "Bearer " + this._customer.getToken());
    let options = new RequestOptions({ headers: headers });
    return this.api.put("customers/" + email + "/activate",
      { confirmationKey: key }, options)
      .map(response => response.json());

  }

  customerInfoService() {
    let headers = this.headers;
    headers.append('Authorization', "Bearer " + this._customer.getToken());
    let options = new RequestOptions({ headers: headers });
    return this.api.get("customers/me", options)
        .map(response => response.json());
    // .subscribe(data => {console.log(data, "STRING: ", JSON.stringify(data));});
  }

  resendConfirmation(email){
    let headers = this.headers;
    //headers.append('Authorization', "Bearer " + this._adminToken.token);
    let options = new RequestOptions({ headers: headers });
    let seq = this.api.post('customers/confirm',
    {
        email: email
//        ,websiteId: 0,
//        redirectUrl: "string"
    }, options).share();
    return seq
        .map(res => res.json());
  }

  /**
   * Validate if customer is logged in before.
   */
  isLoggedIn(){
    return (this._customer.getToken() != null);
  }

}
