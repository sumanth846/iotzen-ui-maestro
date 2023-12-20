/**
 * Created by chandru on 11/5/20.
 */
import pkg from '../../package.json';

export const CONSTANT = {
    SOCKET: {
        KIOSK: {
            NAMESPACE: {
                ORDER: '/orderToDelivery/order/kiosk',
            },
            TOPICS: {
                LIVE: 'live',
                LIVE_STATUS: 'live_status'
            }
        },
        POS: {
            NAMESPACE: {
                POSSTORE: '/iotzen/posStore/',
                POSSETIINGS: '/kiosk/account/',
                POSPAYMENT: '/iotzen/payment/pos/'
            },
            TOPICNAME: {
                POSSTORE: 'productUpdate',
                POSSETTINGS: 'settings',
                POSPAYMENT: 'paymentUpdate'
            },
            KEY: {
                POSSTORE: 'kiosk-order-pos-store',
                POSSETTINGS: 'kiosk-order-pos-setting',
                POSPAYMENT: 'kiosk-order-pos-payment'
            }
        }
    },
    TABLE_SESSION_NAME: {
        KIOSK: {
            ORDER: 'kiosk_order_tab',
            TODAY: 'kiosk_today_order_tab',
            CDS: 'kiosk_cds_tab',
            KDS: 'kiosk_kds_tab',
            PRODUCT: 'kiosk_product_management'
        },
    },
    MODULES: {
        KIOSK: {
            MODULE: 'kiosk'
        }
    },
    TIMEINTERVALS: {
        OFFLINEINMIN: 3
    },

    // SENTRY_KEY: 'https://2d9c47fa38254b948e35f0615b842e62@o219463.ingest.sentry.io/1363394'
    SENTRY_KEY: 'https://568f9257460747fa9eee1ce21d91f927@o1302573.ingest.sentry.io/6549681',

    KIOSK: {
        STORE_lOCATION: 'KIOSK_STORE_LOCATION',
        REQUIRED_ORDER_FIELDS: {
            TABLE: 'orderId,created,customerDetails.firstName,customerDetails.lastName,customerDetails.location,customerDetails.firstName,customerDetails.mobileNumber,expectedDeliveryDateTime,expectedDeliveryDateTimeDetails,orderDetails.items.name,orderDetails.items.quantity,orderDetails.items.instruction,billAddress.phone,shippingAddress.phone,accountId,pickUpLocation.name,pickUpLocation.city,pickUpCity.city,logisticProvider.name,orderSource,ordertype,delivery,orderStatus,isAddedToQueue,orderCancelled,payment,paymentGateway,pickup',
        }
    },
    VERSION: pkg.version,
    SENTRY_AUTH_TOKEN: 'aa592018818548b2837a832f1df793f1f1f69a196f3a49f0849a813f2fd00dd2'

};
