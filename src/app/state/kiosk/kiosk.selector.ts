import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";



export const selectBranch = (state: AppState) => state.kiosk


export const getBranchList = createSelector(
    selectBranch,
    (kiosk) => kiosk.branchList
)

export const getCurrentBranch = createSelector(
    selectBranch,
    (kiosk) => kiosk.currentBranch
)

export const getSelectedBranchName = createSelector(
    selectBranch,
    (kiosk) => kiosk.currentBranch?.name
)


export const getProductsCountByStore = createSelector(
    selectBranch,
    (kiosk) => kiosk.productsCount
)

export const getProductListByStore = createSelector(
    selectBranch,
    (kiosk) => kiosk.productList
)

export const getAllProductsCount = createSelector(
    selectBranch,
    (kiosk) => kiosk.allProductsCount
)


export const getAllProducts = createSelector(
    selectBranch,
    (kiosk) => kiosk.allProducts
)

export const getAllOrders = createSelector(
    selectBranch,
    (kiosk) => kiosk.allOrders
)
export const getUnlnkedProductsCountByStore = createSelector(
    selectBranch,
    (kiosk) => kiosk.unlinkedProductCount
)

export const getUnlinkedProductsByStore = createSelector(
    selectBranch,
    (kiosk) => kiosk.unlinkedProductList
)

export const getReponseMsg = createSelector(
    selectBranch,
    (kiosk) => kiosk.productLinkResponseMsg
)

export const getGroupLinkedMsg = createSelector(
    selectBranch,
    (kiosk) => kiosk.productGroupResponseMsg
)

export const getAssetLinkMetaSuccess = createSelector(
    selectBranch,
    (kiosk) => kiosk.assetLinkSuccess
)
export const getProductRemovedByLinkIdSuccess = createSelector(
    selectBranch,
    (kiosk) => kiosk.productRemovedresponse
)

export const getDelinkGroupResponse = createSelector(
    selectBranch,
    (kiosk) => kiosk.delinkGroupResponse
)

export const getCategoryList = createSelector(
    selectBranch,
    (kiosk) => kiosk.categoryList
)

export const getGroupList = createSelector(
    selectBranch,
    (kiosk) => kiosk.groupList
)

export const getConfigData = createSelector(
    selectBranch,
    (kiosk) => kiosk.assetConfig
)

export const getModifyProductListFlag = createSelector(
    selectBranch,
    (kiosk) => { return { modifyFlag: kiosk.modifyFlag, productList: kiosk.productList } }
)
export const getModifiedProductList = createSelector(
    selectBranch,
    (kiosk) => kiosk.productList
)

export const delinkGroupErrResponse = createSelector(
    selectBranch,
    (kiosk) => kiosk.delinkGroupErrResponse
)

export const getAssetLinkMetaFailureResponse = createSelector(
    selectBranch,
    (kiosk) => kiosk.assetLinkMetaFailureResponse
)

export const getKioskSettings = createSelector(
    selectBranch,
    (kiosk) => kiosk.kioskSettings
)

export const getKioskSettingsUpdatedResponse = createSelector(
    selectBranch,
    (kiosk) => { return kiosk.kioskSettingsUpdatedResponse }
)

export const getAnyError = createSelector(
    selectBranch,
    kiosk => kiosk.error
)

export const getSlotAssignmentWindow = createSelector(
    selectBranch,
    kiosk => kiosk.kioskSettings?.slots
)

export const storeUpdatedSelector = createSelector(
    selectBranch,
    kiosk => kiosk?.kioskStoreUpdated
)

export const categoriesByStore = createSelector(
    selectBranch,
    kiosk => kiosk?.categoryTableData
)

export const catergoryReorderedKioskSelector = createSelector(
    selectBranch,
    kiosk => kiosk?.catergoryReorderedKiosk
)

export const getAvailableCategories = createSelector(
    selectBranch,
    (kiosk) => kiosk.availableCategories
)



export const getAvailableProducts = createSelector(
    selectBranch,
    (kiosk) => kiosk.availableProducts
)

export const getCartItems = createSelector(
    selectBranch,
    (kiosk) => kiosk.cartItems
)

export const getItemQuantity = createSelector(
    selectBranch,
    (kiosk) => kiosk.itemQty
)

export const getCartLength = createSelector(
    selectBranch,
    (kiosk) => kiosk.cartLen
)


export const getQuantityStatus = createSelector(
    selectBranch,
    (kiosk) => kiosk.quantityStatus
)


export const getProductGroups = createSelector(
    selectBranch,
    (kiosk) => kiosk.productGroups
)
export const selectorAddStoreSidebarBoolean = createSelector(
    selectBranch,
    kiosk => kiosk?.addStoreSidebarBoolean
)

export const selectorPayamentGatewayList = createSelector(
    selectBranch,
    kiosk => kiosk.payamentGatewayList
)

export const verificationProcess = createSelector(
    selectBranch,
    kiosk => kiosk.verificationProcess
)

export const getKiosAutoEnableProductsTime = createSelector(
    selectBranch,
    (kiosk) => kiosk.kioskSettings?.autoEnableProducts
)

export const getAllKioskSettingsMetaData = createSelector(
    selectBranch,
    (kiosk) => kiosk.kioskSettingsMetaData
)

export const getAllKioskSettingsGroupName = createSelector(
    selectBranch,
    (kiosk) => kiosk.allGroupsNamesSetttingForKiosk
)
export const genericSettingsByGroupLoader = createSelector(
    selectBranch,
    (kiosk) => kiosk.genericSettingsByGroupLoader
)
export const getProductLinkReponseType = createSelector(
    selectBranch,
    (kiosk) => kiosk.productLinkResponseType
)
export const showLoaderForGenericSetting = createSelector(
    selectBranch,
    (kiosk) => kiosk.genericSettingUpdateLoader
)


export const getRazorPayConfigData = createSelector(
    selectBranch,
    (kiosk) => kiosk.razorpayData
)

export const getRazorPayConfig = createSelector(
    selectBranch,
    (kiosk) => kiosk.razorpayConfig
)

export const getkAgentData = createSelector(
    selectBranch,
    (kiosk) => kiosk.kAgents
)

export const getAllLinkedKioskData = createSelector(
    selectBranch,
    (kiosk) => kiosk.kioskData
)

export const showKAgentPageLoader = createSelector(
    selectBranch,
    (kiosk) => kiosk.kAgentLoader
)

export const getKioskKAgentMetaDataFromSelector = createSelector(
    selectBranch,
    (kiosk) => kiosk.kAgentMetadata
)

export const getMaestroAreas = createSelector(
    selectBranch,
    (kiosk) => kiosk.maestroAreas
)

export const getKitchenSentData = createSelector(
    selectBranch,
    (kiosk) => kiosk.kitchenSentData
)


export const getMaestroInfoData = createSelector(
    selectBranch,
    (kiosk) => kiosk.maestroData
)

// export const getPayPermission = createSelector(
//   selectBranch,
//   (kiosk) => kiosk.canMakePayment
// )

// export const getCurrentFLoor = createSelector(
//   selectBranch,
//   (kiosk) => kiosk.currentArea
// )

// export const getMaestroStoreID = createSelector(
//   selectBranch,
//   (kiosk) => kiosk.maestroStoreId
// )

// export const getPrintPermission = createSelector(
//   selectBranch,
//   (kiosk) => kiosk.canMakePrint
// )