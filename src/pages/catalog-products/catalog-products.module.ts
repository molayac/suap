import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CatalogProductsPage } from './catalog-products';

@NgModule({
  declarations: [
    CatalogProductsPage,
  ],
  imports: [
    IonicPageModule.forChild(CatalogProductsPage),
  ],
})
export class CatalogProductsPageModule {}
