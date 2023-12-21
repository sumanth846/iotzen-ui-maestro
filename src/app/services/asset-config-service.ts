import { Injectable } from '@angular/core';
import { AssetService } from './asset.service';

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

}
