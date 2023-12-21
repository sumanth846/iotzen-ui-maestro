import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LangUtilService {
    subscription: Subscription;

    constructor(
        private translate: TranslateService,
    ) {
    }

    updateUserLanguage(language: string) {
        if (!language) {
            language = 'en';
        }

        if (!this.translate.defaultLang) {
            this.translate.setDefaultLang('en');
        }

        if (this.translate.getLangs().length === 0) {
            this.translate.addLangs(['en', 'de', 'ar', 'fr', 'kannada']);
        }

        this.subscription = this.translate.use(language).subscribe(_ => {
            sessionStorage.setItem('userLanguage', language);
            // this.translate.reloadLang(language);
        });
    }


}
