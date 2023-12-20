const api_host = 'demo.iotzen.app';
const api_port = '443';
const api_protocol = 'https://';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const p = require('../../package.json');
export const environment = {
    production: false,
    ws_url: `${api_protocol}${api_host}:${api_port}/`,
    server_url: `${api_protocol}${api_host}:${api_port}/api/`,
    login_url: `${api_protocol}${api_host}:${api_port}`,
    dashboard_url: `${api_protocol}${api_host}`,
    server_address: `${api_protocol}${api_host}`,
    iotzen_logo_url: 'assets/iot_zen_logo.png',
    dtc_logo_small_url: 'assets/dtcLogo.png',
    dtc_logo_large_url: 'assets/dtc_logo_Dark.png',
    is_menu_collapse: false,
    is_sub_menu_collapse: true,
    errorTracker: {
        "sentry": {
            "enabled": false,
            "dsn": "https://568f9257460747fa9eee1ce21d91f927@o1302573.ingest.sentry.io/6549681",
            "env": "development",
            // "version": p.version,
            // "name": p.name
        }
    }
};
