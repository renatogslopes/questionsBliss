import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, ToastController, NavParams } from 'ionic-angular';
import { DetailPage } from '../../pages/detail/detail';
import { BlissApiProvider } from '../../providers/bliss-api/bliss-api';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  private aQuestions: any = [];
  private aQuestionsTemp: any = [];
  private fakeQuestions: any = ['', '', '', '', '', '', '', '', '', ''];
  private nOffsetValue: any = 10;
  private nLimitValue: any = 10;
  private sStreamNameInput: any;

  constructor(public navCtrl: NavController, public blissAPI: BlissApiProvider, public navParams: NavParams,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
    
  }

  ionViewWillEnter() {
    this.getServerHealth();
  }

  getServerHealth() {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading information, Please Wait...'
    });
    loading.present();
    this.blissAPI.getServerHealth().then((data: any) => {      
      if (data.status != 'OK') {
        setTimeout(() => {
          this.alertControllerServerHealth();
        }, 500);
        loading.dismiss();
      } else {
        this.getQuestionsRandom(this.nLimitValue, this.nOffsetValue, false);
        setTimeout(() => {
          loading.dismiss();
        }, 500);

      }
    }).catch(err => {
      loading.dismiss();
      setTimeout(() => {
        this.alertControllerServerHealth();
      }, 1000);
    });
  }

  alertControllerServerHealth() {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'The server is down... try later, please.',
      buttons: [{
        text: 'Retry',
        handler: () => {
          this.getServerHealth();
        }
      }]
    });
    alert.present();
  }

  getQuestionsRandom(nLimitValue: any, nOffsetValue: any, refresher: any) {
    this.blissAPI.getQuestionsRandom(nLimitValue, nOffsetValue).then((data: any) => {
      
      if(refresher){
        setTimeout(() => {
          this.aQuestions = data;
          this.aQuestionsTemp = data;
        }, 500);
      }else{
        setTimeout(() => {
          this.aQuestions = this.aQuestions.concat(data);
          this.aQuestionsTemp = this.aQuestionsTemp.concat(data);;
        }, 500);
      }
      
    }).catch(err => {
      setTimeout(() => {
        this.alertControllerQuestionsRandom();
      }, 1000);
    });
  }

  alertControllerQuestionsRandom() {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Unable to get questions from server',
      buttons: [{
        text: 'Retry',
        handler: () => {
          this.getQuestionsRandom(this.nLimitValue, this.nOffsetValue, true);
        }
      }]
    });
    alert.present();
  }

  showQuestionDetails(question: any) {
    this.navCtrl.push(DetailPage,{questionObject: question});
  }

  showPrompt(aEvent: any, nId: any) {
    aEvent.stopPropagation();
    let alert = this.alertCtrl.create({
      title: 'Share question(s)',
      message: 'Enter a valid email address to share the question(s).',
      inputs: [
        {
          name: 'Email',
          type: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Send',
          handler: data => {

            if (data.Email) {
              let patternEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              if (!patternEmail.test(data.Email)) {
                this.showToast('Email Address in invalid format', 'errorToast');
                return false;
              } else {
                // start some async method
                this.blissAPI.shareQuestion(data.Email,document.URL).then((data: any) => {
                  if (data.status != 'OK') {
                    this.showToast('Error sharing the question, please try again.', 'errorToast');  
                  } else {
                    this.showToast('Shared!','successToast');            
                  }
                }).catch(err => {
                  this.showToast('Error sharing the question, please try again.', 'errorToast'); 
                });
                
              }
            } else {
              this.showToast('Email Address is required to proceed.', 'errorToast');
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }
  
  onSearch(){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Searching question, Please Wait...'
    });    
    if(this.sStreamNameInput){      
      loading.present();
      this.aQuestions = this.aQuestionsTemp.filter((question) =>{ 
        return question.question.indexOf(this.sStreamNameInput.toLowerCase()) > 0 
      });     
      loading.dismiss(); 
    }else{
      this.aQuestions = this.aQuestionsTemp;
    }   
    
  }

  showToast(message: string, cssColor:any) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      cssClass: cssColor
    });
    toast.present();
  }


  doRefresh(refresher) {
    this.nLimitValue = 10;
    this.nOffsetValue = 10;

    this.getQuestionsRandom(this.nLimitValue, this.nOffsetValue,true);
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  doInfinite(infiniteScroll) {
    this.nLimitValue = this.nLimitValue + 10;
    this.nOffsetValue = this.nOffsetValue + 10;

    setTimeout(() => {
      this.getQuestionsRandom(this.nLimitValue, this.nOffsetValue, false);
      infiniteScroll.complete();
    }, 500);
  }

}
