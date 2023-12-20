import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import { Observable } from "rxjs";
import { QrRes } from "../interface/maestro-interface";

function _window(): any {
    return window;
}

@Injectable({ providedIn: "root" })
export class KioskOrderService {

    constructor(private http: HttpClient, private configService: ConfigService) {

    }

    checkoutCartOrders(products, storeId, obj?) {
        let url = this.configService.appConfig.appBaseUrl + "maestro/checkOut";
        const body = {
            products: products,
            storeId: storeId,
            orderSource: "iotzen-pos",
            dineType: obj?.dineType,
        };
        if (obj?.dineType === 'table') {
            body['tableNo'] = obj?.tableNo;
        }
        return this.http.post(url, body);
    }

    checkoutUpdatedCartOrders(orderId, products, storeId, obj?) {
        let url =
            this.configService.appConfig.appBaseUrl +
            "maestro/checkOut/" +
            orderId;
        const body = {
            products: products,
            storeId: storeId,
            dineType: obj?.dineType
        };
        if (obj?.dineType === 'table') {
            body['tableNo'] = obj?.tableNo;
        }
        return this.http.put(url, body);
    }

    initiatePayment(orderId) {
        let url =
            this.configService.appConfig.appBaseUrl + "payments/initiate/" + orderId;
        return this.http.get(url);
    }

    getQrCode(orderId): Observable<QrRes> {
        let url =
            this.configService.appConfig.appBaseUrl +
            "sok/orders/checkOut/qrCode/" +
            orderId;
        return this.http.get<QrRes>(url);
    }

    getPaymentStatus(orderId) {
        let url =
            this.configService.appConfig.appBaseUrl +
            "sok/orders/checkOut/payment/success/" +
            orderId;
        return this.http.get(url);
    }

    checkOccupiedTable(id: string) {
        let url = this.configService.appConfig.appBaseUrl + "sok/stores/tableInfo/locationId/" + id;
        return this.http.get(url);
    }


    initiateRefund(orderId: any, amount: number, refundReason: string) {
        let url =
            this.configService.appConfig.appBaseUrl +
            `payments/refund/orderId/${orderId}`;
        const body = {
            amount: amount,
            reason: refundReason,
        };
        return this.http.post(url, body);
    }

    cancelOrder(orderId, screen) {
        let url =
            this.configService.appConfig.appBaseUrl +
            "sok/orders/updatePickUpStatus/cancelled";
        let cancelOrderIds = [];
        cancelOrderIds.push(orderId);
        const body = {
            orderIds: cancelOrderIds,
            screen: screen,
        };
        return this.http.put(url, body);
    }

    discardOrderId(orderId, screen) {
        let url =
            this.configService.appConfig.appBaseUrl +
            "sok/orders/updatePickUpStatus/discarded";
        let cancelOrderIds = [];
        cancelOrderIds.push(orderId);
        const body = {
            orderIds: cancelOrderIds,
            screen: screen,
        };
        return this.http.put(url, body);
    }

    getAccountName() {
        let url = this.configService.appConfig.appBaseUrl + "account/self/data";
        return this.http.get(url);
    }

    getRecieptContent(orderId: string) {
        let url =
            this.configService.appConfig.appBaseUrl +
            `payments/getRecieptContent/orderId/${orderId}`;
        if (orderId) {
            return this.http.get(url);
        }
    }

    getOrderSummary(orderId: string) {
        let url =
            this.configService.appConfig.appBaseUrl +
            `payments/getRecieptContent/orderId/${orderId}?type=orderSummary`;
        if (orderId) {
            return this.http.get(url);
        }
    }

    sendRecieptOnline(orderId: string, email: string) {
        let url =
            this.configService.appConfig.appBaseUrl +
            `payments/sendReceipt/?orderId=${orderId}&sendAddress=${email}`;
        const body = {
            orderId: orderId,
            email: email,
        };
        if (orderId && email) {
            return this.http.put(url, body);
        }
    }

    sendPaymentLink(orderId: string, address: string) {
        let url =
            this.configService.appConfig.appBaseUrl +
            `payments/sendPaymentLink/orderId/${orderId}`;
        const body = {
            sendAddress: address,
        };
        if (orderId && address) {
            return this.http.post(url, body);
        }
    }

    get nativeWindow(): any {
        return _window();
    }

}