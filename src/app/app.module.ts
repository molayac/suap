import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage, IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { CardsPage
, ContentPage
, ItemCreatePage
, ItemDetailPage
, ListMasterPage
, LoginPage
, MapPage
, MenuPage
, SearchPage
, SettingsPage
, SignupPage
, TabsPage
, TutorialPage
, WelcomePage
, StorePage
, ProductDetailsPage
, CatalogPage
, CatalogProductsPage} from '../pages/index-pages';

import { Api } from '../providers/api';
import { Items } from '../mocks/providers/items';
import { Settings } from '../providers/settings';
import { OfflineService } from '../providers/offline';
import { User } from '../providers/user';

import { Camera } from '@ionic-native/camera';
import { GoogleMaps } from '@ionic-native/google-maps';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MgCustomerProvider } from '../providers/mg-customer/mg-customer';
import { MgGlobalProvider } from '../providers/mg-global';
import { MgProductsProvider } from '../providers/mg-products/mg-products';
import { EffectsProvider } from '../providers/effects/effects';

//plugins
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { MgCategoriesProvider } from '../providers/mg-categories/mg-categories';
import { Magento2ServiceProvider } from '../providers/magento2-service/magento2-service';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    URLBASE:"http://192.168.2.192/magento",
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello',
    showTutorial: true,
    stores: []
  });

}

@NgModule({
  declarations: [
    MyApp,
    CardsPage,
    ContentPage,
    ItemCreatePage,
    ItemDetailPage,
    ListMasterPage,
    LoginPage,
    MapPage,
    MenuPage,
    SearchPage,
    SettingsPage,
    SignupPage,
    TabsPage,
    TutorialPage,
    WelcomePage,
    StorePage,
    CatalogPage,
    ProductDetailsPage,
    CatalogProductsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CardsPage,
    ContentPage,
    ItemCreatePage,
    ItemDetailPage,
    ListMasterPage,
    LoginPage,
    MapPage,
    MenuPage,
    SearchPage,
    SettingsPage,
    SignupPage,
    TabsPage,
    TutorialPage,
    WelcomePage,
    StorePage,
    CatalogPage,
    ProductDetailsPage,
    CatalogProductsPage
  ],
  providers: [
    Api,
    Items,
    User,
    Camera,
    GoogleMaps,
    SplashScreen,
    StatusBar,
    NativePageTransitions, //Utilizado para los efectos entre pantallas
    OfflineService,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    MgCustomerProvider,
    MgProductsProvider,
    MgGlobalProvider,
    EffectsProvider,
    MgCategoriesProvider,
    Magento2ServiceProvider
  ]
})
export class AppModule { }
