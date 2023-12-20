import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http:HttpClient,private configService:ConfigService) { }
  
    verifyUserDetails(userDetails) {
      return this.http.post(this.configService.appConfig.loginBaseURL + '/authentication/login', userDetails);
    }
}
