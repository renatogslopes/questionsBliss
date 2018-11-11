import { Component } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;
  private plat 
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private network: Network, private toastCtrl: ToastController) {
    platform.ready().then(() => {
      this.plat = platform;
      statusBar.styleDefault();
      splashScreen.hide();
        this.checkNewtwork();
    
    });
  }
  checkNewtwork() {
    var toastOFF = this.toastCtrl.create({
      message: 'You are offline, check your internet connection.',
      cssClass: 'errorToast',
      position: 'bottom'
    });
    var toastON = this.toastCtrl.create({
      message: 'You are back!, enjoy the app.',
      duration: 3000,
      position: 'bottom',
      cssClass: 'successToast',
      showCloseButton: true,
      closeButtonText: 'Close'
    });
   
    //for browser
    if(this.plat.is('core')){  
      window.addEventListener("online", function (e) {
        toastOFF.dismiss();
        toastON.present();
      }, false);
      window.addEventListener("offline", function (e) {
        toastOFF.present();
        toastON.dismiss();
      }, false);
    }else{
      //for mobile
      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        toastOFF.present();
        toastON.dismiss();
      });
  
      let connectSubscription = this.network.onConnect().subscribe(() => {
        toastOFF.dismiss();
        toastON.present();
  
      });
    }
  }
}

