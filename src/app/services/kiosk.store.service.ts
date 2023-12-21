
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';
import * as _ from 'lodash';
// import { ICategorySequencePayload } from '../../../state/Assets/interfaces/IAsset.category.model';
import {
    ICategoryMetaInfoPayload, ICategorySequencePayloadStoreLevel, IStoreCategoryUpdatePayload, AvailableKiosks, IGroupsOfKioskSettingsWithModule, IKioskTableFormSettings, IKisoskSettingsMetaData, IPayByCashCartParam,
    IPayloadForDelinkingSlots, RazorPay, KAgent
} from '../interface/maestro-interface';
// import { number } from 'echarts';
import { Observable, } from 'rxjs';
// import { ICommandKAgent } from '../../../app/standalone-components/k-agent/k-agent.component';


@Injectable({
    providedIn: 'root'
})

export class KioskStoreService {


    constructor(private http: HttpClient, public configService: ConfigService) {
    }

    getStoreList() {

        let res =
            this.configService.appConfig.appBaseUrl
            + 'asset?isLinkedReq=false&fI=name,noofFloors&type=location'
        return this.http.get(res)
    }

    getKAgents(): Observable<KAgent> {
        let url = `${this.configService.appConfig.appBaseUrl}kAgent/all`
        return this.http.get<KAgent>(url);
    }

    rebootKioskAgent(machineId, rebootTo): Observable<{ msg: string }> {
        let url = `${this.configService.appConfig.appBaseUrl}kAgent/executeCommand/id/${machineId}`
        let body = {
            "type": rebootTo,
            "command": "restart"
        }
        return this.http.put<{ msg: string }>(url, body)
    }

    delinkKioskAgent(kAgentId): Observable<{ msg: string }> {
        let url = `${this.configService.appConfig.appBaseUrl}kAgent/delink/id/${kAgentId}`
        return this.http.put<{ msg: string }>(url, {})
    }

    getKioskList(): Observable<AvailableKiosks> {
        let url = `${this.configService.appConfig.appBaseUrl}kAgent/kiosks`
        return this.http.get<AvailableKiosks>(url);
    }

    linkKiosk(kAgentId, kioskId): Observable<{ msg: string }> {
        let url = `${this.configService.appConfig.appBaseUrl}kAgent/link/id/${kAgentId}`;
        let body = {
            "kioskId": kioskId
        }
        return this.http.put<{ msg: string }>(url, body);
    }

    changeMachineName(kAgentId, machineName): Observable<KAgent> {
        let url = `${this.configService.appConfig.appBaseUrl}kAgent/id/${kAgentId}`;
        let body = {
            "machineName": machineName
        }
        return this.http.put<KAgent>(url, body);
    }

    getProductListByStore(storeId: string, skip: number, limit: number, filters = '', isCategory = false, search?: string, includeImage = false) {
        let url = ''
        if (isCategory) {
            url = this.configService.appConfig.appBaseUrl + `sok/stores/productsLinked/category/${storeId}?isCount=false&skip=${skip}&limit=${limit}`
        } else {
            url = this.configService.appConfig.appBaseUrl + `sok/stores/productsLinked/${storeId}?isCount=false&includeImage=${includeImage}&skip=${skip}&limit=${limit}&disableSlots=true`

        }

        if (filters !== '') {
            url = url + filters
        }

        if (search !== '') {
            url = url + '&search=' + search
        }

        return this.http.get(url);
    }

    getProductCountByStore(storeId: string, filters = '', isCategory = false, search: string) {

        let url = ''

        url = this.configService.appConfig.appBaseUrl
            + `sok/stores/productsLinked/${storeId}?isCount=true&disableSlots=true`

        if (filters !== '') {
            url = url + filters
        }
        if (search !== '') {
            url = url + '&search=' + search
        }

        if (isCategory) {

        }

        return this.http.get(url)
    }

    getAllProductAssetsInKiosk(skip, limit, searchedText?) {
        let queryUrl = '';
        if (searchedText) {
            queryUrl = this.configService.appConfig.appBaseUrl + 'assets/search/' + searchedText + '?type=product' + '&skip=' + skip + '&limit=' + limit;
        } else {
            queryUrl = this.configService.appConfig.appBaseUrl + 'asset' + '?skip=' + skip + '&limit=' + limit + "&type=product";
        }
        return this.http.get(queryUrl);
    }

    getAllProductAssetsCountInKiosk(searchedText?) {
        let queryUrl = '';
        if (searchedText) {
            queryUrl = this.configService.appConfig.appBaseUrl + 'assets/search/count/' + searchedText + '?type=product';
        } else {
            queryUrl = this.configService.appConfig.appBaseUrl + 'asset/count?type=product';
        }
        return this.http.get(queryUrl);
    }

    getAllProducts() {
        let url
        this.configService.appConfig.appBaseUrl
            + `asset?skip=0&limit=1000&type=product`
        return this.http.get(url);
    }

    getAllOrders() {
        let url = this.configService.appConfig.appBaseUrl + 'orderToDelivery/order?skip=0&limit=1000?orderSource=kiosk,iotzen-pos'
        return this.http.get(url)
    }

    getUnlinkedProductCountByStore(storeId, searchQuery = '') {
        let url = this.configService.appConfig.appBaseUrl
            + `sok/stores/productsNotLinked/${storeId}?isCount=True`;
        if (searchQuery !== '') {
            url = url + '&search=' + searchQuery
        }
        return this.http.get(url)
    }


    getUnlinkedProductListByStore(storeId: string, skip: number, limit: number) {
        let url = this.configService.appConfig.appBaseUrl
            + `sok/stores/productsNotLinked/${storeId}?skip=${skip}&limit=${limit}`

        return this.http.get(url)
    }

    getUnlinkedProductListByStore1(storeId: string, skip: number, limit: number, searchQuery: string) {
        let queryUrl = this.configService.appConfig.appBaseUrl + "sok/stores/productsNotLinked/" + storeId + "?skip=" + skip + "&limit=" + limit;
        if (searchQuery && searchQuery.length > 0) {
            queryUrl = queryUrl + '&search=' + searchQuery
        }
        return this.http.get(queryUrl);
    }


    sendProductIdsTolinkToStore(storeId, productIds, isActivated?) {
        let obj = {
            "productIds": productIds,
            "metaInfo": {
                "status": true,
                "quantity": 0
            }
        }
        if (isActivated) {
            obj.metaInfo['isActivated'] = true
        }
        let queryUrl = this.configService.appConfig.appBaseUrl + 'sok/stores/linkProducts/' + storeId
        return this.http.post(queryUrl, obj)
    }

    sendProductsAndGroups(assetLinkIds, groupIds) {
        let queryUrl = this.configService.appConfig.appBaseUrl + 'assetLinkMeta/linkGroups/'
        return this.http.put(queryUrl, { assetLinkIds: assetLinkIds, groupIds: groupIds })
    }


    addMultipleProductsToMultipleGroups(assetIds, groupIds) {
        let queryUrl = this.configService.appConfig.appBaseUrl + 'assetLinkMeta/linkGroups/asset'
        return this.http.put(queryUrl, { assetIds: assetIds, groupIds: groupIds })
    }

    sendassetLinkMeta(assetLinkId, metaInfoStatus, metaInfoQty, metaInfoStorePrice?, metaInfoIsActivated?, dynamicPriceData?) {
        let queryUrl = this.configService.appConfig.appBaseUrl + 'assetLinkMeta/metaInfo';
        let payload = {
            assetLinkIds: assetLinkId,
            "metaInfo": {
            }
        }
        if (metaInfoStatus !== null) {
            payload['metaInfo']['status'] = metaInfoStatus
        }
        if (metaInfoIsActivated !== null) {
            payload['metaInfo']['isActivated'] = metaInfoIsActivated
        }
        if (metaInfoQty !== null) {
            payload['metaInfo']["quantity"] = metaInfoQty
        }

        if (metaInfoStorePrice !== null) {
            payload['metaInfo']["price"] = metaInfoStorePrice
        }
        if (dynamicPriceData) {
            payload['metaInfo']['prices'] = dynamicPriceData
        }
        return this.http.put(queryUrl, payload)
    }

    getAssetLinkMetaById(assetLinkId) {
        let url = this.configService.appConfig.appBaseUrl + 'assetLinkMeta/metaInfo/' + assetLinkId
        return this.http.get(url)
    }

    removeProductByAssetLinkId(assetLinkId) {
        let queryUrl = this.configService.appConfig.appBaseUrl + 'assetLinkMeta/delinkAssets/'
        if (assetLinkId.length > 0) {
            let linkIds = ''
            _.map(assetLinkId, (link) => {
                if (link !== assetLinkId[assetLinkId.length - 1]) {
                    linkIds = linkIds + link + ','
                } else {
                    linkIds = linkIds + link
                }
            })
            queryUrl = queryUrl + linkIds
        }
        return this.http.delete(queryUrl)
    }


    removeGroupByLinkIds(groupId, assetLinkId) {
        let queryUrl = this.configService.appConfig.appBaseUrl + 'assetLinkMeta/delinkGroups'
        let payLoad = {
            assetLinkIds: [assetLinkId],
            groupIds: [groupId]
        }
        return this.http.put(queryUrl, payLoad)

    }

    getCategoriesList(skip, limit) {
        let url = this.configService.appConfig.appBaseUrl + 'asset?skip=' + skip + '&limit=' + limit + '&type=category';
        return this.http.get(url);
    }

    setOrderAsPicked(orderIds, obj?: IPayByCashCartParam) {
        const url = this.configService.appConfig.appBaseUrl + "payments/paidByCash";
        const payload = {
            orderIds: orderIds
        }
        if (obj) {
            payload['amount'] = obj?.amount,
                payload['pMode'] = obj?.pMode
        }
        return this.http.put(url, payload);
    }

    //    dashboard api services
    getDataByCityandLocation() {
        let url = this.configService.appConfig.appBaseUrl + 'orderToDelivery/analytics/genericGrpdata/?orderSource=kiosk,iotzen-pos';
        return this.http.get(url)
    }

    getOrdersDataByCityAndLocations(startDate, endDate, series?, orderPickUpCityId?, orderPickUpStoreId?, grpId?, sumId?, deliveryStatus?, isDashBoard?) {
        let queryUrl = this.configService.appConfig.appBaseUrl + 'orderToDelivery/analytics/genericGrpdata/?orderSource=kiosk,iotzen-pos'
        if (startDate) {
            queryUrl = queryUrl + '&startDate=' + startDate;
        }
        if (endDate) {
            queryUrl = queryUrl + '&endDate=' + endDate;
        }
        if (series) {
            queryUrl = queryUrl + '&series=' + series;
        }
        if (orderPickUpCityId) {
            queryUrl = queryUrl + '&orderPickUpCityId=' + orderPickUpCityId;
        }
        if (orderPickUpStoreId) {
            queryUrl = queryUrl + '&orderPickUpStoreId=' + orderPickUpStoreId;
        }
        if (grpId) {
            queryUrl = queryUrl + '&grpId=' + grpId;
        }
        if (sumId) {
            queryUrl = queryUrl + '&sumId=' + sumId;
        }
        if (deliveryStatus) {
            queryUrl = queryUrl + '&deliveryStatus=' + deliveryStatus;
        }
        if (isDashBoard) {
            queryUrl = queryUrl + '&isDashBoard=' + isDashBoard;
        }
        queryUrl = queryUrl + '&dateField=pickup.created'
        return this.http.get(queryUrl);
    }

    getPopularProducts(startDate, endDate, orderPickUpCityId, orderPickUpStoreId, pickupStatus, grpId, series?) {
        let url = this.configService.appConfig.appBaseUrl + 'orderToDelivery/analytics/productsAnalytics/?orderSource=kiosk,iotzen-pos'
        if (startDate) {
            url = url + '&startDate=' + startDate
        }
        if (endDate) {
            url = url + '&endDate=' + endDate
        }
        if (orderPickUpStoreId) {
            url = url + '&orderPickUpStoreId=' + orderPickUpStoreId
        }
        if (orderPickUpCityId) {
            url = url + '&orderPickUpCityId=' + orderPickUpCityId
        }
        if (pickupStatus) {
            url = url + '&pickupStatus=' + pickupStatus
        }
        if (grpId) {
            url = url + '&grpId=' + grpId
        }
        if (series) {
            url = url + '&series=' + series

        }
        url = url + '&dateField=pickup.created'
        return this.http.get(url)
    }

    getOrdersByDay(startDate, endDate, series, cityId, locationId, grpId?) {
        let url = this.configService.appConfig.appBaseUrl + 'orderToDelivery/analytics/genericGrpdata/?orderSource=kiosk,iotzen-pos'

        if (startDate) {
            url = url + '&startDate=' + startDate
        }
        if (endDate) {
            url = url + '&endDate=' + endDate
        }
        if (series) {
            url = url + '&series=' + series
        }
        if (cityId) {
            url = url + '&orderPickUpCityId=' + cityId
        }
        if (locationId) {
            url = url + '&orderPickUpStoreId=' + locationId
        }
        if (grpId) {
            url = url + '&grpId=' + grpId
        }
        url = url + '&sumId=payment.price.total&dateField=pickup.created&paymentStatus=paid,refunded';

        return this.http.get(url)

    }

    setNewOrderStatus(orderIds, newStatus) {
        const url = this.configService.appConfig.appBaseUrl + `sok/orders/updatePickUpStatus/${newStatus}`;
        const payload = {
            orderIds: orderIds
        }
        return this.http.put(url, payload);
    }


    getTotalPayment(startDate, endDate, orderPickUpCityId, orderPickUpStoreId) {
        let url = this.configService.appConfig.appBaseUrl + 'orderToDelivery/analytics/totalAmount?orderSource=kiosk,iotzen-pos&paymentStatus=paid&dateField=pickup.created'
        if (startDate) {
            url = url + '&startDate=' + startDate
        }
        if (endDate) {
            url = url + '&endDate=' + endDate
        }
        if (orderPickUpCityId) {
            url = url + '&orderPickUpCityId=' + orderPickUpCityId
        }
        if (orderPickUpStoreId) {
            url = url + '&orderPickUpStoreId=' + orderPickUpStoreId
        }
        return this.http.get(url)
    }

    getKioskSettings() {
        let url = this.configService.appConfig.appBaseUrl + 'sok/settings/'
        return this.http.get(url)
    }

    getKioskSettingsByModuleType(moduleType) {
        let url = this.configService.appConfig.appBaseUrl + 'sok/settings/moduleType/'
        if (moduleType) {
            url = url + moduleType
        }
        return this.http.get(url)

    }


    putAndLinkTimeAndDaySlotsToSelectedProducts(payload: IStoreProductWindowAssignmentPayload, locationId: string) {
        let url = this.configService.appConfig.appBaseUrl + 'sok/stores/linkSlots/locationId/' + locationId
        return this.http.put(url, payload)
    }



    getKioskSettingsMetaData(groupType: string) {
        let url = this.configService.appConfig.appBaseUrl + 'account/settings/metaData/kiosk?groupType=' + groupType
        return this.http.get<IKisoskSettingsMetaData>(url)
    }

    getKioskSettingsMetaDataByGroups() {
        let url = this.configService.appConfig.appBaseUrl + `settings/module/kiosk/types`
        return this.http.get<IGroupsOfKioskSettingsWithModule>(url)
    }

    putKioskGenericSettings(payload: IKioskTableFormSettings, type: string) {
        let url = this.configService.appConfig.appBaseUrl + 'sok/settings/moduleType/' + type
        return this.http.put<IKioskTableFormSettings>(url, payload)
    }

    delinkDayAndTimeSlots(payload: IPayloadForDelinkingSlots, locationId: string) {
        let url = this.configService.appConfig.appBaseUrl + 'sok/stores/delinkSlots/locationId/' + locationId
        return this.http.put(url, payload)
    }

    getCategoriesByStore(locationId: string) {
        let url = this.configService.appConfig.appBaseUrl + `sok/stores/category/locationId/${locationId}?fI=category.name,category._id,metaInfo.slots,metaInfo.status,metaInfo.sequence,metaInfo.isActivated,category.description&isPopulate=true`
        return this.http.get(url)

    }

    putCategoryOrderSequence(locationId: string, assetType: string, payload: ICategorySequencePayloadStoreLevel) {
        let url = this.configService.appConfig.appBaseUrl + `sok/stores/sequence/locationId/${locationId}/assetType/${assetType}`
        return this.http.put(url, payload)
    }
    updateCategoryStatus(locationId: string, payload: IStoreCategoryUpdatePayload) {
        let url = this.configService.appConfig.appBaseUrl + `sok/stores/category/locationId/${locationId}`
        return this.http.put(url, payload)
    }


    getCategoriesAndProducts() {
        const URL =
            this.configService.appConfig.appBaseUrl + "maestro/categoryInfo/products";
        const headers = new HttpHeaders()
            .set("Authorization", localStorage.getItem("token"))
            .set("Content-Type", "application/json")
            .set("Accept", "*");

        const url = URL + "/?isPopulate=true&categoryFI=name,color,_id,sequence&productFI=_id,metaInfo.itemName,metaInfo.price,metaInfo.prices,metaInfo.outOfStockStatus,description,groups";
        return this.http.get(url, { headers });
    }

    getKioskOrderPageLayout() {
        let url = this.configService.appConfig.appBaseUrl + `settings/account/all/query/typeId:maestroLayout,module:kiosk?isMultiple=false`
        return this.http.get(url)
    }


    quantityCheck(cartItems: IProductData[], storeId: string) {
        let url =
            this.configService.appConfig.appBaseUrl + "sok/stores/quantityCheck";
        const body = {
            products: cartItems,
            storeId: storeId,
        };
        return this.http.post(url, body);
    }

    getProductGroups() {
        let url =
            this.configService.appConfig.appBaseUrl + "assetGroup/?skip=0&limit=10";
        return this.http.get(url);
    }

    effectsAddNewStoreLocation(payload) {
        let url = `${this.configService.appConfig.appBaseUrl}sok/stores/createStore`
        return this.http.post(url, payload);
    }

    effectGetAllPaymentGateways() {
        let url = this.configService.appConfig.appBaseUrl + 'payments/gateways/all'
        return this.http.get(url)
    }

    effectSendPaymentVerification(orderId) {
        let url = this.configService.appConfig.appBaseUrl + `payments/updateStatus/status/verified/orderId/${orderId}`;
        return this.http.put(url, {})
    }

    effectPrintRecieptOnSOk(orderId) {
        let url = this.configService.appConfig.appBaseUrl + `sok/orders/printReciept/orderId/${orderId}`;
        return this.http.post(url, {})
    }

    effectSendTransaction(payload, orderId: string): Observable<{ msg: string; status: boolean }> {
        let url = this.configService.appConfig.appBaseUrl + `sok/orders/uploadFile/orderId/${orderId}/fileType/image?eventType=paymentProof`
        const formData = new FormData();

        if (payload?.file) {
            let file = dataURLtoBlob(payload.file);
            formData.append('file', file, 'filename.png');
        }

        return this.http.put<{ msg: string, status: boolean }>(url, formData)
    }

    effectGetRazorpayData(type: string): Observable<RazorPay> {
        const url = this.configService.appConfig.appBaseUrl + `pluginManager/payment/type/` + type;
        return this.http.get<RazorPay>(url);
    }

    dynamicAPIfromMetaData(urlRes, method) {
        const url = this.configService.appConfig.appBaseUrl + urlRes
        if (method === "get") {
            return this.http.get(url)
        }
    }

    effectUpdateCategoryMetaInfo(locationId: string = '', payload?: ICategoryMetaInfoPayload) {
        let url = this.configService.appConfig.appBaseUrl + 'sok/stores/category/metaInfo/locationId/';
        if (locationId) {
            url = url + locationId
        }
        return this.http.put(url, payload)
    }

    submitTableOrder(tableId: string, prodData: { _id: string, quantity: number }[], orderDocId: string, subOrderId?: string, action = 'add') {
        const payLoad = {
            'products': {
                [action]: prodData
            },
            'tableId': tableId,
            'orderDocId': orderDocId
        }
        if (subOrderId) {
            payLoad['subOrderId'] = subOrderId
        }
        let url = this.configService.appConfig.appBaseUrl + 'maestro/table/order/'
        if (action === 'remove') {
            url += action
        }

        return this.http.post(url, payLoad);
    }

    getMaestroAreas() {
        let url = this.configService.appConfig.appBaseUrl + 'maestro/areas';
        return this.http.get(url);
    }

    getMaestroTableWithAreaId(areaId: string, status?: string) {
        let url = this.configService.appConfig.appBaseUrl + `maestro/tableInfo?isPopulate=true&areaId=${areaId}`;
        if (status) {
            url = url + '&status=' + status
        }
        return this.http.get(url);
    }

    switchTableOrder(payLoad) {
        let url = this.configService.appConfig.appBaseUrl + `maestro/switchTable`;
        return this.http.post(url, payLoad);
    }

    getMaestroInfo() {
        let url = this.configService.appConfig.appBaseUrl + `maestro/info`;
        return this.http.get(url);
    }

    getKAgentMetaData(module: string, typeId: string) {
        let url = this.configService.appConfig.appBaseUrl + `settings/all/query/module:${module},typeId:${typeId}`
        return this.http.get(url)
    }
    kAgentDynamicAPIFromMetadata(api: string, method: string, body?: unknown) {
        let url = this.configService.appConfig.appBaseUrl + api
        if (method == 'put') {
            return this.http.put(url, body)
        }
    }

    getAllAreasBasedOnStoreId(storeId: string) {
        let url = this.configService.appConfig.appBaseUrl + `sok/stores/areas/locationId/${storeId}`
        return this.http.get(url)
    }

    createTablesBasedOnStore(storeId: string, body) {
        let url = this.configService.appConfig.appBaseUrl + `sok/stores/tables/locationId/${storeId}`;
        return this.http.post(url, body)
    }

    getAllTableData(storeId) {
        let url = this.configService.appConfig.appBaseUrl + `sok/stores/tables/locationId/${storeId}?isPopulate=true&fI=_id,tableNo,aProperties.status,capacity,storeData.name,areaData.name,storeData._id,areaData._id,status`
        return this.http.get(url)
    }

    deleteTableData(tableId) {
        let url = this.configService.appConfig.appBaseUrl + `sok/stores/tables/tableId/${tableId}`;
        return this.http.delete(url)
    }

    updateTableData(tableId, obj) {
        let url = this.configService.appConfig.appBaseUrl + `sok/stores/tables/tableId/${tableId}`;
        return this.http.put(url, obj)
    }
    getAdditionalDineServices() {
        const FI = 'name,assetType'
        let url = this.configService.appConfig.appBaseUrl + 'maestro/otherServices?fI=' + FI;
        return this.http.get(url);
    }
    postPrintOrderReciept(orderId: string, body) {
        let url = this.configService.appConfig.appBaseUrl + `sok/orders/printReciept/orderId/${orderId}`;
        return this.http.post(url, body)
    }
}


export interface IStoreProductWindowAssignmentPayload {
    assetIds: string[]
    assetType: string
    days: string[]
    timeSlots: Slot[]
}

export interface Slot {
    start: Start
    end: End
}

export interface Start {
    h: number
    m: number
}

export interface End {
    h: number
    m: number
}


// categories table
export interface IKioskCategory {
    category: Category
    metaInfo?: MetaInfo
}

export interface Category {
    _id: string
    name: string
    description?: string
}

export interface MetaInfo {
    status?: boolean
    sequence?: number
}

export interface PosData {
    posId: string,
    posData: InnerPosData
    _id: string
}

export interface InnerPosData {
    canReceivePayment: boolean,
    area: string,
    isPrintable: boolean
}

export interface Image {
    baseUrl: string;
    imageBasePath: string;
}


export interface IProductData {
    metaInfo: {
        itemName: string;
        price: number;
        outOfStockStatus: boolean;
        categoryIds: string;
        groups?: string[];
    };
    productInfo: {
        _id: string;
        image: {
            baseUrl: string;
            imageBasePath: string;
        };
    };
    imageURL?: string;
    qty?: number;
    idx?: number;
}

export interface CategoryInfo {
    _id: string;
    name: string;
    sequence: number;
    image: {
        baseUrl: string;
        imageBasePath: string;
    };
}

export interface ICategoryData {
    _id: string;
    productsCount: number;
    products: IProductData[];
    categoryInfo: CategoryInfo;
    outOfStockStatus: boolean;
}

export interface IQuantityStatus {
    status: boolean | null;
    statusMsg?: string;
}

export interface IGroupData {
    _id: string;
    label: string;
    color: string;
    assetTypes: string[];
    sequence: number;
    accountId: string;
    updated: string;
    __v: number;
}


function dataURLtoBlob(dataURL: string): Blob {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}
