import {TranslateLoader} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ConfigService} from './config.service';

export class CustomTranslateHttpLoader implements TranslateLoader {

  constructor(private http: HttpClient, private configService: ConfigService) {
  }


  getTranslation(lang: string): Observable<NonNullable<unknown>> {
    const query = `?date=300000`;
    const token = localStorage.getItem('token');
    const url = `${this.configService.appConfig.appBaseUrl}languageMeta/id/${lang}${query}`;
    const headers = {
      authorization: token ? token : ''
    };
    return this.http.get(url, {headers: headers});
  }
}
