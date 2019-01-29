import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class BlissApiProvider {
  private APIEndpoint: any = 'https://private-anon-7960e72cf0-blissrecruitmentapi.apiary-mock.com/'
  constructor(public http: HttpClient) {
    
  }

  getServerHealth() {
    return this.http.get(this.APIEndpoint+'health').toPromise();
  }

  getQuestionsRandom(nLimit:any, nOffsetValue:any ) {
    return this.http.get(this.APIEndpoint+'questions?limit='+nLimit+'&offset='+nOffsetValue+'&filter=question').toPromise();
  }

  shareQuestion(sDestionationEmail:any, sUrl:any ) {
    return this.http.post(this.APIEndpoint+'share?destination_email='+sDestionationEmail+'&content_url='+sUrl,'').toPromise();
  }

  vote(sQuestionID:any, sQuestionToVote:any ) {
    return this.http.put(this.APIEndpoint+'questions/'+sQuestionID,sQuestionToVote).toPromise();
  }

}
