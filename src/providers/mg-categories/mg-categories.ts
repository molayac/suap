import { Injectable } from '@angular/core';
import { RequestOptions, Headers } from '@angular/http';
import { Mg2Search } from '../../models/mg2-search';
import { MgImagen } from '../../models/mg-imagen';
import { Api } from '../api';
import 'rxjs/add/operator/map';

/*
  Generated class for the MgCategoriesProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class MgCategoriesProvider {
  private _stores: any;
  private _categories:any;
  private headers:any;

  constructor(public api: Api) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }
  /**
   * Service to get Categories from Magento
   */
  private getCategories() {
    this.api.setUrlAllApi();
    let options = new RequestOptions({ headers: this.headers });
    return this.api.get("categories", options)
      .map(response => response.json());
  }

  /**
   * Service to get StoreGroups from Magento
   */
  private getStoreGroups(){
    this.api.setUrlAPI();
    let options = new RequestOptions({ headers: this.headers });
    let seq = this.api.get("store/storeGroups", options).share();
    return seq.map(response => response.json());
  }

  /**
   * Service to get Data from Categories By Id from Magento
   * Used to get Imagen
   */
  public getCategoriesImagesById(id){
    console.log("Categories_By_ID: ",id);
    let options = new RequestOptions({ headers: this.headers });
    let seq = this.api.get("categories/"+id, options).share();
    return seq.map(response => response.json());
  }

  /**
   * Service to get Stores and Categories by Store  from Magento
   */
  private getStoreImagesById(id){
    console.log("StoreCategories_By_ID IMAGES: ",id);
    let options = new RequestOptions({ headers: this.headers });
    let seq = this.api.get("categories/"+id, options).share();
    return seq.map(response => response.json());
  }


  /**
   * Function to set Store Images from Root Category Id
   */
  private setStoreImages(data){
      let children = data.children.split(",");
      let response:any= [];
      let img:any=null;
      let level:any=null;

      console.log("LEVEL 1");
      let image = data.custom_attributes.filter(obj=>{
        return obj.attribute_code === "image";
      });
      if(image != null && image.length <= 0){
        console.log("No Imagen");
      }else{
        console.log("IMAGE PATH:", data.path, image[0].value, image);
        img = new MgImagen(image[0].value, data.path);
      }
      if(children != null && children.length <= 0 ){
        children = null;
      }
      if(data.level != null)
        level = data.level;

      response["children"] = children;
      response["level"] = data.level;
      response["image"]=img;


      return response;
  }

  /**
   * Function to validate if store data was loaded already
   */
  storesAreReady(){
    let counter:number = 0;
    return new Promise((resolve, reject)=>{
      if(this._stores != null && this._stores.lenght > 0){
        console.log("IS READY");
        resolve(this._stores);
      }else{
        console.log("IS NOT READY");
        this.getStoreGroups().subscribe(response=>{
          console.log("READY STORES: ", response);
          this._stores = response.filter(obj=>{
            return obj.name !== "Default";
          });
          this._stores.forEach((item, index)=>{
            this.getStoreImagesById(item.root_category_id).subscribe(data=>{
              let resp = this.setStoreImages(data);
              this._stores[index]["children"] = (resp.children != null)?resp.children : null;
              this._stores[index]["level"]= (resp.level != null )? resp.level: null;
              this._stores[index]["image"]= (resp.level != null )? resp.image: null;
              counter = counter+1;
              console.log("Values: "+counter, this._stores.length);
              if(counter == this._stores.length){
                console.log("STORES FULLLOADED:", this._stores);
                resolve(this._stores);
              }
            }, err=>{
              this._stores[index]["image"]= null;
              counter = counter+1;
              console.log("Values: "+counter, this._stores.length);
              if(counter == this._stores.length){
                console.log("STORES FULLLOADED:", this._stores);
                resolve(this._stores);
              }
            });
            if(counter == this._stores.length){
              console.log("STORES FULLLOADED:", this._stores);
              resolve(this._stores);
            }
          }, err=>{
            console.error("Se presentó un error: ", err);
            reject(err);
          });
        }, err=>{
          console.warn("Server ERROR 500");
          reject(err);
        });
      }
    });

  }

  categoriesAreReady(){
    let promise = new Promise((resolve, reject)=>{
      let stores:any = this._stores;
      let counter: number = 0;
      if(this._categories != null && this._categories.length > 0){
        console.log("Categories READY");
        resolve(this._categories);
      }else{
        this._categories = [];
        this.getCategories().subscribe(data=>{
          //For every store
          let rootCategory:any;
          let categories : any;
          console.log("Categories Are Ready?: ",stores, "DATA: ", data);
          if(stores == null){
            console.log("Error con stores cargados");
          }
          stores.forEach((item, index)=>{
            //Validate what categories are children from its root category
            rootCategory = data.children_data.filter(obj=>{
              console.log(obj.id, item.root_category_id);
              return obj.id === item.root_category_id;
            });
            if(rootCategory != null && rootCategory.length <= 0)
              reject("Some error on server with data, no rootCategory for store: "+item.name);
            categories = rootCategory[0].children_data;
            console.log("Categories from Store: ", categories, rootCategory);
            let counterCat = 0;
            //Look for images of childrens category ids.
            categories.forEach((myItem, myIndex)=>{
              myItem["store_id"]=item.id;
              this.getStoreImagesById(myItem.id).subscribe(info=>{
                counterCat = counterCat +1;
                let resp = this.setStoreImages(info);
                myItem["children"] = (resp.children != null)?resp.children : null;
                myItem["level"]= (resp.level != null )? resp.level: null;
                myItem["image"]= (resp.level != null )? resp.image: null;
                //Set all data on categories variable, based on store id;
                this._categories.push({store_id:item.id, data:myItem});
                console.log(this._categories, "***", item.children.length, item.children.length);
                if(item.children.length == counterCat){
                  console.log("index", index, this._categories);
                  stores[index]["categories"] = this._categories.filter(obj=>{return obj.store_id === item.id});
                  console.log("Categories Loaded: ",this._categories, "ON Store: ", stores[index]);
                  counter = counter + 1;
                }

                console.log("Categories Loaded: ",this._categories, "ON Stores: ", stores, counter);
                if(stores.length == counter){
                  this._stores = stores;
                  resolve(stores);
                }
              }, err=>{
                console.warn("NO IMAGEN FOR STORE: "+item.name);
                myItem["children"] = null;
                myItem["level"]= null;
                myItem["image"]= null;
                //Set all data on categories variable, based on store id;
                this._categories.push({store_id:item.id, data:myItem});
                counterCat = counterCat +1;
                if(item.children.length == counterCat){
                  console.log("ERR index", index, this._categories);
                  stores[index]["categories"] = this._categories.filter(obj=>{return obj.store_id === item.id});
                  console.log("ERR Categories Loaded: ",this._categories, "ON Store: ", stores[index]);
                  counter = counter + 1;
                }
                console.log("Categories: ", this._categories);
                if(stores.length == counter){
                  this._stores = stores;
                  resolve(stores);
                }
              });
              if(stores.length == counter){
                this._stores = stores;
                resolve(stores);
              }

            });//End ForEach Categories

          });
        }, err=>{
          console.error("ERROR LOADING CATALOG IMAGES");
          reject(err);
        });
      }
    });
    return promise;
  }

  /**
   * Function to return stores loaded
   */
  public getStores(){
    return this._stores;
  }

  getCategoriesById(id){
    let response = this._stores.filter(obj=>{
      console.log("SORE: ", obj, id);
      return obj.id === id;
    })[0].categories;
    console.log("SERVER: ", response, id);
    return response;
  }

}
