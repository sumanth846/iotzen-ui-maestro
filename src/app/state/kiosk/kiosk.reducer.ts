import { createReducer, on } from "@ngrx/store";
import {
    KioskStore, IDeliveryCenterAsset, AvailableKiosks, GatewayList, IGroupsOfKioskSettingsWithModuleSettings, IKioskMetaDataSettingWithGroup, IKisoskSettingsMetaData, KAgent, KioskSettings, RazorPay, RazorPayConfig, Response,
    ICategoryData, IKioskCategory, IProductData, IGroupData, IQuantityStatus, PosData, ILocation
} from "src/app/interface/maestro-interface";
import { KioskActions } from ".";
import { cloneDeep, forEach, map, findIndex } from "lodash";
import * as _ from "lodash";
import { Message } from "primeng/api";
import { decrementQtyViaProduct, extractProductDataFromCategory, getKAgentWithOnlineStatus, incrementQtyViaProduct, removeCartItem, setAvaialableProducts, updateCartValue, updateKAgentStatusAfterSocketPush } from './kiosk.reducer.helper'
import { Account } from "src/app/interface/maestro-interface";



export interface KioskState {
    status: string,
    error: any,
    currentBranch: KioskStore | IDeliveryCenterAsset | ILocation,
    branchList: KioskStore[],
    productsCount: any,
    unlinkedProductCount: any
    productList: any,
    unlinkedProductList: any,
    allProducts: any,
    allProductsCount: any,
    allOrders: any
    productLinkResponseMsg: any,
    productLinkResponseType: any
    productGroupResponseMsg: any
    assetLinkSuccess: any,
    productRemovedresponse: any,
    delinkGroupResponse: any,
    categoryList: any,
    groupList: any,
    assetConfig: any,
    modifyFlag: any,
    delinkGroupErrResponse: any,
    assetLinkMetaFailureResponse: any,
    kioskSettings: KioskSettings,
    kioskSettingsMetaData: IKioskMetaDataSettingWithGroup
    kioskSettingsUpdatedResponse: Response,
    genericSettingUpdateLoader: boolean
    genericSettingsByGroupLoader: boolean
    allGroupsNamesSetttingForKiosk: IGroupsOfKioskSettingsWithModuleSettings[]
    kioskStoreUpdated: {
        updated: boolean
    }
    categoryTableData: IKioskCategory[]
    catergoryReorderedKiosk: Message

    availableCategories: ICategoryData[]
    availableProducts: IProductData[]
    cartItems: IProductData[]
    productGroups: IGroupData[]
    quantityStatus: IQuantityStatus
    cartLen: number
    itemQty: Map<string, { qty: number; idx: number }>,

    addStoreSidebarBoolean: boolean
    payamentGatewayList: GatewayList[]
    verificationProcess: {
        processingDone: boolean,
        status: string,
        data?: unknown
    },
    razorpayData: RazorPay,
    razorpayConfig: RazorPayConfig,
    kAgents: KAgent,
    kioskData: AvailableKiosks,
    kAgentLoader: boolean,
    kAgentMetadata: IKisoskSettingsMetaData,
    maestroAreas: any,
    kitchenSentData: any,
    maestroData: PosData,
}



export const initialState: KioskState = {
    status: 'Pending',
    error: null,
    currentBranch: null,
    branchList: null,
    productsCount: null,
    unlinkedProductCount: null,
    productList: null,
    unlinkedProductList: [],
    allProducts: null,
    allProductsCount: null,
    allOrders: null,
    productLinkResponseMsg: null,
    productLinkResponseType: null,
    productGroupResponseMsg: null,
    assetLinkSuccess: null,
    productRemovedresponse: null,
    delinkGroupResponse: null,
    categoryList: null,
    groupList: null,
    assetConfig: null,
    modifyFlag: null,
    delinkGroupErrResponse: null,
    assetLinkMetaFailureResponse: null,
    kioskSettings: null,
    kioskSettingsMetaData: null,
    kioskSettingsUpdatedResponse: null,
    genericSettingUpdateLoader: false,
    genericSettingsByGroupLoader: false,
    allGroupsNamesSetttingForKiosk: null,
    kioskStoreUpdated: {
        updated: null
    }
    , categoryTableData: []
    , catergoryReorderedKiosk: {},
    addStoreSidebarBoolean: false,
    payamentGatewayList: [],



    availableCategories: [],
    availableProducts: [],
    cartItems: [],
    productGroups: [],
    quantityStatus: { status: null, statusMsg: '' },
    cartLen: 0,
    itemQty: new Map<string, { qty: number; idx: number }>(),
    verificationProcess: {
        processingDone: false,
        status: '',
        data: null
    },
    razorpayData: null,
    razorpayConfig: {
        key: "",
        name: "",
        description: "True couverture chocolates",
        image: "",
        amount: "5000",
        currency: "INR",
        order_id: "order_JZMufGF8DhHO9Y",
        handler: new Function(),
        modal: {
            backdropclose: true,
            ondismiss: new Function(),
            animation: true,
        },
        notes: {
            orderId: "",
            payment_id: "",
            accountId: "",
            orderDocId: "",
            customerId: "",
            linkedAccount: "",
            env: ""
        },
        theme: {
            color: ''
        },
    },
    kAgents: null,
    kioskData: null,
    kAgentLoader: false,
    kAgentMetadata: null,
    maestroAreas: null,
    kitchenSentData: null,
    maestroData: null

}

export const KioskReducer = createReducer(
    initialState,
    on(KioskActions.loadBranchListSuccess, (state, { branchList }) => {
        return {
            ...state,
            status: "Success",
            error: "",
            branchList: branchList,
        };
    }),
    on(KioskActions.loadBranchListFailure, (state, error) => {
        return {
            ...state,
            error: error.err,
            status: "Error",
        };
    }),
    on(KioskActions.currentBranch, (state, { currentBranch }) => {
        return {
            ...state,
            currentBranch: currentBranch,
        };
    }),
    on(
        KioskActions.loadProductCountByStoreSuccess,
        (state, { productCountByStore }) => {
            return {
                ...state,
                productsCount: productCountByStore,
            };
        }
    ),
    on(
        KioskActions.loadUnlinkedProductCountByStoreSuccess,
        (state, { unlinkedProductCountByStore }) => {
            return {
                ...state,
                unlinkedProductCount: unlinkedProductCountByStore,
            };
        }
    ),
    on(KioskActions.loadProductCountByStoreFailure, (state, error) => {
        return {
            ...state,
            error: error.err,
        };
    }),
    on(
        KioskActions.loadProductListByStoreSuccess,
        (state, { productListByStore }) => {
            let productList: any[] = [];
            state.assetConfig;

            productList = modifyStoreProductList(cloneDeep(productListByStore));
            /* map(productListByStore, (product)=>{
                  let tempObj: Record<any, any> = cloneDeep(product['product'])
                  if(tempObj){
                      tempObj['toggle'] =  (()=>{
                          if(product['metaInfo'] && product['metaInfo']['status'] && product['metaInfo']['status'] === true){
                              return true
                          }else
                          {
                              return false
                          }
                      })()
                  }
      
                  if(product.metaInfo) {
                      if(product.metaInfo.quantity) {
                          tempObj['quantity'] = product.metaInfo.quantity;
                      } else if(product.metaInfo.quantity == 0) {
                          tempObj['quantity'] = 0;
                      }
                  }
                  tempObj['linkId'] = product['_id']
                  tempObj['groupsLinked'] = product['groups']
                  tempObj['images'] = product['images']
      
                  tempObj['itemName'] = (product['metaInfo'] && product['metaInfo']['itemName']) ? product['metaInfo']['itemName'] : tempObj['itemName']
                  tempObj['productPrice'] = tempObj['price']
                  tempObj['storePrice'] = (product['metaInfo'] && product['metaInfo']['price']) ? product['metaInfo']['price'] : tempObj['price']
                  productList.push(tempObj);
              }) */

            return {
                ...state,
                productList: productList,
            };
        }
    ),
    on(
        KioskActions.loadUnlinkedProductListByStoreSuccess,
        (state, { unlinkedProductListByStore }) => {
            let unlinkedProd = map(unlinkedProductListByStore, (product) => {
                return product;
            });
            return {
                ...state,
                unlinkedProductList: unlinkedProd,
            };
        }
    ),

    on(KioskActions.loadProductListByStoreFailure, (state, error) => {
        return {
            ...state,
            error: error.err,
        };
    }),
    on(
        KioskActions.loadUnlinkedProductListByStoreFailure,
        (state, error: any) => {
            return {
                ...state,
                error: error.err,
            };
        }
    ),
    on(KioskActions.loadProductListSuccess, (state, { allProducts }) => {
        return {
            ...state,
            allProducts: allProducts,
        };
    }),
    on(KioskActions.loadProductListFailure, (state, error) => {
        return {
            ...state,
            error: error.err,
        };
    }),
    on(KioskActions.loadProductsCountSuccess, (state, { allProductsCount }) => {
        return {
            ...state,
            allProductsCount: allProductsCount,
        };
    }),
    on(KioskActions.loadProductsCountFailure, (state, error: any) => {
        return {
            ...state,
            error: error.err,
        };
    }),
    on(KioskActions.loadOrderListSuccess, (state, { allOrders }) => {
        return {
            ...state,
            allOrders: allOrders,
        };
    }),
    on(KioskActions.loadOrderListFailure, (state, error) => {
        return {
            ...state,
            error: error.err,
        };
    }),
    on(KioskActions.reset, (state) => {
        return {
            ...state,
            status: "Pending",
            error: null,
            currentBranch: null,
            branchList: null,
            productsCount: null,
            productList: null,
            allProducts: null,
            allOrders: null,
            unlinkedProductCount: null,
            unlinkedProductList: null,
            productLinkResponseMsg: null,
            productLinkResponseType: null,
            productGroupResponseMsg: null,
            assetLinkSuccess: null,
            productRemovedresponse: null,
            delinkGroupResponse: null,
            categoryList: null,
            groupList: null,
            assetConfig: null,
            modifyFlag: null,
            delinkGroupErrResponse: null,
            assetLinkMetaFailureResponse: null,
            kioskSettings: null,
            kioskSettingsUpdatedResponse: null,
        };
    }),

    on(
        KioskActions.sendProductIdsTolinkToStoreSuccess,
        (state, { responseMsg, responseType }) => {
            return {
                ...state,
                productLinkResponseMsg: responseMsg,
                productLinkResponseType: responseType,
            };
        }
    ),
    on(
        KioskActions.sendProductIdsTolinkToStoreFailure,
        (state, { error }) => {
            return {
                ...state,
                productLinkResponseMsg: error?.er,
                productLinkResponseType: 'error',
            };
        }
    ),
    on(
        KioskActions.resetProductLinkResponseType,
        (state) => {
            return {
                ...state,
                productLinkResponseType: null,
            };
        }
    ),

    on(KioskActions.sendProudGroupAddedSuccess, (state, { responseMsg }) => {
        return {
            ...state,
            productGroupResponseMsg: responseMsg,
        };
    }),

    on(KioskActions.assetLinkMetaSuccess, (state, { response }) => {
        return {
            ...state,
            assetLinkSuccess: response,
        };
    }),

    on(
        KioskActions.productRemovedByLinkIdSuccess,
        (state, { response, assetLinkId }) => {
            return {
                ...state,
                productList: state.productList.filter((prod) => {
                    let bool = true;
                    forEach(assetLinkId, (aId) => {
                        if (prod["linkId"] == aId) {
                            bool = false;
                        }
                    });
                    return bool;
                }),
                productRemovedresponse: response,
            };
        }
    ),
    on(KioskActions.removeGroupSuccess, (state, { response }) => {
        return {
            ...state,
            delinkGroupResponse: response,
        };
    }),
    on(KioskActions.getCategoryListSuccess, (state, { response }) => {
        return {
            ...state,
            categoryList: response,
        };
    }),
    on(KioskActions.getGroupListSuccess, (state, { response }) => {
        return {
            ...state,
            groupList: response,
        };
    }),
    on(KioskActions.getConfigSuccess, (state, { config }) => {
        return {
            ...state,
            assetConfig: config,
        };
    }),
    on(KioskActions.modifyProductListFlag, (state, { flag }) => {
        return {
            ...state,
            modifyFlag: flag,
        };
    }),
    on(
        KioskActions.getImageUrlForProductSuccess,
        (state) => {
            return {
                ...state,
                // productList: state.productList
            };
        }
    ),
    on(KioskActions.updateProductList, (state, { listToAdd }) => {
        return {
            ...state,
            productList: addItemToList(listToAdd, state.productList),
        };
    }),
    on(KioskActions.assetLinkMetaFailure, (state, { error }) => {
        const productList = state.productList || []
        return {
            ...state,
            productList: [...productList],
            assetLinkMetaFailureResponse: error["msg"]
                ? error["msg"]
                : "Something went wrong, check you internet connection",
        };
    }),
    on(KioskActions.removeGroupFailure, (state, { error }) => {
        return {
            ...state,
            productList: [...state.productList],
            delinkGroupErrResponse: error["msg"]
                ? error["msg"]
                : "Something went wrong, check you internet connection",
        };
    }),

    on(KioskActions.getProductMetaInfoByLinkIdSuccess, (state, { response }) => {
        let productList: any[] = [];
        // state.assetConfig

        //  productList = modifyProduct((clone(state.productList), {response}));
        productList = modifyProduct(cloneDeep(state.productList), response);

        return {
            ...state,
            productList: productList,
        };
    }),

    on(KioskActions.resetSelectedBranch, (state) => {
        return {
            ...state,
            currentBranch: null,
        };
    }),

    on(KioskActions.getKioskSettingsSuccess, (state, { response }) => {
        if (response) {
            if (response?.slots?.window) {
                const ans = [...response?.slots?.window];
                ans.sort((a, b) => {
                    return a.start.h - b.start.h;
                });

                const obj = {
                    ...response,
                    slots: {
                        ...response.slots,
                        window: ans,
                    },
                };
                return {
                    ...state,
                    kioskSettings: { ...state.kioskSettings, ...obj },
                };
            } else {
                return {
                    ...state,
                    kioskSettings: { ...state.kioskSettings, ...response },
                };
            }
        } else {
            return {
                ...state,
            };
        }
    }),

    on(KioskActions.getKioskSettingsFailure, (state, error) => {
        return {
            ...state,
            error: error,
        };
    }),



    on(KioskActions.getCategoryListFailure, (state, { error }) => {
        return {
            ...state,
            error: error,
        };
    }),


    on(KioskActions.categoryReorderState, (state, { reordered }) => {
        return {
            ...state,
            catergoryReordered: reordered,
        };
    }),

    on(
        KioskActions.putAndLinkTimeAndDaySlotsToSelectedProductsSuccess,
        (state) => {
            return {
                ...state,
                kioskStoreUpdated: { updated: true },
            };
        }
    ),
    on(
        KioskActions.removeTimeSlotsToSelectedProductsSuccess,
        (state) => {
            return {
                ...state,
                kioskStoreUpdated: { updated: true },
            };
        }
    ),

    on(KioskActions.getCategoriesByStoreSuccess, (state, { response }) => {
        return {
            ...state,
            categoryTableData: transformKioskCategory(response) as IKioskCategory[],
            catergoryReorderedKiosk: {},
        };
    }),
    on(KioskActions.reorderKioskCategory, (state, { to, from, msg }) => {
        const copy: IKioskCategory[] = moveElement(
            [...state.categoryTableData],
            from,
            to
        );

        if (Object.keys(state.catergoryReorderedKiosk).length > 0) {
            return {
                ...state,
                categoryTableData: copy,
            };
        } else {
            return {
                ...state,
                categoryTableData: copy,
                catergoryReorderedKiosk: msg,
            };
        }
    }),
    on(KioskActions.addStore, (state, { isAddStoreSidebarOpen }) => {
        return {
            ...state,
            addStoreSidebarBoolean: isAddStoreSidebarOpen
        };
    }),

    on(KioskActions.getCategoriesSuccess, (state, { availableCategories }) => {
        const extractedProducts = extractProductDataFromCategory(availableCategories);
        const availableCategoriesCopy = availableCategories.filter((res) => res?.productsCount !== 0);
        const { cartItems, itemQty, availableProducts } = setAvaialableProducts(extractedProducts, state.cartItems, state.itemQty);

        return {
            ...state,
            status: "Success",
            error: "",
            availableCategories: availableCategoriesCopy,
            availableProducts,
            cartItems,
            itemQty,
        };
    }),
    on(KioskActions.getCategoriesFailure, (state, error) => {
        return {
            ...state,
            error: error.err,
            status: "Error",
        };
    }),
    on(KioskActions.incrementQtyViaProduct, (state, { product, isTable }) => {
        const { cartItems, availableProducts, itemQty, cartLen } = incrementQtyViaProduct(product, state.cartItems, state.availableProducts, state.itemQty, state.cartLen);

        return {
            ...state,
            availableProducts,
            cartItems: isTable ? state.cartItems : cartItems,
            itemQty,
            cartLen: isTable ? state.cartLen : cartLen,
        };
    }),
    on(KioskActions.decrementQtyViaProduct, (state, { product, isTable }) => {
        const upDatedData = decrementQtyViaProduct(product, state.cartItems, state.availableProducts, state.itemQty, state.cartLen);
        let cartLen = state.cartLen;
        if (typeof upDatedData?.cartLen === "number") { cartLen = upDatedData.cartLen }

        return {
            ...state,
            availableProducts: upDatedData?.availableProducts || state.availableProducts,
            cartItems: isTable ? state.cartItems : upDatedData?.cartItems || state.cartItems,
            itemQty: upDatedData?.itemQty || state.itemQty,
            cartLen: isTable ? state.cartLen : cartLen,
        };
    }),
    on(KioskActions.updateCartItems, (state, { products }) => {
        const upDatedData = updateCartValue(products, state.cartItems, state.availableProducts, state.itemQty, state.cartLen);
        let cartLen = state.cartLen;
        if (typeof upDatedData?.cartLen === "number") { cartLen = upDatedData.cartLen }


        return {
            ...state,
            availableProducts: upDatedData?.availableProducts || state.availableProducts,
            cartItems: upDatedData?.cartItems || state.cartItems,
            itemQty: upDatedData?.itemQty || state.itemQty,
            cartLen,
        };
    }),
    on(KioskActions.removeCartItem, (state, { _id, isTable }) => {
        const { cartItems, itemQty, cartLen, availableProducts } = removeCartItem(_id, state.cartItems, state.availableProducts, state.itemQty, state.cartLen);

        return {
            ...state,
            cartItems: isTable ? state.cartItems : cartItems,
            availableProducts,
            itemQty: isTable ? state.itemQty : itemQty,
            cartLen: isTable ? state.cartLen : cartLen,
        };
    }),
    on(KioskActions.resetCartValues, (state) => {
        const itemQtyInitial = new Map<string, { qty: number; idx: number }>();
        const availableProducts = state.availableProducts.map((v) => {
            if (v.qty > 0) {
                const copy = { ...v };
                copy.qty = 0;
                return copy
            }
            else {
                return v
            }
        });

        const updatedMap = state.itemQty.size ? state.itemQty : itemQtyInitial
        for (let [_, value] of updatedMap) {
            value.qty = 0;
            value.idx = -1;
        }
        return {
            ...state,
            cartItems: [],
            availableProducts,
            itemQty: updatedMap,
            cartLen: 0,
        };
    }),

    on(KioskActions.updateTableCart, (state, { prodId }) => {


        const newAvailableProducts = state.availableProducts.map((v) => {
            if (v?.productInfo?._id === prodId) {
                const copyValue = { ...v };
                copyValue.qty = 0;
                return copyValue
            }
            return v;
        })

        return {
            ...state,
            availableProducts: newAvailableProducts
        }
    }),


    on(KioskActions.quantityCheckSuccess, (state, { quantityStatus }) => {
        return {
            ...state,
            status: "Success",
            error: "",
            quantityStatus,
        };
    }),

    on(KioskActions.getMaestroAreasSuccess, (state, { areas }) => {
        return {
            ...state,
            maestroAreas: areas.reduce((acc, curr) => {
                acc.push(curr.assetDetails);
                return acc;
            }, [])
        };
    }),

    on(KioskActions.updateKitchenSentData, (state, { kitchenData }) => {

        const newKitchenData = cloneDeep(kitchenData);
        for (let i = 0; i < newKitchenData.length; i++) {
            for (let j = 0; j < newKitchenData[i]?.items?.length; j++) {
                for (let k = 0; k < state.availableProducts.length; k++) {
                    if (state.availableProducts[k].productInfo._id === newKitchenData[i].items[j]._id) {
                        newKitchenData[i].items[j]['imageUrl'] = state.availableProducts[k].imageURL
                    }
                }
            }
        }

        return {
            ...state,
            kitchenSentData: newKitchenData
        }
    }),



    on(KioskActions.quantityCheckDataReset, (state) => {
        return {
            ...state,
            quantityStatus: { status: null, statusMsg: "" },
        };
    }),
    on(KioskActions.quantityCheckFailure, (state, error) => {
        return {
            ...state,
            error: error.err,
            status: "Error",
        };
    }),
    on(KioskActions.getProductGroupsSuccess, (state, { productGroups }) => {
        return {
            ...state,
            status: "Success",
            error: "",
            productGroups,
        };
    }),
    on(KioskActions.getProductGroupsFailure, (state, error) => {
        return {
            ...state,
            error: error.err,
            status: "Error",
        };
    }),
    on(KioskActions.showLoaderForGenericSettings, (state, { val }) => {
        return {
            ...state,
            genericSettingUpdateLoader: val
        }
    }),
    on(KioskActions.getKioskSettingsMetadata, (state) => {
        return {
            ...state,
            genericSettingsByGroupLoader: true
        }
    }),

    on(KioskActions.setKioskSettingsMetadata, (state, { kioskMetaData, groupType }) => {
        return {
            ...state,
            kioskSettingsMetaData: { ...state.kioskSettingsMetaData, [groupType]: kioskMetaData },
            genericSettingsByGroupLoader: false
        }
    }),
    on(KioskActions.getAllGroupsForKioskSettings, (state) => {
        return {
            ...state,
            genericSettingUpdateLoader: true
        }
    }),
    on(KioskActions.getAllGroupsForKioskSettingsSuccess, (state, { res }) => {
        return {
            ...state,
            genericSettingUpdateLoader: false,
            allGroupsNamesSetttingForKiosk: res
        }
    }),

    on(KioskActions.putGenericKioskSettings, (state) => {
        return {
            ...state,
            genericSettingUpdateLoader: true
        }
    }),

    on(KioskActions.putGenericKioskSettingsSuccess, (state, { res, moduleType }) => {
        return {
            ...state,
            kioskSettings: { ...state.kioskSettings, [moduleType]: res },
            genericSettingUpdateLoader: false
        }
    }),
    on(KioskActions.errorHandlerForGenericKioskSettings, (state) => {
        return {
            ...state,
            genericSettingUpdateLoader: false
        }
    }),



    on(KioskActions.getAllPaymentGatewayListSucces, (state, { response }) => {
        return { ...state, payamentGatewayList: response }
    }),
    on(KioskActions.sendPaymentVerificationSucess, (state, { res }) => {
        let status = {
            status: 'success',
            processingDone: true,
            data: res
        }
        return {
            ...state,
            verificationProcess: status
        }
    }),
    on(KioskActions.resetVerifcation, (state) => {
        return {
            ...state,
            verificationProcess: {
                processingDone: false,
                status: ''
            }
        }
    }),
    on(KioskActions.getRazorpayDataSuccess, (state, { razorpay, account }) => {
        return {
            ...state,
            razorpayData: razorpay,
            razorpayConfig: buildRazorPayConfig(razorpay, state.razorpayConfig, account)
        }
    }),
    on(KioskActions.getAllKagnetsSuccess, (state, { res }) => {
        return {
            ...state,
            kAgents: getKAgentWithOnlineStatus(res)
        }
    }),

    on(KioskActions.updateLiveStatusOfKAgent, (state, { machineId, lastStatusUpdate }) => {
        return {
            ...state,
            kAgents: updateKAgentStatusAfterSocketPush(machineId, lastStatusUpdate, state.kAgents)
        }
    }),

    on(KioskActions.getMaestroInfoSuccess, (state, { maestroInfo }) => {
        return {
            ...state,
            maestroData: maestroInfo,
        }
    }),

    on(KioskActions.linkKioskAgentProcessSuccess, (state) => {
        return {
            ...state,
            kAgentLoader: false
        }
    }),

    on(KioskActions.linkKioskAgent, (state) => {
        return {
            ...state,
            kAgentLoader: true
        }
    }),

    on(KioskActions.delinkKioskAgent, (state) => {
        return {
            ...state,
            kAgentLoader: true
        }
    }),

    on(KioskActions.linkKioskAgentProcessFailure, (state) => {
        return {
            ...state,
            kAgentLoader: false
        }
    }),

    on(KioskActions.kAgentTabAPiFailure, (state) => {
        return {
            ...state,
            kAgentLoader: false
        }
    }),

    on(KioskActions.filledStateWithTableData, (state, { tableData }) => {

        const cartItems = [];

        let idx = 0;
        for (let i = 0; i < tableData?.length; i++) {
            for (let j = 0; j < tableData?.[i]?.items?.length; j++) {
                const prod = {
                    metaInfo: {
                        itemName: tableData?.[i]?.items?.[j]?.name,
                        price: tableData?.[i]?.items[j]?.price,
                    },
                    productInfo: {
                        _id: tableData?.[i]?.items[j]?._id,
                    },
                    imageURL: tableData?.[i]?.items[j]?.imageUrl,
                    qty: tableData?.[i]?.items[j]?.quantity,
                    idx: idx
                }
                cartItems.push(prod);
                idx++;
            }
        }

        return {
            ...state,
            cartItems: cartItems,
            cartLen: cartItems?.length
        }
    }),

    on(KioskActions.getAvailableKioskSuccess, (state, { kioksData }) => {
        return {
            ...state,
            kioskData: kioksData
        }
    }),

    on(KioskActions.changeTheMachinename, (state) => {
        return {
            ...state,
            kAgentLoader: true
        }
    }),

    on(KioskActions.changeTheMachinenameSuccess, (state) => {
        return {
            ...state,
            kAgentLoader: false
        }
    }),
    on(KioskActions.setKioskKAgentMetadata, (state, { kioskKAgentMetaData }) => {
        return {
            ...state,
            kAgentMetadata: kioskKAgentMetaData
        }
    }),
    on(KioskActions.getLayoutKioskOrderPageSuccess, (state, { response }) => {
        return {
            ...state,
            kioskSettings: { ...state.kioskSettings, orderPageLayout: response }
        }
    }),
);

function addItemToList(listToAdd, array) {
    let tempArr = cloneDeep(array)
    listToAdd.map((product) => {
        let tempObj: { [k: string]: any } = {};
        tempObj = cloneDeep(product['product'])
        tempObj['toggle'] = (() => {
            if (product['metaInfo'] && product['metaInfo']['status'] !== null && product['metaInfo']['status'] === true) {
                return true
            } else {
                return false
            }
        })()
        tempObj['linkId'] = product['_id']
        tempObj['groupsLinked'] = product['groups']
        tempArr.push(tempObj)
    })
    return tempArr;
}

function modifyStoreProductList(productListByStore) {
    // TODO: reduce response fields using fi
    let productList: any[] = [];
    map(productListByStore, (product) => {
        let tempObj: Record<string, unknown> = { ...product['product'] }
        if (tempObj) {
            tempObj['toggle'] = (() => {
                if (product['metaInfo'] && product['metaInfo']['status'] && product['metaInfo']['status'] === true) {
                    return true
                } else {
                    return false
                }
            })()


            tempObj['toggleActivation'] = (() => {
                if (product['metaInfo'] && product['metaInfo']['isActivated'] && product['metaInfo']['isActivated'] === true) {
                    return true
                } else {
                    return false
                }
            })()
        }

        if (product.metaInfo) {
            if (product.metaInfo.quantity) {
                tempObj['quantity'] = product.metaInfo.quantity;
            } else if (product.metaInfo.quantity == 0) {
                tempObj['quantity'] = 0;
            }

            // build timeslots
            if (product?.metaInfo?.slots) {
                let slots = product?.metaInfo?.slots;
                tempObj['dayAndTimeSlot'] = {
                    days: slots?.days?.length > 0 ? slots?.days : [],
                    timeSlots: slots?.timeSlots?.length > 0 ? formatTimeSlots(slots?.timeSlots) : []
                };
                tempObj['originalTimeSlots'] = slots;
            }
            else {
                tempObj['dayAndTimeSlot'] = {
                    days: [],
                    formatTimeSlots: []
                }
            }

        }

        for (let priceType in product?.metaInfo?.prices || {}) {
            tempObj[priceType] = product.metaInfo.prices[priceType]
        }

        tempObj['linkId'] = product['_id']
        tempObj['groupsLinked'] = product['groups']
        tempObj['images'] = product['images']

        tempObj['itemName'] = (product['metaInfo'] && product['metaInfo']['itemName']) ? product['metaInfo']['itemName'] : tempObj['itemName']
        tempObj['productPrice'] = tempObj['price']
        tempObj['storePrice'] = (product['metaInfo'] && product['metaInfo']['price']) ? product['metaInfo']['price'] : tempObj['price']
        tempObj['imageUrl'] = (() => {
            if (product?.image?.baseUrl && product?.image?.imageBasePath) {
                return product?.image?.baseUrl + "tr:w-100/" + product?.image?.imageBasePath
            }
        })()

        tempObj['categoriesDeActivated'] = (() => { return (product['metaInfo']?.['categoriesDeActivated'] ? true : false) })()
        tempObj['categoriesDisabled'] = (() => { return (product['metaInfo']?.['categoriesDisabled'] ? true : false) })()


        productList.push(tempObj);
    })

    return productList;
}

function modifyProduct(productListByStore, updatedMetaData) {
    let productList: any[] = [];
    let i = findIndex(productListByStore, function (p: any) { return p.linkId == updatedMetaData._id; })
    if (i > -1) {

        let tempObj = cloneDeep(productListByStore[i])
        if (updatedMetaData.metaInfo) {
            if (updatedMetaData.metaInfo.quantity) {
                tempObj['quantity'] = updatedMetaData.metaInfo.quantity;
            } else if (updatedMetaData.metaInfo.quantity == 0) {
                tempObj['quantity'] = 0;
            }

            tempObj['storePrice'] = (updatedMetaData['metaInfo']['price']) ? updatedMetaData['metaInfo']['price'] : tempObj['price']
        }

        productListByStore[i] = tempObj;
    }

    productList = cloneDeep(productListByStore);
    return productList;
}

function formatTimeSlots(timeSlots) {
    const formattedTimeSlots = [];

    timeSlots.forEach((slot) => {
        const startH = slot.start.h > 12 ? slot.start.h - 12 : slot.start.h;
        const endH = slot.end.h > 12 ? slot.end.h - 12 : slot.end.h;
        const startM = slot.start.m < 10 ? `0${slot.start.m}` : `${slot.start.m}`;
        const endM = slot.end.m < 10 ? `0${slot.end.m}` : `${slot.end.m}`;
        const startAMPM = slot.start.h >= 12 ? ' PM' : ' AM';
        const endAMPM = slot.end.h >= 12 ? ' PM' : ' AM';

        const formattedSlot = `${startH}:${startM}${startAMPM} - ${endH}:${endM}${endAMPM}`;
        formattedTimeSlots.push(formattedSlot);
    });

    return formattedTimeSlots;
}

function transformKioskCategory(categories) {
    let newCategoryArray = categories.map((cat, i) => {
        let sequence = cat?.metaInfo?.sequence ? cat?.metaInfo?.sequence : i + 1

        let status = false;
        if (cat?.metaInfo?.status !== null && cat?.metaInfo?.status !== undefined) {
            status = cat?.metaInfo?.status
        }

        let isActivated = false
        if (cat?.metaInfo?.isActivated !== null && cat?.metaInfo?.isActivated !== undefined) {
            isActivated = cat?.metaInfo?.isActivated
        }

        const slots = cat?.metaInfo?.slots ?? null;
        const days = slots?.days?.length > 0 ? slots?.days : [];
        const timeSlots = slots?.timeSlots?.length > 0 ? formatTimeSlots(slots?.timeSlots) : [];

        return { ...cat.category, sequence: sequence, status: status, slots: slots, days: days, timeSlots: timeSlots, isActivated: isActivated }

    })
    return newCategoryArray
}

function buildRazorPayConfig(razorpayData: RazorPay, razorpayConfig: RazorPayConfig, accountDetails: Account) {
    const rzpThemeColor = getComputedStyle(
        document.documentElement
    ).getPropertyValue("--primary-color");

    const config: RazorPayConfig = { ...razorpayConfig }
    config.key = razorpayData?.apiKey;
    config.notes = { ...config.notes, customerId: razorpayData?.customer_id ?? null };
    config.notes = { ...config.notes, linkedAccount: razorpayData?.linkedAccount ?? null };
    config.name = accountDetails?.name ?? '';

    if (accountDetails?.["images"]?.logo?.razorpayDisplayUrl) {
        config.image = accountDetails?.["images"]?.logo?.razorpayDisplayUrl;
    } else {
        config.image = "data:image/png;base64," + accountDetails?.["images"]?.logo?.data;
    }

    config.theme = { ...config.theme, color: rzpThemeColor ?? '#b1812d' };
    return config
}


export function moveElement(arr: any[], from: number, to: number): any[] {
    const element = orderByField(arr, 'sequence').splice(from, 1)[0];
    arr.splice(to, 0, element);
    return setReArrangedSequence(arr);
}

function orderByField(array: unknown[], field: string): unknown[] {
    return array.sort((a, b) => {
        if (a[field] < b[field]) {
            return -1;
        }
        if (a[field] > b[field]) {
            return 1;
        }
        return 0;
    });
}

export function setReArrangedSequence(data) {
    let cpData = data.map((c, index) => {
        let cp = { ...c, sequence: index + 1 };

        return cp
    })
    return cpData

}
