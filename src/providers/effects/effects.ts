import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Injectable } from '@angular/core';
import { Platform } from "ionic-angular";

@Injectable()
export class EffectsProvider {
  options:NativeTransitionOptions;

  constructor(private _platform:Platform, private _nativePageTransitions:NativePageTransitions) {
    this.options = {
    direction: "left",
    duration: 1000,
    slowdownfactor: 3,
    slidePixels: 20,
    iosdelay: 100,
    androiddelay: 150,
    fixedPixelsTop: 0,
    fixedPixelsBottom: 60
   };
   console.log("Inside effectProvider");
  }

  effectBook(){
      if(this._platform.is("cordova")){
        if(this._platform.is("ios")){
          this.effectCurl();
        }else{
          this.effectFlip();
        }
      }else{
        console.warn("not supported");
      }
  }

  effectFlip(direction:string="left", duration:number=1000){
    if(this._platform.is("cordova")){
      this.options.direction = direction;
      this.options.duration = duration;
      this._nativePageTransitions.flip(this.options)
      .then(onSuccess=>{
        console.log("Success Transition");
      }).catch(onError=>{console.error("Error on effectFlip"+JSON.stringify(onError))});

    }else
      console.warn("Not supported platform");

  }

  effectCurl(direction:string="up", duration:number=1000){
    if(this._platform.is("ios")){
      this.options.direction = direction;
      this.options.duration = duration;
      this._nativePageTransitions.curl(this.options)
      .then(onSuccess=>{
        console.log("Success Transition curl");
      }).catch(onError=>{console.error("Error on effectCurl"+JSON.stringify(onError))});
    }else{
      console.warn("Not supported platform");
    }
  }

  effectSlide(direction:string="left", duration:number=1000){
    if(this._platform.is("cordova")){
      this.options.direction = direction;
      this.options.duration = duration;
      this._nativePageTransitions.slide(this.options)
      .then(onSuccess=>{
        console.log("Success Transition");
      }).catch(onError=>{console.error("Error on effectSlide"+JSON.stringify(onError))});

    }else
      console.warn("Not supported platform");
  }

  effectFade(direction:string="down", duration:number=1000){
    if(this._platform.is("cordova") && !this._platform.is("windows")){
      this.options.direction = direction;
      this.options.duration = duration;
      this._nativePageTransitions.fade(this.options)
      .then(onSuccess=>{
        console.log("Success Transition");
      }).catch(onError=>{console.error("Error on effectFade"+JSON.stringify(onError))});

    }else
      console.warn("Not supported platform");
  }

  effectDrawer(direction:string="right", duration:number=1000){
    if(this._platform.is("cordova") && !this._platform.is("windows")){
      this.options.direction = direction;
      this.options.duration = duration;
      this._nativePageTransitions.drawer(this.options)
      .then(onSuccess=>{
        console.log("Success Transition");
      }).catch(onError=>{console.error("Error on effectDrawer"+JSON.stringify(onError))});

    }else
      console.warn("Not supported platform");
  }


}
