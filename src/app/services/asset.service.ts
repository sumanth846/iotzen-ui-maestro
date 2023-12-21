/**
 * Created by chandru on 29/6/18.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { keys, forEach } from 'lodash';

@Injectable({
  providedIn: "root"
})
export class AssetService {
  public isNewThingsAdded: Subject<any> = new BehaviorSubject<any>(false);
  assetMenuStatus: Subject<any> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, public configService: ConfigService) {
  }

  getAllAssetTypes() {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'assetConfig/types');
  }


  getImageDetails(aId: any, fCategory: any, type: any, subType: any, isCount: any) {
    const url = this.configService.appConfig.appBaseUrl + `asset/fileDetailsV2/${aId}/${isCount}?category=${fCategory}&subType=${subType}&fileType=${type}`;
    return this.http.get(url);
  }

  getImageByIdUrlForSrcTag(fId: any, subType: any) {
    const token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
    const url = this.configService.appConfig.appBaseUrl + `asset/fileV2/${fId}?subType=${subType}` + '&token=' + token;
    return url;
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

}


