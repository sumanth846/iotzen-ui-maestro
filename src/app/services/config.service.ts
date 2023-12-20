import { Injectable } from '@angular/core';

import { environment } from '../config/environments/environment';
@Injectable()
export class ConfigService {

    public appConfig = {
        appBaseUrl: environment.server_url,
        loginBaseURL: environment.login_url,
        iotzenLogoUrl: environment.iotzen_logo_url,
        isMenuCollapse: environment.is_menu_collapse,
        isSubMenuCollapse: environment.is_sub_menu_collapse,
        dashboardUrl: environment.dashboard_url,
        serverAddress: environment.server_address,
        inspectionStatus: {
            SUCCESS: 'success', FAILURE: 'fail', STANDBY: 'standBy'
        },
        beaconGateway: {
            BEACON_GATEWAY_ASSET_NAME: 'beaconGateway'
        },
        rfidGateway: {
            RFID_GATEWAY_ASSET_NAME: 'rfidGateway'
        },
        services: {
            GENERAL_SERVICE: 'general'
        }
    };

    constructor() { }

}
