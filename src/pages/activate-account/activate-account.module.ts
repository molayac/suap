import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivateAccountPage } from './activate-account';

@NgModule({
  declarations: [
    ActivateAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivateAccountPage),
  ],
})
export class ActivateAccountPageModule {}
