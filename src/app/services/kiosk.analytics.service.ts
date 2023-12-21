import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { DownloadUtilService } from './download.util.service';

@Injectable({
    providedIn: 'root'
})
export class KioskAnalyticsService {

    constructor(private http: HttpClient, public configService: ConfigService, private downloadService: DownloadUtilService) {
    }

    getProductSalesByStore(startDateMilliSec, endDateMilliSec, reportType, pickUpStoreIds, isCount, skip?, limit?, orderSource?) {
        let url = this.configService.appConfig.appBaseUrl + `sok/analytics/productSales?startDateMilliSec=${startDateMilliSec}`;

        if (endDateMilliSec) {
            url += `&endDateMilliSec=${endDateMilliSec}`;
        }
        if (reportType) {
            url += `&reportType=${reportType}`;
        }
        if (pickUpStoreIds) {
            url += `&pickUpStoreIds=${pickUpStoreIds}`;
        }
        if (orderSource) {
            url += `&orderSource=${orderSource}`;
        }

        if (isCount) {
            url += `&isCount=true`
        } else {
            url += `&isCount=false`
            if (skip != null || skip !== undefined) {
                url += '&skip=' + skip
            }
            if (limit != null || limit !== undefined) {
                url += '&limit=' + limit
            }
        }

        return this.http.get(url);
    }
}


