import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { BlissApiProvider } from '../../providers/bliss-api/bliss-api';

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  private aQuestion: any;
  private bIsenabled: boolean = false; 

  constructor(public navCtrl: NavController, public navParams: NavParams, public blissAPI: BlissApiProvider,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController) {
      this.aQuestion = this.navParams.get('questionObject');
      //Add new element to the object for control the action click.
      this.aQuestion.choices.forEach((choice) =>{
        choice.clicked = false;
      });
  }

  selectVote(nIndex:any) {
    let bTempStateButton = this.aQuestion.choices[nIndex].clicked;

    //Reset the state 'clicked' - This operation guarantee just one button is active. 
    this.aQuestion.choices.forEach(function(choice) {
      choice.clicked = false;
    });

    this.aQuestion.choices[nIndex].clicked = !bTempStateButton;
    if(this.aQuestion.choices[nIndex].clicked){
      this.bIsenabled = true;
    }else{
      this.bIsenabled = false;
    }
  }

  vote(nQuestionID: any, jBodyQuestion: any, nIdChoice: any) {
    //This operation it's for 'remove' linked objects.
    jBodyQuestion = JSON.stringify(jBodyQuestion);
    let jBodyToSend = JSON.parse(jBodyQuestion);
    
    for(let i = 0; i < jBodyToSend.choices.length; i++){
      if(jBodyToSend.choices[i].clicked){
        jBodyToSend.choices[i].votes = 1;
      }else{
        jBodyToSend.choices[i].votes = 0;
      }
      //Remove key clicked because it's not necessary to send.
      delete jBodyToSend.choices[i]['clicked'];
    }
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Voting, Please Wait...'
    });

    loading.present();

     this.blissAPI.vote(nQuestionID,jBodyToSend).then((data: any) => {
      if (data.status != 'OK') {
        loading.dismiss();
        this.showToast('Voted!','successToast'); 
        setTimeout(() => {
          this.backToHome();  
        }, 500);              
      } else {
        loading.dismiss();
        this.showToast('Error while voting on the question, please try again.', 'errorToast'); 
      }
    }).catch(err => {
      this.showToast('Error while voting on the question, please try again.', 'errorToast'); 
    }); 
  } 

  showPrompt(aEvent: any, nId: any) {
    aEvent.preventDefault();
    let alert = this.alertCtrl.create({
      title: 'Share question',
      message: 'Enter a valid email address to share the question.',
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
                this.blissAPI.shareQuestion(data.Email,document.URL+'?question_id='+nId).then((data: any) => {
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


  showToast(message: string, cssColor:any) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      cssClass: cssColor
    });
    toast.present();
  }

  backToHome() {
    this.navCtrl.pop();
  }

}
