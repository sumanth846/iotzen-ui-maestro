import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: "root"
})
export class AssetGroupService {
  constructor(private http: HttpClient, public configService: ConfigService) {
  }

  getAssetGroupByType(assetType: any) {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'assetGroup/?assetTypes=' + assetType)
  }
}
