/**
 * Created by chandru on 29/6/18.
 */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {BehaviorSubject, Subject, of} from 'rxjs';
import {keys, forEach} from 'lodash';
import {GeoFenceObject} from '../interface/maestro-interface';

@Injectable({
  providedIn: "root"
})
export class AssetService {
  public isNewThingsAdded: Subject<any> = new BehaviorSubject<any>(false);
  assetMenuStatus: Subject<any> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, public configService: ConfigService) {
  }

  getAssetCount() {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'asset/countByType');
  }

  getAssetPaginationCount() {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'asset/count');
  }

  getSearchedAssetPaginationCount(searchText, selectedAssetTypes) {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'assets/search/count/' + searchText + '?type=' + selectedAssetTypes);
  }

  getAssetConfig(assetName) {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'assetConfig?type=' + assetName);
  }

  getAllAssetTypes() {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'assetConfig/types');
  }

  getAssetImgUrl(type) {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'assetConfig/image/' + type);
  }

  saveAssetDetails(assetData) {
    return this.http.post(this.configService.appConfig.appBaseUrl + 'asset', assetData);
  }

  getAssetDetailsByMongodbId(assetId) {
    if (!assetId) {
      return of({})
    }
    return this.http.get(this.configService.appConfig.appBaseUrl + 'asset/' + assetId);
  }

  getAssetsDetailsByIds(assetIds: string, fI?, isLinkedReq?) {
    let queryUrl = (this.configService.appConfig.appBaseUrl + 'asset?ids=' + assetIds);
    if (fI) {
      queryUrl = queryUrl + '&fI=' + fI;
    }
    if (isLinkedReq) {
      queryUrl = queryUrl + '&isLinkedReq=' + isLinkedReq;
    }
    return this.http.get(queryUrl);
  }

  updateAssetsById(assetId, assetDetails) {
    return this.http.put(this.configService.appConfig.appBaseUrl + 'asset/' + assetId, assetDetails);
  }

  searchForAssetFromassetType(searchForAsset, assetTypeForSearch, skip, limit) {
    let queryUrl = this.configService.appConfig.appBaseUrl + 'assets/search/';
    if (searchForAsset && assetTypeForSearch) {
      queryUrl = queryUrl + searchForAsset + '?type=' + assetTypeForSearch + '&skip=' + skip + '&limit=' + limit;
    } else if (searchForAsset) {
      queryUrl = queryUrl + searchForAsset + '?type=' + '&skip=' + skip + '&limit=' + limit;
    }
    return this.http.get(queryUrl);
  }

  delinkAsset(delinkAssetDetails) {
    return this.http.post(this.configService.appConfig.appBaseUrl + 'assets/deLink', delinkAssetDetails);
  }

  linkAsset(linkAssetDetails) {
    return this.http.post(this.configService.appConfig.appBaseUrl + 'assets/link', linkAssetDetails);
  }

  getAssetsBasedOnRange(skip, limit) {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'asset?skip=' + skip + '&limit=' + limit);
  }

  saveMultipleAssetDetails(assetArrayData) {
    return this.http.post(this.configService.appConfig.appBaseUrl + 'asset/multiple', assetArrayData);
  }

  getAllByType(assetTypes, skip, limit, groups?, fI?, fE?) {
    let url = this.configService.appConfig.appBaseUrl + 'asset?skip=' + skip + '&limit=' + limit;
    if (assetTypes) {
      url = url + '&type=' + assetTypes;
    }
    if (groups) {
      url = url + '&groups=' + groups;
    }
    if (fI) {
      url = url + '&fI=' + fI;
    }
    if (fE) {
      url = url + '&fE=' + fE;
    }
    return this.http.get(url);
  }

  getAssetOnSearch(searchText, selectedAssetTypes, skip, limit) {
    const url = this.configService.appConfig.appBaseUrl + 'assets/search/' + searchText + '?type=' + selectedAssetTypes + '&skip=' + skip + '&limit=' + limit;
    return this.http.get(url);
  }

  getCountByTypes(assetTypes, groups?) {
    let url = this.configService.appConfig.appBaseUrl + 'asset/count?type=' + assetTypes;
    if (groups) {
      url = url + '&groups=' + groups;
    }
    return this.http.get(url);
  }

  deregisterAsset(assetId) {
    return this.http.delete(this.configService.appConfig.appBaseUrl + 'asset/' + assetId);
  }

  getAssetGroups() {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'assetGroup');
  }

  getLinkedAssets(assetId) {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'asset/linkedAssets/' + assetId);
  }

  getServerAnalytics(startTime, endTime, assetId, field?) {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'asset/historical/stats/' + startTime + '/' + endTime + '/' + assetId + '?fields=' + field);
  }

  getAllCarLinkedToObd(assetsTracked?) {
    let url = this.configService.appConfig.appBaseUrl + 'asset/obdDevice/carsLinked/';
    if (assetsTracked) {
      url = url + '?assetsTracked=' + assetsTracked;
    }
    return this.http.get(url);
  }

  getThumbnailImage(id) {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'asset/files/' + id + '/thumbnail', {responseType: 'blob'});
  }

  getProfilePhoto(id) {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'asset/files/' + id + '/profilePhoto', {responseType: 'blob'});
  }

  getThingsType() {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'assetConfig/types/metaData');
  }

  getRegisteredProfilePhoto(id) {
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    return this.configService.appConfig.appBaseUrl + 'asset/files/' + id + '/profilePhoto' + '?token=' + token;
  }

  getRegisteredFaceThumbnail(id) {
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    return this.configService.appConfig.appBaseUrl + 'asset/files/' + id + '/thumbnail' + '?token=' + token;
  }

  getCameraLiveStream() {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'liveStream/sample');
  }

  sendShowAssetMenuValue(status) {
    this.assetMenuStatus.next(status);
  }

  sendNewThingsAddedStatus(status) {
    this.isNewThingsAdded.next(status);
  }

  getAssetQrCode(id) {
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    return this.configService.appConfig.appBaseUrl + 'assetQrCode/asset/' + id + '?token=' + token;
  }

  registerDetectedFaceImage(assetId, faceDetecedId) {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'faceDetection/register/image/' + faceDetecedId + '/' + assetId);
  }

  getDeliveryImageById(id) {
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    return this.configService.appConfig.appBaseUrl + 'deliveryManagement/management/deliveryImages/' + id + '?token=' + token;
  }

  getAssetLinkedByAssetType(baseAssetIds, assetTypeLinked, isCount?, skip?, limit?) {
    let url = (this.configService.appConfig.appBaseUrl + 'asset/linkedAssets/' + baseAssetIds + '/' + assetTypeLinked);
    if (isCount) {
      url = url + '?isCount=' + isCount;
    }
    if (skip || skip == 0) {
      url = url + '?skip=' + skip;
    }
    if (limit) {
      url = url + '&limit=' + limit;
    }
    return this.http.get(url);
  }

  getAssetConfigForOrder() {
    const orderConfig = {
      '_id': '61c190268ae29ba96872ec0c',
      'assetType': {
        'typeId': 'order',
        'type': 'order',
        'label': 'child-collecton.assetconfigurations.assetType-label-order',
        'theme': {
          'color': {
            'primary': '#d09800',
            'secondary': '#d0cc53'
          }
        },
        'config': {
          'assetsLinkable': [],
          'isServiceLinkable': false,
          'isBulkUpload': true,
          'showStats': false,
          'isDiscoverable': false
        },
        'order': 16
      },
      'configuration': {
        'orderId': {
          'field': 'orderId',
          'type': 'text',
          'description': 'orderId',
          'label': 'Order Id',
          'required': false,
          'autoComplete': false,
          'showInCard': true,
          'isTitle': true
        },
        'firstName': {
          'field': 'firstName',
          'type': 'text',
          'description': 'First name',
          'label': 'child-collecton.assetconfigurations.assetType-label-name',
          'required': false,
          'autoComplete': false,
          'showInCard': true
        },
        'customerMobile': {
          'field': 'customerMobile',
          'type': 'number',
          'description': 'Cust mobile number',
          'label': 'child-collecton.assetconfigurations.label-customer-mobile-number',
          'required': false,
          'autoComplete': false,
          'showInCard': true
        },
        'city': {
          'field': 'city',
          'type': 'text',
          'description': 'city',
          'label': 'child-collecton.assetconfigurations.label-city',
          'required': false,
          'autoComplete': false,
          'showInCard': true
        },
        'pincode': {
          'field': 'pincode',
          'type': 'number',
          'description': 'pincode',
          'label': 'child-collecton.assetconfigurations.label-pincode',
          'required': false,
          'autoComplete': false,
          'showInCard': true
        },
        'expectedDeliveryDate': {
          'field': 'expectedDeliveryDate',
          'type': 'text',
          'description': 'expectedDeliveryDate',
          'label': 'child-collecton.assetconfigurations.label-expectedDeliveryDate',
          'required': false,
          'autoComplete': false,
          'showInCard': true
        },
        'expectedDeliveryTime': {
          'field': 'expectedDeliveryTime',
          'type': 'text',
          'description': 'expectedDeliveryTime',
          'label': 'child-collecton.assetconfigurations.label-expectedDeliveryTime',
          'required': false,
          'autoComplete': false,
          'showInCard': true
        }
      },
    };

    return orderConfig;
  }

  getAssetConfigForConsignment() {
    const consignmentConfig = {
      '_id': '61c190268ae29ba96872ec0',
      'assetType': {
        'typeId': 'order',
        'type': 'order',
        'label': 'child-collecton.assetconfigurations.assetType-label-order',
        'theme': {
          'color': {
            'primary': '#d09800',
            'secondary': '#d0cc53'
          }
        },
        'config': {
          'assetsLinkable': [],
          'isServiceLinkable': false,
          'isBulkUpload': true,
          'showStats': false,
          'isDiscoverable': false
        },
        'order': 16
      },
      'configuration': {
        'orderId': {
          'field': 'orderId',
          'type': 'text',
          'description': 'ID',
          'label': 'ID',
          'required': false,
          'autoComplete': false,
          'showInCard': true,
          'isTitle': true
        },
        'pickupCity': {
          'field': 'pickupCity',
          'type': 'text',
          'description': 'Pickup city',
          'label': 'Pickup City',
          'required': false,
          'autoComplete': false,
          'showInCard': true
        },
        'pickupLocation': {
          'field': 'pickupLocation',
          'type': 'text',
          'description': 'Pickup location',
          'label': 'Pickup Location',
          'required': false,
          'autoComplete': false,
          'showInCard': true
        },
        'deliveryCenterName': {
          'field': 'deliveryCenterName',
          'type': 'text',
          'description': 'Delivery Center',
          'label': 'Delivery Center',
          'required': false,
          'autoComplete': false,
          'showInCard': true
        },
        'expectedDeliveryDate': {
          'field': 'expectedDeliveryDate',
          'type': 'text',
          'description': 'expectedDeliveryDate',
          'label': 'child-collecton.assetconfigurations.label-expectedDeliveryDate',
          'required': false,
          'autoComplete': false,
          'showInCard': true
        },
      },
    };

    return consignmentConfig;
  }

  getFileDetails(assetId: any, isCount: any, category: any = 'file', isInventory = false) {
    if (category == 'qrcode') {
      return this.http.get(this.configService.appConfig.appBaseUrl + `smartAsset/getQr/assetId/${assetId}?isInventory=${isInventory}`)

    } else {
      return this.http.get(this.configService.appConfig.appBaseUrl + `asset/fileDetailsV2/${assetId}/${isCount}?category=${category}`);
    }
  }

  //  getAttachedImage(){
  //     return this.http.get(this.configService.appConfig.appBaseUrl + `asset/fileDetailsV2/${assetId}/${isCount}?category=${category}`);

  //     asset/v2/file/:fileId
  //  }

  getAssetType(assetType: any) {
    return this.http.get(this.configService.appConfig.appBaseUrl + `assetConfig/types?assetType=${assetType}`);
  }

  sendAssetByAssetName(fileType: any, payload, assetId) {
    return this.http.post(this.configService.appConfig.appBaseUrl + `asset/filesV2/${assetId}/${fileType}`, {file: payload});
  }

  deleteAsset(assetId) {
    return this.http.delete(this.configService.appConfig.appBaseUrl + `asset/fileV2/${assetId}`);
  }

  getImageByIdSubType(assetId, subType) {
    const url = this.configService.appConfig.appBaseUrl + `asset/fileV2/${assetId}?subType=${subType}`;
    return url;

  }


  // get all imageDetail

  getImageDetails(aId: any, fCategory: any, type: any, subType: any, isCount: any) {
    const url = this.configService.appConfig.appBaseUrl + `asset/fileDetailsV2/${aId}/${isCount}?category=${fCategory}&subType=${subType}&fileType=${type}`;
    return this.http.get(url);
  }

  getImageByIdUrlForSrcTag(fId: any, subType: any) {
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    const url = this.configService.appConfig.appBaseUrl + `asset/fileV2/${fId}?subType=${subType}` + '&token=' + token;
    return url;
  }

  getOnCardImageUrl(aId: string, fData: any) {
    const token = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
      if (fData) {
        const kFdata = keys(fData);

        forEach(kFdata, k => {
          const status = fData[k]?.showOnCard?.show;
          if (status) {
            const url = this.configService.appConfig.appBaseUrl + `asset/displayImageByAssetId/` + aId + `?url=false&token=${token}&date=${new Date().getTime()}`;
            resolve(url);
            const iData = fData[k];
            const iType = iData.type;
            const subType = iData['showOnCard']['subType'];
            this.getImageUrl(aId, iType, subType).then(url => {
              resolve(url);
            }).catch(err => {
              reject(err);
            });
          }
        });
      }
    });
  }

  getImageUrl(aId: any, iType: any, iSubType: any) {
    return new Promise((resolve, reject) => {
      const that = this;
      if (aId && iType && iSubType) {
        this.getImageDetails(aId, 'image', iType, iSubType, true)
          .subscribe((res) => {
            if (res && res['count']) {

              this.getImageDetails(aId, 'image', iType, iSubType, false)
                .subscribe((imageDetails) => {
                  const fId = imageDetails && imageDetails[0] && imageDetails[0]['_id'];
                  if (fId) {
                    const url = that.getImageByIdUrlForSrcTag(fId, iSubType);
                    resolve(url);
                  } else {

                    reject();
                    // this.setDefaultUrl()
                  }
                });
            } else {

              reject();
              // this.setDefaultUrl()
            }
          });
      } else {
        reject();
      }
    });

  }

  getDefaultUrl(assetType: any) {
    const url = this.configService.appConfig.appBaseUrl + `assetConfig/image/${assetType}`;
    return this.http.get(url);

  }

  geoEncodedAssetLocation(assetId: any) {
    const url = this.configService.appConfig.appBaseUrl + 'asset/geoencodedLocation/' + assetId;
    return this.http.get(url);
  }

  checkAssetShowTrue(assetId) {
    const url = this.configService.appConfig.appBaseUrl + 'asset/isShowOnCardAvailable/' + assetId;
    return this.http.get(url);
  }

  getTrackIconsByModuleType(moduleType, assetType?) {
    let url = this.configService.appConfig.appBaseUrl + 'deliveryManagement/settings/trackIcons/' + moduleType;
    if (assetType) {
      url = url + '?assetType=' + assetType;
    }
    return this.http.get(url);
  }

  getAllTrackableDeviceByModuleType(moduleType, isCount, fInclude?, fExclude?) {
    let url = this.configService.appConfig.appBaseUrl + 'asset/trackableDevice/' + moduleType;
    url = url + '?isCount=' + isCount;
    if (fInclude) {
      url = url + '&fI=' + fInclude;
    }
    if (fExclude) {
      url = url + '&fE=' + fExclude;
    }
    return this.http.get(url);
  }

  getAssetByAccountId(accountId, assetType, skip, limit) {
    let url = this.configService.appConfig.appBaseUrl + 'asset/accountId/' + accountId + '/assetType/' + assetType;
    url = url + '?skip=' + skip;
    url = url + '?limit=' + limit;
    return this.http.get(url);
  }

  replaceLinkedAsset(baseAssetId, assetToBeLinked) {
    let url = this.configService.appConfig.appBaseUrl + 'asset/replaceLinkedAsset/baseAsset/' + baseAssetId + '/assetToBeLinked/' + assetToBeLinked;
    return this.http.put(url, null);
  }


  updateLocationbyId(assetId, assetDetails) {
    return this.http.put(this.configService.appConfig.appBaseUrl + 'asset/location/assetId/' + assetId, assetDetails);
  }

  updateGeoFenceRadius(assetId: string, payLoad) {
    let queryUrl = this.configService.appConfig.appBaseUrl + 'asset/location/assetId/' + assetId;
    return this.http.put(queryUrl, payLoad);
  }

  geoFenceByAssetId(assetId: string) {
    let queryUrl = this.configService.appConfig.appBaseUrl + 'geoFence/assetId/' + assetId;
    return this.http.get<GeoFenceObject>(queryUrl);
  }

  uploadAsset(selectedAssetType: string, formData: FormData) {
    const url = this.configService.appConfig.appBaseUrl + 'assetBulkUpload?type=' + selectedAssetType;
    return this.http.post(url, formData);
  }

}


