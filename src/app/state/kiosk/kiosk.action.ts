import { createAction, props } from "@ngrx/store";
import {
    GatewayList, IGroupsOfKioskSettingsWithModuleSettings, IKioskTableFormSettings, IKisoskSettingsMetaData, IPayloadForDelinkingSlots, KAgent, RazorPay, KioskStore, IDeliveryCenterAsset,
    ILocation,
    Account
} from "src/app/interface/maestro-interface";
import {
    ICategoryData, IKioskCategory, IProductData, IGroupData, IQuantityStatus, IStoreProductWindowAssignmentPayload, PosData,
} from "src/app/interface/maestro-interface";
import { Message } from "primeng/api";
import { ICategoryMetaInfoPayload, ICategorySequencePayloadStoreLevel, IStoreCategoryUpdatePayload } from "src/app/interface/maestro-interface"



export const currentBranch = createAction(
    "[Kiosk Store API] set current branch",
    props<{ currentBranch: KioskStore | IDeliveryCenterAsset | ILocation }>()
);

export const loadBranchList = createAction(
    "[Kiosk Store API] load kiosk branch list",
);

export const loadBranchListSuccess = createAction(
    "[Kiosk Store API] load kiosk branch list success",
    props<{ branchList: any }>()
);

export const loadBranchListFailure = createAction(
    "[Kiosk Store API] load kiosk branch list failure",
    props<{ err: string }>()
);

export const loadProductCountByStore = createAction(
    "[Kiosk Store API] load kiosk products count by branch",
    props<{ storeId: string, filters?: any, isCategory?: boolean, searchQuery?: string }>()
);
export const loadUnlinkedProductCountByStore = createAction(
    "[Kiosk Store API] load unlinked kiosk products count by branch",
    props<{ storeId: string, searchQuery: string }>()
);

export const loadProductCountByStoreSuccess = createAction(
    "[Kiosk Store API] load kiosk products count by branch success",
    props<{ productCountByStore: any }>()
);
export const loadUnlinkedProductCountByStoreSuccess = createAction(
    "[Kiosk Store API] load unlinked  kiosk products count by branch success",
    props<{ unlinkedProductCountByStore: any }>()
);
export const loadProductCountByStoreFailure = createAction(
    "[Kiosk Store API] load kiosk products count by branch failure",
    props<{ err: string }>()
);
export const loadUnlinkedProductCountByStoreFailure = createAction(
    "[Kiosk Store API] load unlinked kiosk products count by branch failure",
    props<{ err: string }>()
);

export const loadProductListByStore = createAction(
    "[Kiosk Store API] load kiosk products list by branch",
    props<{ storeId: string, skip: number, limit: number, clean?: boolean, filters?: any, isCategory?: boolean, sortField?: string, searchQuery?: string, includeImage?: boolean }>()
);
export const loadUnlinkedProductListByStore = createAction(
    "[Kiosk Store API] load unlinked kiosk products list by branch",
    props<{ storeId: string, skip: number, limit: number, sortField?: string, searchQuery?: string }>()
);

export const loadProductListByStoreSuccess = createAction(
    "[Kiosk Store API] load kiosk products count by list success",
    props<{ productListByStore: any }>()
);

export const loadUnlinkedProductListByStoreSuccess = createAction(
    "[Kiosk Store API] load Unlinked kiosk products count by list success",
    props<{ unlinkedProductListByStore: any }>()
);
export const loadUnlinkedProductListByStoreFailure = createAction(
    "[Kiosk Store API] load Unlinked kiosk products count by list failure",
    props<{ error: any }>()
);

export const loadProductListByStoreFailure = createAction(
    "[Kiosk Store API] load kiosk products count by list failure",
    props<{ err: string }>()
);

export const loadProductList = createAction(
    "[Kiosk Store API] load kiosk product list",
    props<{ skip: number, limit: number, searchedText?: string }>()
);

export const loadProductListSuccess = createAction(
    "[Kiosk Store API] load kiosk product list success",
    props<{ allProducts: any }>()
);

export const loadProductListFailure = createAction(
    "[Kiosk Store API] load kiosk product list failure",
    props<{ err: string }>()
);

export const loadProductsCount = createAction(
    "[Kiosk Store API] load kiosk product list count",
    props<{ searchedText?: string }>()
);

export const loadProductsCountSuccess = createAction(
    "[Kiosk Store API] load kiosk product list count success",
    props<{ allProductsCount: any }>()
);

export const loadProductsCountFailure = createAction(
    "[Kiosk Store API] load kiosk product list count failure",
    props<{ err: string }>()
);

export const loadOrderList = createAction(
    "[Kiosk Store API] load kiosk order list",
);

export const loadOrderListSuccess = createAction(
    "[Kiosk Store API] load kiosk order list success",
    props<{ allOrders: any }>()
);

export const loadOrderListFailure = createAction(
    "[Kiosk Store API] load kiosk order list failure",
    props<{ err: string }>()
);

export const reset = createAction(
    "[Kiosk Store API] reset kiosk",
);

export const sendProductIdsTolinkToStore = createAction(
    '[Kiosk Store API]  send product ids to link to store id',
    props<{ storeId: any, productIds: any, isActivated?}>()
)

export const sendProductandGroupIds = createAction(
    '[Kiosk Store API]  send product and group ids to link',
    props<{ assetLinkids: any, groupIds: any }>()
)

export const sendProductIdsTolinkToStoreSuccess = createAction(
    "[Kiosk Store API] send kiosk order list success",
    props<{ responseMsg: any, responseType?: any }>()
);
export const sendProudGroupAddedSuccess = createAction(
    "[Kiosk Store API] load kiosk product grouping success",
    props<{ responseMsg: any }>()
);

export const sendProductIdsTolinkToStoreFailure = createAction(
    "[Kiosk Store API] send kiosk order list failure",
    props<{ error: any }>()
);

export const sendassetLinkMeta = createAction(
    '[Kiosk Store API] load kiosk order list failure',
    props<{
        assetLinkId: string[], metaInfoStatus?: any,
        metaInfoQty?: number, metaInfoStorePrice?: number,
        metaInfoIsActivated?: boolean,
        storeId?: string, skip?: number, limit?: number,
        filters?: unknown, isCategory?: boolean, searchQuery?: string,
        includeImage?: boolean, clean?: boolean, updateMultiple?: boolean;
        dynamicPriceData?: Record<string, number>
    }>()
);

export const assetLinkMetaSuccess = createAction(
    '[Kiosk Store API] asset meta info link success',
    props<{ response: any }>()
)
export const assetLinkMetaFailure = createAction(
    '[Kiosk Store API] asset meta info link failure',
    props<{ error: any, assetLinkId: any }>()
)

export const removeProduct = createAction(
    '[Kiosk Store API] remove product by asset link id',
    props<{ assetLinkIds: any[] }>()
)


export const productRemovedByLinkIdSuccess = createAction(
    '[Kiosk Store API] asset meta info link remove success',
    props<{ response: any, assetLinkId: any }>()
)
export const productRemovedByLinkIdFailure = createAction(
    '[Kiosk Store API] asset meta info link remove failure',
    props<{ error: any }>()
)
export const removeGroup = createAction(
    '[Kiosk Store API]delink group by assetlinkid',
    props<{ groupId: any, assetLinkId: any }>()
)
export const removeGroupSuccess = createAction(
    '[Kiosk Store API]delink group by assetlinkid success',
    props<{ response: any }>()
)

export const removeGroupFailure = createAction(
    '[Kiosk Store API]delink group by assetlinkid  failure',
    props<{ error: any }>()
)

export const getCategoryList = createAction(
    '[Kiosk Store API] get category list',
    props<{ skip: number, limit: number }>()
)
export const getCategoryListSuccess = createAction(
    '[Kiosk Store API]Get Category List Success',
    props<{ response: any }>()
)

export const getCategoryListFailure = createAction(
    '[Kiosk Store API]Get Category List failure',
    props<{ error: any }>()
)


export const getGroupList = createAction(
    '[Kiosk Store API]get group list',
    props<{ props: any }>()
)

export const getGroupListSuccess = createAction(
    '[Kiosk Store API]Get group  List Success',
    props<{ response: any }>()
)

export const getGroupListFailure = createAction(
    '[Kiosk Store API]Get group List failure',
    props<{ error: any }>()
)

export const getConfig = createAction(
    '[KIOSK API Call] get config'
)

export const getConfigSuccess = createAction(
    '[KIOSK API Call] get config success',
    props<{ config: any }>()
)
export const getConfigFailure = createAction(
    '[KIOSK API Call] get config failure',
    props<{ error: any }>()
)

export const modifiyProductList = createAction(
    '[Kiosk ] modify store products',
    props<{ id: any }>()
)

export const getImageUrlForProducts = createAction(
    '[KIOSK] Get Image Url',
    props<{ aId: any, fData: any, index: any }>()
)

export const getImageUrlForProductSuccess = createAction(
    '[Kiosk Store API]Get image url success',
    props<{ response: any, index: any }>()
)
export const getImageUrlForProductFailure = createAction(
    '[Kiosk Store API]Get image url success',
    props<{ error: any }>()
)


export const modifyProductList = createAction(
    '[Kiosk Store API]Get group  List Success',
    props<{ productList: any, index: any }>()
)
export const modifyProductListFlag = createAction(
    '[Kiosk]Modify product list flag',
    props<{ flag: any }>()
)
export const updateProductList = createAction(
    '[Kiosk]update product list',
    props<{ listToAdd: any }>()

)

export const addProductsAndGroupIds = createAction(
    '[Kiosk Store API]  add products to groups',
    props<{ assetIds: any, groupIds: any }>()
)

export const getProductMetaInfoByLinkId = createAction(
    '[Kiosk Store API]  get product meta info by link id',
    props<{ linkId: string }>()
)

export const getProductMetaInfoByLinkIdSuccess = createAction(
    '[Kiosk Store API]  get product meta info by link id success',
    props<{ response: any }>()
)

export const getProductMetaInfoByLinkIdFailure = createAction(
    "[Kiosk Store API] get product meta info by link id failure",
    props<{ err: any }>()
);

export const resetSelectedBranch = createAction(
    '[Kiosk Module] reset selected branch'
)

export const getKioskSettingsByModule = createAction(
    '[Kiosk Module] get kiosk setting by module type',
    props<{ settingsType: string }>()
)
export const getKioskSettingsByModuleForSocket = createAction(
    '[Kiosk Module] get kiosk setting by module type for socket',
    props<{ settingsType: string }>()
)

export const getKioskSettingsSuccess = createAction(
    '[Kiosk Module] get kiosk setting by success',
    props<{ response: any }>()
)
export const getKioskSettingsFailure = createAction(
    '[Kiosk Module] get kiosk setting by failure',
    props<{ error: any }>()
)


export const buildFullTimelineData = createAction(
    '[Kiosk module] build full timeline data ',
    props<{ timelineAsset: any }>()
)

export const getTimelineContentData = createAction(
    '[Kiosk module] get timeline event data ',
    props<{ timelineParam: any, timelineAsset: any }>()
)

export const getTimelineContentDataSuccess = createAction(
    '[Kiosk module] get timeline event data type success ',
    props<{ response: any }>()
)

export const getTimelineContentDataFailure = createAction(
    '[Kiosk module] get timeline event data type failure ',
    props<{ error: any }>()
)

export const putTimeAndDaySlots = createAction(
    '[Kiosk module] api call to update timeslots and days to to selected proucts ',
    props<{ payload: IStoreProductWindowAssignmentPayload, locationId: string }>()
)

export const putAndLinkTimeAndDaySlotsToSelectedProductsSuccess = createAction(
    '[Kiosk module] api call to update timeslots and days to to selected proucts  success'
)
export const putAndLinkTimeAndDaySlotsToSelectedProductsFailure = createAction(
    '[Kiosk module] api call to update timeslots and days to to selected proucts failure ',
    props<{ error: any }>()
)

export const categoryReorderState = createAction(
    '[Kiosk module]  categories reordered ',
    props<{ reordered: string }>()
)
export const delinkDayAndTimeSlots = createAction(
    "[KIOSK Module] delink day and timeslots",
    props<{ locationId: string, payload: IPayloadForDelinkingSlots }>()
)

export const getCategoriesBySelectedStore = createAction(
    "[KIOSK Module] get categories by selected store",
    props<{ locationId: string }>()
)

export const getCategoriesByStoreSuccess = createAction(
    "[KIOSK Module] get categories by selected store sucecess",
    props<{ response: IKioskCategory[] }>()
)

export const reorderKioskCategory = createAction(
    "[Kiosk Module] reorder the categoies in store ",
    props<{ from: number, to: number, msg: Message }>()

)

export const putCategoryOrderSequence = createAction(
    "[Kiosk Module] pu  reorder sequence the categoies in store ",
    props<{ locationId: string, assetType: string, payload: ICategorySequencePayloadStoreLevel }>()
)

export const reorderKioskMsg = createAction(
    "[Kiosk Module] re order kiosk category msg",
    props<{ msg: string }>()
)
export const updateCategoryByStore = createAction(
    '[Kiosk Module] update category by store',
    props<{ locationId: string, payload: IStoreCategoryUpdatePayload }>()
)



export const getCategories = createAction(
    "[Kiosk Store API] get categories",
    // props<{ branchID:string}>()
);

export const getCategoriesSuccess = createAction(
    "[Kiosk Store API] get categories success",
    props<{ availableCategories: ICategoryData[] }>()
);

export const getCategoriesFailure = createAction(
    "[Kiosk Store API] get categories failure",
    props<{ err: string }>()
);



export const incrementQtyViaProduct = createAction(
    "[Kiosk Store API] increment quantity via product",
    props<{ product: IProductData, isTable?: boolean }>()
);

export const updateTableCart = createAction(
    "[Kiosk Store API] update cart item for table",
    props<{ prodId: string, isTable: boolean, }>()
);

export const getMaestroAreas = createAction(
    "[Maestro API] get maestro areas",
)

export const getMaestroAreasSuccess = createAction(
    "[Maestro API] get maestro areas success",
    props<{ areas: any }>()

);

export const updateKitchenSentData = createAction(
    "[Kitchen Sent Data] update kitchen sent data",
    props<{ kitchenData: any }>()

);


export const decrementQtyViaProduct = createAction(
    "[Kiosk Store API] decrement quantity via product",
    props<{ product: IProductData, isTable?: boolean }>()
);

export const filledStateWithTableData = createAction(
    "[Table Cart Sync] filling table in cart state",
    props<{ tableData: any }>()

)


export const resetCartValues = createAction(
    "[Kiosk Store API] reset cart values",
    props<{ modalOpen?: boolean }>()
);

export const removeCartItem = createAction(
    "[Kiosk Store API] remove cart item",
    props<{ _id: string, isTable?: boolean }>()
);

export const updateCartItems = createAction(
    "[Kiosk Store API] update cart item",
    props<{ products: IProductData[], isTable?: boolean }>()
);

export const quantityCheck = createAction(
    "[Kiosk Store API] quantity check",
    props<{ productArray, storeId: string }>()
);
export const quantityCheckSuccess = createAction(
    "[Kiosk Store API] quantity check success",
    props<{ quantityStatus: IQuantityStatus }>()
);
export const quantityCheckFailure = createAction(
    "[Kiosk Store API] quantity check failure",
    props<{ err: string }>()
);

export const quantityCheckDataReset = createAction(
    "[Kiosk Store API] quantity check data reset",
);



export const getProductGroups = createAction(
    "[Kiosk Store API] get product groups",
);
export const getProductGroupsSuccess = createAction(
    "[Kiosk Store API] get product groups success",
    props<{ productGroups: IGroupData[] }>()
);
export const getProductGroupsFailure = createAction(
    "[Kiosk Store API] get product groups failure",
    props<{ err: string }>()
);
export const addStore = createAction(
    '[Kiosk Module] add Store sidebar open',
    props<{ isAddStoreSidebarOpen: boolean }>()
)

export const addNewStoreForKioskUsingForm = createAction(
    '[kiosk module], add new store',
    props<{ formData: unknown }>()
)

export const getAllPaymentGatewayList = createAction(
    '[Kiosk Module], get all payment gateway effect',
)

export const getAllPaymentGatewayListSucces = createAction(
    '[Kiosk Module], get all payment gateway success',
    props<{ response: GatewayList[] }>()
)

export const sendPaymentVerification = createAction(
    '[Kiosk Moduel], send payement verification by admin',
    props<{ orderId: string | number, Id?: unknown }>()
)
export const sendPaymentVerificationSucess = createAction(
    '[kiosk Module] payment verfication success',
    props<{ res: unknown }>()
)
export const resetVerifcation = createAction(
    '[Kiosk Module] reset Verifcation'
)
export const printReceiptOnSok = createAction(
    '[KIOSK MODULE]  print reciept on sok printer',
    props<{ orderId: string | number }>()
)


export const sendTrasactionProofImage = createAction(
    "[kiosk module] send transaction ",
    props<{ payload: unknown, orderId: string }>()
)
export const sendTrasactionProofImageSuccess = createAction(
    "[kiosk module] send transaction success ",
    // props<{response: unknown}>()

)



export const getKioskSettingsMetadata = createAction('[KIOSK] get Kiosk Settings meta data api', props<{ groupType: string }>())

export const setKioskSettingsMetadata = createAction('[KIOSK] set Kiosk Setting meta data', props<{ kioskMetaData: IKisoskSettingsMetaData, groupType: string }>())

export const getAllGroupsForKioskSettings = createAction('[KIOSK] get all groups for kiosk')

export const getAllGroupsForKioskSettingsSuccess = createAction('[KIOSK] get all groups for kiosk success', props<{ res: IGroupsOfKioskSettingsWithModuleSettings[] }>())

export const putGenericKioskSettings = createAction('[KIOSK] set Kiosk Settings data api',
    props<{ payload: IKioskTableFormSettings, moduleType: string }>())

export const putGenericKioskSettingsSuccess = createAction('[KIOSK] set Kiosk Settings data api success',
    props<{ res: IKioskTableFormSettings, moduleType: string }>()
)
export const errorHandlerForGenericKioskSettings = createAction('[KIOSK] error handler Kiosk Settings data api')

export const KioskMetaDataSettingsFailure = createAction('[KIOSK] error in kiosk settings', props<{ err: unknown }>())
export const resetProductLinkResponseType = createAction(
    '[Kiosk module] reset product link response type'
)

export const getRazorpayData = createAction(
    '[Kiosk module] get razorpay config data'
)

export const getRazorpayDataSuccess = createAction(
    "[Kiosk Store API] get razorpay config data success",
    props<{ razorpay: RazorPay, account: Account }>()
);

export const showLoaderForGenericSettings = createAction('[Generic] set loader action',
    props<{ val: boolean }>()
)

export const updateKioskStoreCategoryMetaInfo = createAction(
    '[Kiosk Module] update category meta info kiosk store',
    props<{ locationId: string, payload: ICategoryMetaInfoPayload }>()
)

export const removeTimeSlotsToSelectedProductsSuccess = createAction(
    '[Kiosk module] api call to update time slots to selected products time slot removal success'
);

export const getAllKagnets = createAction(
    '[Kiosk module] api call to get the all linked kAgents '
);

export const getAllKagnetsSuccess = createAction(
    '[Kiosk module] api call success for all linked kAgents ',
    props<{ res: KAgent }>()

)

export const kioskAgentReboot = createAction(
    '[Kiosk module] api call for kiosk agent reboot',
    props<{ machineId: string, rebootTo: string }>()
)

export const kioskAgentRebootSuccess = createAction(
    '[Kiosk module] api call for kiosk agent reboot success'
)

export const delinkKioskAgent = createAction(
    '[Kiosk module] api call for delink kiosk agent ',
    props<{ kAgentId: string }>()

)

export const linkKioskAgentProcessSuccess = createAction(
    '[Kiosk module] api call for link process success ',
)

export const linkKioskAgentProcessFailure = createAction(
    '[Kiosk module] api call for link process failure ',
)

export const linkKioskAgent = createAction(
    '[Kiosk module] api call for linking kiosk agent ',
    props<{ kAgentId: string, kioskId: string }>()

)

export const getAvailableKiosk = createAction(
    '[Kiosk module] api call for getting kiosk list in kAgent tab ',

)

export const getAvailableKioskSuccess = createAction(
    '[Kiosk module] api call for getting kiosk list in kAgent tab Success ',
    props<{ kioksData: any }>()


)

export const changeTheMachinename = createAction(
    '[Kiosk module] api call for changing the machine name',
    props<{ kAgentId: string, machineName: string }>()
)

export const changeTheMachinenameSuccess = createAction(
    '[Kiosk module] api call for changing the machine name success',
)

export const updateLiveStatusOfKAgent = createAction(
    '[Kiosk module] update live status of kAgent',
    props<{ machineId: string, lastStatusUpdate: string }>()
)

export const getMaestroInfo = createAction(
    '[POS Metainfo ] get pos meta info'
);


export const getMaestroInfoSuccess = createAction(
    '[POS Metainfo ] get pos meta success',
    props<{ maestroInfo: PosData }>()

)


export const kAgentTabAPiFailure = createAction(
    '[Kiosk module] action for any api fail in k-agent tab',
)
export const getLayoutKioskOrderPage = createAction(
    '[Kiosk module] action for getting layout for kiosk order page',
)
export const getLayoutKioskOrderPageSuccess = createAction(
    '[Kiosk module] success action for getting layout for kiosk order page',
    props<{ response: any }>()
)

export const getKioskKAgentMetadata = createAction('[KIOSK] get Kiosk K-agent meta data api', props<{ module: string, typeId: string }>())

export const setKioskKAgentMetadata = createAction('[KIOSK] set K-agent Setting meta data', props<{ kioskKAgentMetaData: IKisoskSettingsMetaData, typeId: string }>())

export const apiCallFromMetaDataOfKAgent = createAction('[KIOSK] api call from Kiosk K-agent meta data', props<{ api: string, method: string, body: unknown }>())