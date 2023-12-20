import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';

@Injectable({
  providedIn: "root"
})
export class AssetGroupService {
  constructor(private http: HttpClient, public configService: ConfigService) {
  }

  getGroupCount(searchText?: string, assetTypes?: string) {
    let queryUrl;
    queryUrl = this.configService.appConfig.appBaseUrl + 'assetGroup/count';
    if (assetTypes) {
      queryUrl = queryUrl + '?assetTypes=' + assetTypes;
    }
    if (searchText) {
      queryUrl = queryUrl + '&searchText=' + searchText;
    }
    return this.http.get(queryUrl);
  }

  getGroups(skip, limit, searchText?: string, assetTypes?: string) {
    let queryUrl;
    queryUrl = this.configService.appConfig.appBaseUrl + 'assetGroup/' + '?skip=' + skip + '&limit=' + limit;
    if (assetTypes) {
      queryUrl = queryUrl + '&assetTypes=' + assetTypes;
    }
    if (searchText) {
      queryUrl = queryUrl + '&searchText=' + searchText;
    }
    return this.http.get(queryUrl);
  }

  get() {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'assetGroup/');
  }

  update(obj) {
    return this.http.put(this.configService.appConfig.appBaseUrl + 'assetGroup/', obj);
  }

  save(obj) {
    return this.http.post(this.configService.appConfig.appBaseUrl + 'assetGroup/', obj);
  }

  add(obj, id) {
    return this.http.post(this.configService.appConfig.appBaseUrl + 'assetGroup/id/' + id, obj);
  }

  link(assetIdList, groupId) {
    let obj = {
      assets: assetIdList,
      groups: [groupId]
    };
    return this.http.post(this.configService.appConfig.appBaseUrl + 'assetGroup/linkToAsset', obj);
  }

  addAssetsToGroup(obj) {
    return this.http.post(this.configService.appConfig.appBaseUrl + 'assetGroup/add/assets', obj);
  }

  removeAssetsFromGroup(obj) {
    return this.http.post(this.configService.appConfig.appBaseUrl + 'assetGroup/remove/assets', obj);
  }

  getAddedAssetsCountForGroup(groupId) {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'assetGroup/assets/count/' + groupId);
  }

  getAddedAssetsForGroup(groupId, skip, limit) {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'assetGroup/assets/' + groupId + '?skip=' + skip + '&limit=' + limit);
  }

  getAddedGroupsForAsset(assetId) {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'asset/link/groups/' + assetId);
  }

  linkGroupsToAsset(obj) {
    return this.http.post(this.configService.appConfig.appBaseUrl + 'asset/link/groups/', obj);
  }

  delinkGroupsToAsset(obj) {
    return this.http.post(this.configService.appConfig.appBaseUrl + 'asset/deLink/groups/', obj);
  }

  deleteGroup(id) {
    return this.http.delete(this.configService.appConfig.appBaseUrl + 'assetGroup/id/' + id);
  }

  updateGroup(id, obj) {
    return this.http.put(this.configService.appConfig.appBaseUrl + 'assetGroup/id/' + id, obj);
  }

  getAssetGroupByType(assetType: any) {
    return this.http.get(this.configService.appConfig.appBaseUrl + 'assetGroup/?assetTypes=' + assetType)
  }
}
