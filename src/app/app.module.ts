import {NgModule} from '@angular/core';
import {IonicStorageModule} from '@ionic/storage';
import {IonicApp, IonicModule} from 'ionic-angular';
import {HomePage} from '../pages/home/home';
import {ResultPage} from '../pages/result/result';
import {MyApp} from './app.component';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ResultPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ResultPage
  ],
  providers: []
})
export class AppModule {
}
