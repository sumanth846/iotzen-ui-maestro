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



export interface KioskStore {
    _id: string
    assetType: string
    name: string
    branchCode: string
    businessName: any
    status: string
    address: string
    city: string
    state: string
    pincode: number
    lat: number
    lng: number
    updated: string
    created: string
    __v: number
    assetsLinked: string[]
    groups: string[]
    serviceAssets: any
    orderStatus: string
    category: string
    contactNumber: string
    email: string
    shopifyId: number
    swiggyId: number
    timings: string
    zomatoId: number
    geoLocation: GeoLocation
    accountId: string
    autoAssignment: string
    noofFloors: number
}


export interface GeoLocation {
    type: string
    coordinates: number[]
}

export interface IAreas {
    assetDetails: IAreaAssetDetails
}

export interface IAreaAssetDetails {
    name: string
    _id: string
}


export interface IDeliveryCenterAsset {
    _id: string;
    assetType: string;
    name: string;
    branchCode?: string;
    businessName: string;
    status: string;
    address: string;
    lat: number;
    lng: number;
    contactNumber: number;
    email: string;
    accountId: string;
    geoLocation: GeoLocation;
    updated: string;
    created: string;
    __v: number;
    assetsLinked: AssetsLinked[];
    groups: any;
    serviceAssets: any;
}

export interface GeoLocation {
    type: string;
    coordinates: number[];
}

export interface AssetsLinked {
    _id: string;
    assetType: string;
    name: string;
    branchCode: string;
    businessName: string;
    status: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    lat: number;
    lng: number;
    serviceablePincodes: any;
    pinnedSku: any;
    contactNumber: number;
    email: string;
    shopifyId: any;
    autoAssignment: string;
    kiosk: string;
    accountId: string;
    geoLocation: GeoLocation2;
    updated: string;
    created: string;
    __v: number;
    assetsLinked: string[];
    groups: any;
    serviceAssets: any;
}

export interface GeoLocation2 {
    type: string;
    coordinates: number[];
}

export interface ILocation {
    _id: string;
    assetType: string;
    city: string;
    name: string;
    branchCode?: string;
    serviceAssets: any;
    assetsLinked?: unknown[];
}



export interface KioskSettings {
    inventoryManagement?: InventoryManagement;
    payment?: Payment;
    autoPrint?: AutoPrint;
    slots?: IAssignmentSettins;
    alternateLanguage?: LangaugeSettings
    kioskUISettings?: KioskUISettings;
    parcelCharge?: IParcelCharge,
    autoEnableProducts: IAutoEnableProducts,
    table: IKioskTableFormSettings
    form: IKioskTableFormSettings
    category: IKioskTableFormSettings
    [key: string]: unknown
    orderPageLayout?: IOrderPageLayout
    posUISettings: IPosUISettings
}
export interface IOrderPageLayout {
    accountId: string
    cart: ILayoutSelectBtn[]
    category: ILayoutSelectBtn[]
    typeId: string
}
export interface IPayByCashCartParam {
    amount: number,
    pMode: string,
}
export interface IPosUISettings {
    layout: {
        cart: string
        category: string
        isButtonVisibile: boolean
    },
    dineType: {
        dineIn: boolean
        dineOut: boolean
        table: boolean
    }
    isSocketEnabled: boolean
    isWallpaper: boolean
}
export interface ILayoutSelectBtn {
    label: string
    value: string
    isEnabled: boolean
}

export interface IAutoEnableProducts {
    enabled: boolean
    time: IAutoEnabledTime
}
export interface IAutoEnabledTime {
    h: number,
    m: number
}

export interface IParcelCharge {
    enabled: boolean
    flatFee: FlatFee
    productAndCategory: ProductAndCategory
    slabBased: SlabBased
}

export interface FlatFee {
    enabled: boolean
    value: number
}

export interface ProductAndCategory {
    enabled: boolean
}

export interface SlabBased {
    enabled: boolean
    slabs: Slab[]
}

export interface Slab {
    start: number
    end: number
    value: number
}



export interface AssignmentWindow {
    enabled: boolean,
    window: Window[]
}

export interface LangaugeSettings {
    enabled: boolean,
    alternateLanguage1: string
    systemLanguages?: langelist[]
    defaultLanguage?: unknown;
}

export interface langelist {
    id: string,
    label: string
}
export interface KioskUISettings {
    menu?: Menu
    landingPage?: LandingPage[]
    timer?: Timer,
    dineType?: DineType,
    theme?: ITheme,
    environment?: string,
    autoCartOpen?: IMiscSettings,
    wallpaper?: IMiscSettings
    showInstructions?: IMiscSettings
    [key: string]: unknown
}

export interface ITheme {
    default: string,
    switchThemes: boolean,
    colors: IColorTheme,
    darkPalette: IPaletteTheme,
    lightPalette: IPaletteTheme
}
export interface IColorTheme {
    light: Theme
    dark: Theme
}

export interface IMiscSettings {
    isEnabled: DineType
}

export interface IPaletteTheme {
    themeType: string
    themeName: string
    colors: Theme
    _id: string
    typeId: string
}
export interface Theme {
    primary: string
    secondary: string
    accent: string
    background: string
}




export interface DineType {
    dineIn: DineValue
    dineOut: DineValue
}

export interface DineValue {
    enabled: boolean
}
export interface Timer {
    headers: string[]
    payment: TimerTime
    popup: TimerTime
    global: TimerTime
}

export interface TimerTime {
    value: number
    unit: string
}
export interface Menu {
    initialState: MenuInitialState
}

export interface MenuInitialState {
    status: string
    accordionState: string
}
export interface LandingPage {
    name: string
    status: boolean
}

export interface InventoryManagement {
    stockCheck: boolean
    minThresholdNotifier: number
}

export interface Payment {
    paymentModes: string[]
    gatewayList?: { name: string; label: string }[]
}

export interface AutoPrint {
    invoice: boolean
    token: boolean
}

export interface IAssignmentSettins {
    enabled: boolean;
    window: Window[]
}


export interface Window {
    start: Start
    end: End
}

export interface Start {
    h: number
    m: number
    ampm?: string
}

export interface End {
    h: number
    m: number
    ampm?: string

}


export interface IPayloadForDelinkingSlots {
    assetIds: string[]
    assetType: string
    slots: Slots
}

export interface Slots {
    days: string[]
    timeSlots: TimeSlot[]
}

export interface TimeSlot {
    start: Start
    end: End
}

export interface Start {
    h: number
    m: number
}

export interface End {
    h: number
    m: number
}

export interface GatewayList {
    name: string; label: string
}

export interface RazorPay {
    apiKey: string;
    customer_id: string,
    linkedAccount: string,
    _id: string
}

export interface RazorPayConfig {
    key: string,
    name: string,
    description: string,
    image: string,
    amount: string,
    currency: string,
    order_id: string,
    handler: unknown,
    modal: {
        backdropclose: boolean,
        ondismiss: unknown,
        animation: boolean,
    },
    notes: {
        orderId: string,
        payment_id: string,
        accountId: string,
        orderDocId: string,
        customerId: string,
        linkedAccount: string,
        env: string
    },
    theme: {
        color: string
    }
}



export interface IKisoskSettingsMetaDataWithHeader {
    headers: string[];
}

export interface DynamicKeys {
    [key: string]: MetaRootType;
}

export type IKisoskSettingsMetaData = IKisoskSettingsMetaDataWithHeader & DynamicKeys;

export interface IKioskMetaDataSettingWithGroup {
    [key: string]: IKisoskSettingsMetaData
}

export interface IGroupsOfKioskSettingsWithModule {
    settings: IGroupsOfKioskSettingsWithModuleSettings[]
}
export interface IGroupsOfKioskSettingsWithModuleSettings {
    id: string
    label: string
}

export interface MetaRootType {
    id: string
    label: string
    headers?: []
    actions: Action[]
    type: string
    typeId: string
    groupType: string
}



export interface Action {
    id: string
    label: string
    type: string
    subActions: SubAction[]
    data?: accordianData[]
    dropDownValues?: DropDownValue[]
    apiDetails?: ApiDetails
    inputType?: string
    selectType?: string
    isDynamic?: boolean
    dataKey?: string
}


export interface DropDownValue {
    id: string
    label: string
}

export interface ApiDetails {
    url: string
    method: string
}
export interface accordianData {
    id: string
    label: string
    type: string
    subActions: SubAction[]
}

export interface SubAction {
    dropDownValues: any[];
    isDynamic: any;
    id: string
    label: string
    type: string
    inputType: string
}

export interface IKioskTableFormSettings {
    [key: string]: IRootType
}

export interface IRootType {
    isEnabled?: boolean
    showDefault?: boolean
}


export type KAgent = KAgentObj[]

export interface KAgentObj {
    _id: string
    machineId: string
    kiosk: Kiosk,
    machineName: string,
    lastStatusUpdate: string,
    online?: boolean,
    lastSeen: string,
    allIps?: [],
    systemInfo?: ISystemInfo
}

export interface ISystemInfo {
    operatingSystem?: string,
    kernel?: string,
    architecture?: string,
    hardwareVendor?: string,
    hardwareModel?: string,
    firmwareVersion?: string
}

export interface Kiosk {
    _id: string
    assetType: string
    name: string
    lPin: string
    store: string
    showInSuperKiosk: string
    emails: any
    accountId: string
    updated: string
    created: string
    __v: number
}

export type AvailableKiosks = Kiosks[]

export interface Kiosks {
    _id: string
    assetType: string
    name: string
    lPin: string
    store: string
    showInSuperKiosk: string
    emails: any
    accountId: string
    updated: string
    created: string
    __v: number
    groups: any[]
    assetsLinked: any[]
    serviceAssets: any[]
}

export interface QrRes {
    id: string;
    type: string;
    category: string;
    paymentGateway: string;
    orderId: string;
    accountId: string;
    image_url: string;
    created_at: number;
    amount: number;
    orderDocId: string;
    paymentStatus: string;
    data: string
}

export interface IStoreProductWindowAssignmentPayload {
    assetIds: string[]
    assetType: string
    days: string[]
    timeSlots: Slot[]
}

export interface Slot {
    start: Start
    end: End
}

export interface Start {
    h: number
    m: number
}

export interface End {
    h: number
    m: number
}


// categories table
export interface IKioskCategory {
    category: Category
    metaInfo?: MetaInfo
}

export interface Category {
    _id: string
    name: string
    description?: string
}

export interface MetaInfo {
    status?: boolean
    sequence?: number
}

export interface PosData {
    posId: string,
    posData: InnerPosData
    _id: string
}

export interface InnerPosData {
    canReceivePayment: boolean,
    area: string,
    isPrintable: boolean
}

export interface Image {
    baseUrl: string;
    imageBasePath: string;
}


export interface IProductData {
    metaInfo: {
        itemName: string;
        price: number;
        outOfStockStatus: boolean;
        categoryIds: string;
        groups?: string[];
    };
    productInfo: {
        _id: string;
        image: {
            baseUrl: string;
            imageBasePath: string;
        };
    };
    imageURL?: string;
    qty?: number;
    idx?: number;
}

export interface CategoryInfo {
    _id: string;
    name: string;
    sequence: number;
    image: {
        baseUrl: string;
        imageBasePath: string;
    };
}

export interface ICategoryData {
    _id: string;
    productsCount: number;
    products: IProductData[];
    categoryInfo: CategoryInfo;
    outOfStockStatus: boolean;
}

export interface IQuantityStatus {
    status: boolean | null;
    statusMsg?: string;
}

export interface IGroupData {
    _id: string;
    label: string;
    color: string;
    assetTypes: string[];
    sequence: number;
    accountId: string;
    updated: string;
    __v: number;
}

export interface Message {
    severity?: string;
    summary?: string;
    detail?: string;
    id?: any;
    key?: string;
    life?: number;
    sticky?: boolean;
    closable?: boolean;
    data?: any;
    icon?: string;
    contentStyleClass?: string;
    styleClass?: string;
    closeIcon?: string;
}

export interface Response {
    msg?: string
}
export interface ICategoryMetaInfoPayload {
    categoryIds: string[]
    metaInfo?: MetaInfo
}

export interface ICategorySequencePayloadStoreLevel {
    sequence: Sequence[]
}

export interface Sequence {
    assetId: string
    sequence: number
}

export interface IStoreCategoryUpdatePayload {
    categoryIds: string[]
    metaInfoObj: MetaInfoObj
}

export interface MetaInfoObj {
    status: boolean
}

export interface Account {
    _id: string
    title: string
    name: string
    organization: string
    address: string
    assetTypes: string[]
    timezone: string
    language: string
    show: boolean
    updated: string
    created: string
    __v: number
    images: Images
    roles: string[]
    label?: string
    roleId: string

    [key: string]: unknown
}

export interface Images {
    logo: Logo
}


export interface Logo {
    data: string
    contentType: string
    razorpayDisplayUrl?: string
}

export interface IPayByCashCartParam {
    amount: number,
    pMode: string,
}


export interface GeoFenceObject {
    location: Location;
    _id: string;
    assetId: string;
    __v: number;
    accountId: string;
    autoGenerated: boolean;
    created: Date;
    geoLocation: GeoLocation;
    label: string;
    radius: number;
    updated: Date;
    count: number;
}
