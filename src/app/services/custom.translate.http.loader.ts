import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../config/environments/environment';

export class CustomTranslateHttpLoader implements TranslateLoader {

    constructor(private http: HttpClient) {
    }


    getTranslation(lang: string): Observable<Object> {
        const url = `${environment.server_url}api/languageMeta/id/${lang}`;
        return this.http.get(url);
    }
}
