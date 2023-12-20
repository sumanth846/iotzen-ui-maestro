/**
 * Created by chandru on 23/7/18.
 */
import { Injectable } from '@angular/core';
import { AssetService } from './asset.service';
import { find } from 'lodash';

@Injectable({
  providedIn: "root"
})
export class AssetConfigService {

    constructor(public assetService: AssetService) { }

    private _assetsConfig: any = [];
    getAssetsConfig(): any {
        return new Promise((resolve) => {
            if (this._assetsConfig.length === 0) {
                this.assetService.getAllAssetTypes()
                    .subscribe(assetsConfig => {
                        this.setAssetsConfig(assetsConfig);
                        resolve(this._assetsConfig);
                    });
            } else {
                resolve(this._assetsConfig);
            }
        });
    }
    setAssetsConfig(theAssetsConfig: any) {
        this._assetsConfig = theAssetsConfig;
    }

    uploadAssets(assetTypes, formData) {
        return this.assetService.uploadAsset(assetTypes, formData)
    }

    resetAssetsConfigValue() {
        this._assetsConfig = [];
    }



    returnAssetTypeLabel(type): string {
        let config: any;
        config = find(this._assetsConfig, function (o) { return o.type === type; });
        if (config && config.label) {
            return config.label;
        } else {
            return '';
        }
    }

}
