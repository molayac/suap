import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

/**
 * A simple settings/config class for storing key/value pairs with persistence.
 */
@Injectable()
export class Settings {
  private SETTINGS_KEY: string = '_settings';

  settings: any;
  _defaults: any;

  constructor(public storage: Storage, defaults?: any) {
    if(!defaults)
      this._defaults = {URLBASE:"http://192.168.2.51/magento"};
    else
      this._defaults = defaults;
  }

  getDefaults(key?:string){
    if(!key)
      return this._defaults;
    else
      return this._defaults[key];
  }


  load() {
    return this.storage.get(this.SETTINGS_KEY).then((value) => {
      if (value) {
        this.settings = value;
        return this._mergeDefaults(this._defaults);
      } else {
        return this.setAll(this._defaults).then((val) => {
          this.settings = val;
        })
      }
    });
  }

  _mergeDefaults(defaults: any) {
    console.log("Merge Defaults");
    for (let k in defaults) {
      if (!(k in this.settings)) {
        this.settings[k] = defaults[k];
      }
    }
    return this.setAll(this.settings);
  }

  merge(settings: any) {
    for (let k in settings) {
      this.settings[k] = settings[k];
    }
    return this.save();
  }

  setValue(key: string, value: any) {
    this.settings[key] = value;
    return this.storage.set(this.SETTINGS_KEY, this.settings);
  }

  setAll(value: any) {
    return this.storage.set(this.SETTINGS_KEY, value);
  }

  getValue(key: string) {
    return this.storage.get(this.SETTINGS_KEY)
      .then(settings => {
        return settings[key];
      }).catch(err => {
        console.error("Error ", err);
        return null;
      });
  }

  save() {
    return this.setAll(this.settings);
  }

  allSettings() {
    return this.settings;
  }
}
