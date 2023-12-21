import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})
export class DownloadUtilService {
    public showLoader: boolean;

    constructor(private http: HttpClient, public configService: ConfigService) {
    }


    public async downloadFilesViaObservable(url: string, fileName?: string) {

        const res$ = this.downloadFiles(url);
        const blob = await lastValueFrom(res$);

        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = fileName ? fileName : 'document.xls';
        a.click();
        URL.revokeObjectURL(objectUrl);
    }

    downloadFiles(url: string): Observable<Blob> {
        return this.http.get(url, {
            responseType: 'blob'
        });
    }

}
