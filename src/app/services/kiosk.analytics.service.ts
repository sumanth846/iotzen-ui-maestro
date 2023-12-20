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

    getSokOrderCountByStatus(startDate, endDate, fieldType, status, pickUpCityIds?, pickUpStoreIds?) {
        let url = this.configService.appConfig.appBaseUrl + 'sok/analytics/orderCount' + '?startDateMilliSec=' + startDate + '&endDateMilliSec=' + endDate;
        if (fieldType === 'paymentStatus') {
            url = url + '&paymentStatus=' + status
        } else if (fieldType === 'pickupStatus') {
            url = url + '&pickupStatus=' + status
        }
        if (pickUpCityIds) {
            url = url + '&pickUpCityIds=' + pickUpCityIds
        }
        if (pickUpStoreIds) {
            url = url + '&pickUpStoreIds=' + pickUpStoreIds
        }
        return this.http.get(url)
    }

    getSokTotalAmountByStatus(startDate, endDate, status, pickUpCityIds?, pickUpStoreIds?) {
        let url = this.configService.appConfig.appBaseUrl + 'sok/analytics/totalAmount' + '?startDateMilliSec=' + startDate + '&endDateMilliSec=' + endDate + '&field=' + status;
        if (pickUpCityIds) {
            url = url + '&pickUpCityIds=' + pickUpCityIds
        }
        if (pickUpStoreIds) {
            url = url + '&pickUpStoreIds=' + pickUpStoreIds
        }
        return this.http.get(url)
    }

    getSokOrdersByStatusForGraph(startDate, endDate, groupByField, fieldType?, status?, series?, pickUpCityIds?, pickUpStoreIds?) {
        let url = this.configService.appConfig.appBaseUrl + 'sok/analytics/orderCountGrp' + '?startDateMilliSec=' + startDate + '&endDateMilliSec=' + endDate + '&groupByField=' + groupByField;
        if (fieldType === 'paymentStatus') {
            url = url + '&paymentStatus=' + status
        } else if (fieldType === 'pickupStatus') {
            url = url + '&pickupStatus=' + status
        }
        if (series) {
            url = url + '&series=' + series;
        }
        if (pickUpCityIds) {
            url = url + '&pickUpCityIds=' + pickUpCityIds
        }
        if (pickUpStoreIds) {
            url = url + '&pickUpStoreIds=' + pickUpStoreIds
        }
        return this.http.get(url)
    }

    getSokTotalAmountByStatusForGraph(startDate, endDate, groupByField, status, series?, pickUpCityIds?, pickUpStoreIds?) {
        console.log(startDate, endDate, groupByField, status, series, pickUpCityIds, pickUpStoreIds);
        let url = this.configService.appConfig.appBaseUrl + 'sok/analytics/revenueGrp' + '?startDateMilliSec=' + startDate + '&endDateMilliSec=' + endDate + '&groupByField=' + groupByField + '&field=' + status;
        if (series) {
            url = url + '&series=' + series;
        }
        if (pickUpCityIds) {
            url = url + '&pickUpCityIds=' + pickUpCityIds
        }
        if (pickUpStoreIds) {
            url = url + '&pickUpStoreIds=' + pickUpStoreIds
        }
        return this.http.get(url)
    }

    getSokTopProducts(startDate, endDate, series?, pickUpCityIds?, pickUpStoreIds?, topN = 5) {
        let url = this.configService.appConfig.appBaseUrl + 'sok/analytics/topProductsOrdered' + '?startDateMilliSec=' + startDate + '&endDateMilliSec=' + endDate;
        if (series) {
            url = url + '&series=' + series;
        }
        if (pickUpCityIds) {
            url = url + '&pickUpCityIds=' + pickUpCityIds
        }
        if (pickUpStoreIds) {
            url = url + '&pickUpStoreIds=' + pickUpStoreIds
        }
        if (topN) {
            url = url + '&topN=' + topN
        }
        return this.http.get(url)
    }

    downloadRevenueReporGroupByField(startDate, endDate, groupByField, aggregateData?, reportType = 'json', view: boolean = false, isCount: boolean = false, skip?, limit?) {
        let queryUrl = this.configService.appConfig.appBaseUrl + 'sok/analytics/revenueReport' + '?startDateMilliSec=' + startDate + '&endDateMilliSec=' + endDate + '&groupByField=' + groupByField;
        if (aggregateData) {
            queryUrl = queryUrl + '&aggregateData=' + aggregateData
        }
        if (reportType) {
            queryUrl = queryUrl + '&reportType=' + reportType
        }
        if (!view) {
            window.open(queryUrl + '&token=' + sessionStorage.getItem('token'), '_blank');
        } else if (view) {
            if (isCount) {
                queryUrl = queryUrl + '&isCount=' + isCount;
            }
            if (skip > -1 && limit) {
                queryUrl = queryUrl + '&skip=' + skip + '&limit=' + limit
            }
            return this.http.get(queryUrl);
        }
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

    async downloadProductSalesByStore(startDateMilliSec, endDateMilliSec, reportType, pickUpStoreIds, fileName, orderSource?) {

        let url = this.configService.appConfig.appBaseUrl + `sok/analytics/productSales?startDateMilliSec=${startDateMilliSec}`;

        if (endDateMilliSec) {
            url += `&endDateMilliSec=${endDateMilliSec}`;
        }
        if (reportType) {
            url += `&reportType=${reportType}`;
        }
        if (orderSource) {
            url += `&orderSource=${orderSource}`;
        }
        if (pickUpStoreIds) {
            url += `&pickUpStoreIds=${pickUpStoreIds}`;
        }
        await this.downloadService.downloadFilesViaObservable(url, fileName);
    }


}


