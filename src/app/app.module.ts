import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, IonicPageModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';

import { MyApp } from './app.component';
import { HomePageModule } from '../pages/home/home.module';
import { HomePage } from '../pages/home/home';
import { DetailPageModule } from '../pages/detail/detail.module';
import { DetailPage } from '../pages/detail/detail';
import { BlissApiProvider } from '../providers/bliss-api/bliss-api';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DetailPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp,{} ,{
      links: [
        { component: HomePage, name: 'Home Page', segment: 'questions' },
        { component: HomePage, name: 'Home Page', segment: 'questions/:question_filter',defaultHistory: ['questions'] },
        { component: DetailPage, name: 'Detail Page', segment: 'questions', defaultHistory: ['questions'] },
        { component: DetailPage, name: 'Detail Page', segment: 'questions/:question_id',defaultHistory: ['questions'] },
      ]
    }),
    HomePageModule,
    DetailPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BlissApiProvider,
    Network
  ]
})
export class AppModule {}
