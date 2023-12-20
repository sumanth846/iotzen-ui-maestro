import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from '../../../../src/app/services/search-service.service';
import moment from 'moment-timezone';
import { Subscription, Observable } from 'rxjs';
import { CONSTANT } from '../../../../src/app/constant';
import { KioskActions, KioskSelectors } from 'src/app/state/kiosk';
import { KioskStore } from 'src/app/interface/maestro-interface';
import { KioskOrderService } from 'src/app/services/kiosk-order-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as _ from 'lodash';
import { Store, select } from '@ngrx/store';
import { KioskStoreService } from 'src/app/services/kiosk.store.service';
import { ICategoryData, IProductData, PosData, IOrderPageLayout, IPayByCashCartParam, KioskSettings } from 'src/app/interface/maestro-interface';
import { AppState } from 'src/app/state/app.state';
import { getMaestroInfoData, verificationProcess } from 'src/app/state/kiosk/kiosk.selector';
import { getMaestroAreas, getMaestroInfo } from 'src/app/state/kiosk/kiosk.action';
import { epsonPrint } from 'src/app/services/epson.printer';
import { KioskAnalyticsService } from 'src/app/services/kiosk.analytics.service';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TableModule } from 'primeng/table';
import { CartCardComponent } from '../cart-card/cart-card.component';
import { PaymentGatewayComponent } from '../payment-gateway/payment-gateway.component';

// import { SocketActions } from '../../../../state/Socket';
// import { getAccountFromLoginResponse } from '../../../../state/Login/login.selector';
// import { Actions, Subject } from '../../../../auth/rules';
// import { LoginSelectors } from '../../../../state/Login';
declare let $: any;
const KIOSK_STORE_LOCATION = CONSTANT.KIOSK.STORE_lOCATION;
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchBoxComponent } from '../search-box/search-box.component';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { SplitterModule } from 'primeng/splitter';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { LoaderComponent } from '../loader/loader.component';
import { OrderCardComponent } from '../order-card-component/order-card-component.component';
import { SokPrintModalComponent } from '../sok-print-modal-component/sok-print-modal-component.component';

@Component({
  selector: 'app-maestro-page',
  standalone: true,
  imports: [DialogModule, PaymentGatewayComponent, OrderCardComponent, SokPrintModalComponent, LoaderComponent, ToastModule, PaginatorModule, CartCardComponent, SplitterModule, SelectButtonModule, CommonModule, FormsModule, TooltipModule, SearchBoxComponent, OverlayPanelModule, ButtonModule, ConfirmPopupModule, TableModule, AccordionModule],
  providers: [MessageService, SearchService, ConfirmationService],
  templateUrl: './maestro-page.component.html',
  styleUrl: './maestro-page.component.scss'
})
export class MaestroPageComponent implements OnInit, OnDestroy {
  outOfStockMssg: string;
  outOfStockTitle: string;
  recieptImgURL: string;
  orderSummaryImgURL: string;
  sessionStorageName = CONSTANT.TABLE_SESSION_NAME.KIOSK.ORDER;
  // @ViewChild('tableSwitch') tableSwitch!: OverlayPanel;
  iotZenPosStore = CONSTANT.SOCKET.POS.NAMESPACE.POSSTORE
  iotZenPosSettings = CONSTANT.SOCKET.POS.NAMESPACE.POSSETIINGS;
  iotZenPosPayment = CONSTANT.SOCKET.POS.NAMESPACE.POSPAYMENT;
  reloadAgainState: boolean
  stateOptions: any[] = [

  ];
  viewOption: any[] = [
    { label: 'Rich', value: 'rich' },
    { label: 'Simple', value: 'simple' }
  ];
  orderPageLayout: IOrderPageLayout = undefined
  layoutt = '';
  panelSize: number[];
  cartPositionVal = '';
  catPositionVal = '';
  SelectBtnValue: string = '';
  SelectedViewValue: string = 'rich';
  cols = [
    { field: 'item', header: 'Item' },
    { field: 'quantity', header: 'Qty' },
    // { field: 'price', header: 'Price' },
    { field: 'amount', header: 'Amount' },
    { field: 'remove', header: 'Remove' },
  ];

  orderDetailsPrintPageTable = [
    { field: '#', header: '#' },
    { field: 'item', header: 'Item' },
    { field: 'quantity', header: 'Qty' },
    { field: 'amount', header: 'Amount' },
  ];

  showOutOfStock = false;
  private searchTextSub: Subscription;
  public searchForAssignmentText = '';
  showLoader: boolean;
  kioskSettings: KioskSettings = null;
  storelist: KioskStore[] = undefined;
  productSubscription: Subscription[] = [];
  displayPayementStatusModal = {
    visibility: false,
    orderId: "0",
    id: null,
    amt: 0,
    accountId: null,
  };

  showAddOrdersModal = true;
  showwallpaper = true;
  current_branch: any;

  allAvailableCategories$: Observable<ICategoryData[]> = this.store.select(KioskSelectors.getAvailableCategories);
  allAvailableProducts$: Observable<IProductData[]> = this.store.select(KioskSelectors.getAvailableProducts);
  sentKitchendData$ = this.store.select(KioskSelectors.getKitchenSentData);
  // isInternetConnected$ = this.store.select(LoginSelectors.getInternetConnectivityState);
  maestroAreaData;
  currentFloor: string;
  currentTableId: string;
  defaultFloorId: string;

  cartItems$: Observable<IProductData[]> = this.store.select(KioskSelectors.getCartItems);
  cartLength$: Observable<number> = this.store.select(KioskSelectors.getCartLength)

  private quantityStatusSubscription$: Subscription;
  private cartItemsSubscription$: Subscription;


  searchedProduct = '';
  categoryIdStr: any = undefined;
  groupIdStr: any = undefined;
  cartOrderId: any = undefined;
  selectedOrderId: string;
  selectedCartItem: any;
  proceedToBill = false;
  showQrScanner = {
    visibility: false,
    src: '',
  };
  checkPaymentStatusInterval: any;
  paymentIsSuccessfull = false;
  showTaxDetails = false;
  // recieptItems: any;
  todayDate = new Date().toLocaleDateString('en-IN');
  selectedCategoryIdx = -1;
  cartTax: any = [];
  showCashModal = false;
  showLinkModal = false;
  showRefundModal = false;
  amountToGiveBack = 0;
  amountReceived = 0;
  amountToBePaid = 0;
  updatePaymentOrderId: any = '';
  incrementCartQtyInterval: any;
  decrementCartQtyInterval: any;
  rzPaymentId: any = '';
  carItemPrice: number;
  tableCartItems: any[] = [];
  // paymentOptionsFromSettingsCopy: string[];
  // paymentOptionsFromSettings: string[] = ['cash', 'online', 'Pay Via Link'];
  // paymentOptionsFromSettingsCopy: string[];
  currentOrderPaid = false;
  accountID: string
  displayReciept = false;
  customerEmail: string = '';
  validCustomerEmail = false;
  displayRecieptPreview = false;
  verificationDone$ = this.store.pipe(select(verificationProcess));
  // showOtherPaymentMethodsFlag: boolean = false;
  occupiedTableData: any;
  showTableModal: boolean = false;
  showTaxBreakup: boolean = false;
  showEditOrderOption: boolean = false;
  selectedTableData: any;
  showSelectedTableData: any;
  showtableData: boolean = false;
  selectedCategoryData: ICategoryData;
  TaxBreakupDetails: any;
  showCardModal: boolean = false;
  placeholderValue = '';
  cartItemData: any;
  isSocketFlag = false
  isSocketEnabled: boolean
  isReloadModalVisible: boolean = false
  subOrderData: any[];
  currentTableOrderDocId: string;
  selectedOrderTypeValue: string = '';
  showWarningBorder: boolean = false;
  posMachineID: string
  // ACTIONS = Actions;
  // SUBJECT = Subject;
  selectorGetPosID$: Subscription
  salesModal = {
    header: '',
    displayModal: false,
    tabledata: [],
    pagination: {
      currentPage: 1,
      totalNoOfRecords: 0,
      recordsPerPage: 20,
      pageCountValue: 0,
      index: 0,
      pageNumber: 1,
      noOfPagesList: 1,
    },
    tableApiData: {},
    maestroStoreId: null,
    appLoader: false
  }
  isSwitchTable = false;
  activeIndex: number[] = [];
  maestroInfoData: PosData;
  constructor(
    private mssgService: MessageService,
    private searchService: SearchService,
    // public dateFormatter: DateFormatterService,
    // public O2dAssignmentService: O2dAssignmentService,
    private store: Store<AppState>,
    private kioskService: KioskStoreService,
    private kioskOrderService: KioskOrderService,
    private analyticsService: KioskAnalyticsService,
    private confirmationService: ConfirmationService,
  ) {
    this.doSearchTextResetAndOtherOperations();
    this.store.dispatch(KioskActions.loadBranchList());
    this.loadRzpScript();
  }

  /**
   * Event listener triggered when the window is resized.
   * Recalculates the window width and updates the seen order table header array accordingly.
   * @param {Event} event - The resize event object.
   */
  // @HostListener('window:resize', ['$event'])



  ngOnInit(): void {

    this.store.dispatch(getMaestroInfo());

    this.selectorGetPosID$ = this.store.select(getMaestroInfoData).subscribe((d) => {
      this.maestroInfoData = d;
      if (d?._id) {
        this.salesModal.maestroStoreId = d?._id;
      }
      if (d?.posData?.area) {
        this.defaultFloorId = d?.posData?.area;
        this.currentFloor = this.defaultFloorId;
      }
      if (d?.posId) {
        this.posMachineID = d?.posId
        // this.store.dispatch(SocketActions.updateSocketDataRequired({
        //   nameSpace: this.iotZenPosPayment + d?.posId,
        //   topicName: CONSTANT.SOCKET.POS.TOPICNAME.POSPAYMENT,
        //   key: CONSTANT.SOCKET.POS.KEY.POSPAYMENT,
        //   callback: this.iotZenPosStorePaymentCallBAck,
        // }));
      }
    })

    // this.store.select(getMaestroStoreID).subscribe((id)=>{
    //   if(id){
    //     this.salesModal.maestroStoreId = id;
    //   }
    // })

    // this.store.select(getCurrentFLoor).subscribe((v)=>{
    //   if(v){
    //     this.defaultFloorId = v;
    //     this.currentFloor = this.defaultFloorId;
    //   }
    // })

    this.showLoader = true
    this.store.dispatch(getMaestroAreas())
    this.showTaxDetails = false;
    if (localStorage.getItem('kiosk-order-view') !== null) {
      this.SelectedViewValue = localStorage.getItem('kiosk-order-view');
    } else {
      localStorage.setItem('kiosk-order-view', 'simple');
    }
    this.resetCartValues(true);
    this.store.dispatch(KioskActions.getCategories())
    // this.store.dispatch(KioskActions.getRazorpayData());
    this.productSubscription
      .push(this.store.select(KioskSelectors.getBranchList).subscribe(
        async (branches) => {
          if (branches && this.storelist === undefined && branches.length > 0) {
            // this.loading = false;
            this.storelist = branches;
            // this.dropdownBtnConfig = this.storelist;
            const currenLocalStorageBranch = JSON.parse(localStorage.getItem(KIOSK_STORE_LOCATION))

            if (currenLocalStorageBranch) {
              if (this.current_branch !== null || this.current_branch !== undefined) {

                this.current_branch = this.storelist.find((obj) => obj._id === currenLocalStorageBranch?.['_id']);
                if (!this.current_branch) {
                  this.current_branch = this.storelist[0];
                }
                localStorage.setItem(KIOSK_STORE_LOCATION, JSON.stringify(this.current_branch));
                // this.selectedCityName = this.current_branch;
                // this.selectCityId = this.current_branch?.["_id"];
              }
            }
            else {
              this.current_branch = this.storelist[0];
              localStorage.setItem(KIOSK_STORE_LOCATION, JSON.stringify(this.storelist[0]));
            }
            this.store.dispatch(KioskActions.currentBranch({ currentBranch: this.current_branch }));
            // this.setTotalOrderCount();
            if (this.current_branch && !this.isSocketFlag) {
              this.isSocketFlag = true;
              // this.store.dispatch(SocketActions.updateSocketDataRequired({
              //   nameSpace: this.iotZenPosStore + this.current_branch?._id,
              //   topicName: CONSTANT.SOCKET.POS.TOPICNAME.POSSTORE,
              //   key: CONSTANT.SOCKET.POS.KEY.POSSTORE,
              //   callback: this.iotZenPosStoreCallBAck,
              // }));
            }
          }
        })
      )
    // this.store.select(getAccountFromLoginResponse).subscribe((el) => {
    //   if (el?._id) {
    //     this.accountID = el?._id
    //     this.store.dispatch(SocketActions.updateSocketDataRequired({
    //       nameSpace: this.iotZenPosSettings + el?._id,
    //       topicName: CONSTANT.SOCKET.POS.TOPICNAME.POSSETTINGS,
    //       key: CONSTANT.SOCKET.POS.KEY.POSSETTINGS,
    //       callback: this.iotZenPosStoreSettingsCallBAck,
    //     }));
    //   }
    // })

    // 
    this.store.dispatch(KioskActions.getLayoutKioskOrderPage());
    this.store.dispatch(KioskActions.getProductGroups());
    this.searchTextSub = this.searchService.searchText.subscribe(event => {
      if (event && event['id'] === 'unlinked-product') {
        if (event.text === '' && !this.searchedProduct)
          return;
        this.searchedProduct = (event && event.text && event.text.trim().length > 0) ? event.text : '';

        if (typeof this.searchedProduct === 'string') {
          //this.searchProductsData(this.searchedProduct)
        }
      }
    });

    this.productSubscription.push(this.store.select(KioskSelectors.getKioskSettings).subscribe((settings: KioskSettings) => {
      if (settings) {
        this.isSocketEnabled = this.kioskSettings?.posUISettings?.isSocketEnabled
        this.kioskSettings = settings;
        this.cartPositionVal = this.kioskSettings?.posUISettings?.layout?.cart || 'cartLeft';
        this.catPositionVal = this.kioskSettings?.posUISettings?.layout?.category || 'catBottom';
        this.kioskSettings?.posUISettings?.dineType?.['otherServices'] && this.getAdditionalDineServices();
        if (this.kioskSettings?.posUISettings?.dineType?.dineIn) {
          let item = { label: 'app.pos.dineIn', value: 'dineIn' }
          const isValueExist = this.stateOptions.some(option => option.value === item.value);
          if (!isValueExist) {
            this.stateOptions.push(item)
          }
        }
        if (this.kioskSettings?.posUISettings?.dineType?.dineOut && this.stateOptions?.length < 3) {
          let item = { label: 'app.pos.dineOut', value: 'dineOut' }
          const isValueExist = this.stateOptions.some(option => option?.value === item?.value);
          if (!isValueExist) {
            this.stateOptions.push(item)
          }
        }
        if (this.kioskSettings?.posUISettings?.dineType?.table) {
          let item = { label: 'app.pos.table', value: 'table' }
          const isValueExist = this.stateOptions.some(option => option?.value === item?.value);
          if (!isValueExist) {
            this.stateOptions.push(item)
          }
        }
        if (this.catPositionVal === 'catLeft') {
          this.layoutt = 'horizontal';
          this.panelSize = [30, 70]
        } else {
          this.layoutt = 'vertical';
          this.panelSize = [70, 30]
        }
        this.orderPageLayout = this.kioskSettings?.orderPageLayout;
      } else {
        this.store.dispatch(KioskActions.getKioskSettingsByModule({ settingsType: 'All' }))
      }
      if (!settings?.orderPageLayout) {
        this.store.dispatch(KioskActions.getLayoutKioskOrderPage());
      }
    }))
    this.store.select(KioskSelectors.getMaestroAreas).subscribe((v) => {
      if (v) {
        this.maestroAreaData = v;
        if (!this.defaultFloorId) {
          this.defaultFloorId = v[0]?._id;
          this.currentFloor = this.defaultFloorId;
        }
        if (this.currentFloor) {
          this.getTablesWithFloorId();
        }
      }
    })
    this.showLoader = false;

  }

  iotZenPosStoreCallBAck = (data) => {
    if (data && this.showwallpaper) {
      this.reloadAgainState = true
      // this.store.dispatch(KioskActions.getCategories())
    } else {
      this.isReloadModalVisible = true
    }
  }
  iotZenPosStoreSettingsCallBAck = (data) => {
    if (data && this.showwallpaper) {
      this.reloadAgainState = true
      // this.store.dispatch(KioskActions.getKioskSettingsByModuleForSocket({ settingsType: 'All' }))
    } else {
      this.isReloadModalVisible = true
    }
  }

  iotZenPosStorePaymentCallBAck = (data) => {
    if (data && this.showTableModal && !this.currentTableOrderDocId) {
      this.getTablesWithFloorId()
    }
    if (data && this.currentTableOrderDocId) {
      if (data['orderDocId'] == this.currentTableOrderDocId) {
        this.resetCartValues(true)
        this.subOrderData = []
        this.tableCartItems = []
        this.cartOrderId = null
        this.showwallpaper = true;
        this.getTablesWithFloorId()
      }

    }
  }

  reloadApplication() {
    window.location.reload()
  }
  isRzpScriptAdded(): boolean {
    return Boolean(document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]'));
  }

  loadRzpScript() {
    // if (this.isRzpScriptAdded()) {
    //   return;
    // }
    // const rzpScript = document.createElement('script');
    // rzpScript.type = 'text/javascript';
    // rzpScript.async = true;
    // rzpScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
    // document.body.appendChild(rzpScript);
  }


  // closeRefundModal(){
  //   this.showRefundModal = false;
  // }


  removeCartItem(_id: string) {
    this.store.dispatch(KioskActions.removeCartItem({ _id, isTable: this.showtableData }));
    if (this.showtableData) {
      const obj = {
        _id: _id,
        remove: true
      }
      this.updateTableData(obj);
    }

    this.showTaxBreakup = false
  }
  resetCartValues(modalOpen?: boolean) {
    this.showTaxBreakup = false;
    if (this.showtableData) {
      this.tableCartItems = [];
    }
    this.store.dispatch(KioskActions.resetCartValues({ modalOpen }));
  }

  setSelectedCartItem(item) {
    this.selectedCartItem = item;
  }

  toggleTaxDetails() {
    this.showTaxDetails = !this.showTaxDetails;
  }

  getSelectedCategory(data, idx, catData) {
    this.searchService.resetSearchTextInSearchBox();
    this.categoryIdStr = "";
    if (this.selectedCategoryIdx === idx) {
      this.selectedCategoryData = { ...this.selectedCategoryData, _id: '' }
      this.selectedCategoryIdx = -1;
    } else {
      this.selectedCategoryData = catData;
      this.categoryIdStr = data;
      this.selectedCategoryIdx = idx;
      this.groupIdStr = ''
    }
  }


  redirectToProducts() {
    this.proceedToBill = false
    this.searchedProduct = undefined
  }


  incrementCartQty(product: IProductData) {
    const storeId = this.current_branch['_id'];
    const productArray = [{ '_id': '', 'quantity': 0 }];
    this.showTaxDetails = false;
    productArray[0]._id = product.productInfo._id;
    productArray[0].quantity = product.qty + 1;
    this.outOfStockTitle = 'Can\'t add more !';
    if (this.kioskSettings?.inventoryManagement?.stockCheck) {
      this.store.dispatch(KioskActions.quantityCheck({ productArray, storeId }));
      this.quantityStatusSubscription$ = this.store
        .select(KioskSelectors.getQuantityStatus)
        .subscribe((quantityStatus) => {
          if (quantityStatus.status) {
            if (this.incrementCartQtyInterval) {
              clearTimeout(this.incrementCartQtyInterval);
            }
            this.store.dispatch(KioskActions.incrementQtyViaProduct({ product, isTable: this.showtableData }))
            if (this.showtableData) {
              const obj = {
                item: product,
                increase: true
              }
              this.updateTableData(obj)
            }
            this.selectedCartItem = this.selectedCartItem ? {
              ...this.selectedCartItem,
              qty: this.selectedCartItem.qty + 1,
            } : this.selectedCartItem;
            //   this.incrementCartQtyInterval = setTimeout(()=>{
            //   // if(this.proceedToBill)
            //     // this.checkoutCart();
            // },2500);
          }
          else if (quantityStatus.status === false) {
            this.outOfStockMssg = quantityStatus.statusMsg;
            this.showOutOfStock = true;
          }
          this.quantityStatusSubscription$?.unsubscribe();
          quantityStatus.status !== null &&
            this.store.dispatch(KioskActions.quantityCheckDataReset());
        });
    } else {
      this.store.dispatch(KioskActions.incrementQtyViaProduct({ product, isTable: this.showtableData }));
      if (this.showtableData) {
        const obj = {
          item: product,
          increase: true
        }
        this.updateTableData(obj)
      }
      this.selectedCartItem = this.selectedCartItem ? {
        ...this.selectedCartItem,
        qty: this.selectedCartItem.qty + 1,
      } : this.selectedCartItem;
      // this.incrementCartQtyInterval = setTimeout(()=>{
      // },2500);
    }
    if (this.showTaxBreakup) {
      this.showTaxBreakup = false;
    }
  }

  decrementCartQty(product: any) {
    if (!product.qty) return;
    this.showTaxDetails = false;
    if (this.decrementCartQtyInterval)
      clearTimeout(this.decrementCartQtyInterval);
    this.store.dispatch(KioskActions.decrementQtyViaProduct({ product, isTable: this.showtableData }));
    if (this.showtableData) {
      const obj = {
        item: product,
        increase: false
      }
      this.updateTableData(obj)
    }
    this.selectedCartItem = this.selectedCartItem ? {
      ...this.selectedCartItem,
      qty: this.selectedCartItem.qty - 1,
    } : this.selectedCartItem;
    // this.decrementCartQtyInterval = setTimeout(() => {
    //   // if (this.proceedToBill) this.checkoutCart();
    // }, 2500);

    // let cartItemsCopy:IProductData[] = [];
    this.cartItemsSubscription$ = this.cartItems$.subscribe((data: IProductData[]) => {
      // this.cartItemData = data;
      // cartItemsCopy = data?.filter((item:IProductData) => {
      //   return item["qty"] > 0;
      // });  
      this.cartItemsSubscription$?.unsubscribe()
      !data.length && this.redirectToProducts()
    });
    // if (cartItemsCopy.length === 0) {
    //   if (this.cartOrderId?._id) {
    //     this.kioskOrderService
    //       .discardOrderId(this.cartOrderId?._id, "checkout-view")
    //       .subscribe(() => {
    //       },()=> this.showLoader = false);
    //   }
    // }
    if (this.showTaxBreakup) {
      this.showTaxBreakup = false;
      // this.checkoutCart();
    }
  }
  updateShowTaxBreakup(event) {
    this.showTaxBreakup = event;
  }


  ngOnDestroy() {
    this.selectorGetPosID$?.unsubscribe()
    this.searchTextSub?.unsubscribe();
    this.searchService.showSearchBar(false);
    this.quantityStatusSubscription$?.unsubscribe();
    this.cartItemsSubscription$?.unsubscribe()
    // this.store.dispatch(SocketActions.disconnect({
    //   nsp: this.iotZenPosStore + this.current_branch?.id,
    //   topic: CONSTANT.SOCKET.POS.TOPICNAME.POSSTORE,
    //   key: CONSTANT.SOCKET.POS.KEY.POSSTORE,
    // }))
    // this.store.dispatch(SocketActions.disconnect({
    //   nsp: this.iotZenPosSettings + this.accountID,
    //   topic: CONSTANT.SOCKET.POS.TOPICNAME.POSSETTINGS,
    //   key: CONSTANT.SOCKET.POS.KEY.POSSETTINGS,
    // }))
    // this.store.dispatch(SocketActions.disconnect({
    //   nsp: this.iotZenPosPayment + this.posMachineID,
    //   topic: CONSTANT.SOCKET.POS.TOPICNAME.POSPAYMENT,
    //   key: CONSTANT.SOCKET.POS.KEY.POSPAYMENT
    // }));
  }

  private doSearchTextResetAndOtherOperations() {
    this.searchService.showSearchBar(true);
    this.searchService.resetSearchTextInSearchBox();
    this.searchService.sendSearchText("");
    if (window.innerWidth >= 600 && window.innerWidth <= 900) {
      this.placeholderValue = 'Search';
    } else {
      this.placeholderValue = 'Search for Product';
    }
    this.searchService.sendSearchPlaceholderValue("Search");
  }

  getTotalTax() {
    let totalTax = 0;
    this.cartOrderId?.payment?.price?.tax?.forEach((o) => {
      totalTax += o.amt;
    })

    return totalTax.toFixed(2);
  }



  checkoutCart() {
    if (!this.tableCartItems?.length) {
      this.showWarningBorder = false;
      this.outOfStockTitle = 'Can\'t proceed for checkout !';
      const storeId = this.current_branch['_id'];
      let productArray = [];

      let cartItemsCopy: IProductData[] = []
      this.cartItemsSubscription$ = this.cartItems$
        .subscribe((data: IProductData[]) => {
          cartItemsCopy = data?.filter((item: IProductData) => {
            return item['qty'] > 0;
          });
          this.cartItemsSubscription$?.unsubscribe()
        });

      if (!this.subOrderData?.length) {
        for (let idx = 0; idx < cartItemsCopy.length; idx++) {
          productArray[idx] = { '_id': cartItemsCopy[idx].productInfo._id, 'quantity': cartItemsCopy[idx].qty };
        }
      }

      if (this.subOrderData?.length) {
        productArray = this.getProductPayloadForTable();
      }


      if (this.kioskSettings?.inventoryManagement?.stockCheck) {
        this.store.dispatch(KioskActions.quantityCheck({ productArray, storeId }));
        this.quantityStatusSubscription$ = this.store
          .select(KioskSelectors.getQuantityStatus)
          .subscribe((quantityStatus) => {
            if (quantityStatus.status) {
              this.showLoader = true;
              let products = [];
              this.cartItemsSubscription$ = this.cartItems$
                .subscribe((data: IProductData[]) => {
                  data?.forEach((item: IProductData) => {
                    if ((item['qty'] > 0) && !this.subOrderData?.length) {
                      products.push({
                        "_id": item['productInfo']['_id'],
                        "quantity": item['qty']
                      });
                    }
                    if (this.subOrderData?.length) {
                      products = productArray;
                    }
                  })
                  this.cartItemsSubscription$?.unsubscribe()
                });
              this.showTaxBreakup = true;
              const obj = {
                dineType: this.SelectBtnValue,
                tableNo: this.showSelectedTableData?.tableNo ?? 0,
                isTableOrder: this.showSelectedTableData?.tableNo ? true : false,
              }
              if (this.showSelectedTableData?.orderData) {
                if (!products?.length && this.subOrderData?.length) {

                  products = this.getProductPayloadForTable()
                }
                this.kioskOrderService.checkoutUpdatedCartOrders(this.showSelectedTableData?.orderData['_id'], products, this.current_branch['_id'], obj).subscribe((data) => {
                  this.cartOrderId = data;
                  this.cartTax = this.cartOrderId?.payment?.price?.tax;
                  this.amountToBePaid = this.cartOrderId?.payment?.price?.total;
                  this.proceedToBill = true;
                  this.showLoader = false;
                  // this.kioskOrderService.initiatePayment(data['_id']).subscribe((res)=>{
                  //   this.proceedToBill = true;

                  //   this.showLoader = false;
                  //   this.rzPaymentId = res['paymentGateway']['id'];
                  // }, ()=>{this.showLoader = false})
                }, () => this.showLoader = false);
              }
              else {
                if (!products?.length && this.subOrderData?.length) {

                  products = this.getProductPayloadForTable()
                }
                this.kioskOrderService.checkoutCartOrders(products, this.current_branch['_id'], obj).subscribe((data) => {
                  this.cartOrderId = data;
                  this.cartTax = this.cartOrderId?.payment?.price?.tax;
                  this.amountToBePaid = this.cartOrderId?.payment?.price?.total; ///
                  this.updatePaymentOrderId = this.cartOrderId['_id'];
                  this.proceedToBill = true;
                  this.showLoader = false;
                  // this.kioskOrderService.initiatePayment(data['_id']).subscribe((res)=>{
                  //   this.proceedToBill = true;
                  //   this.showLoader = false;
                  //   // if(res['paymentGateway']['id'])
                  //     this.rzPaymentId = res['paymentGateway']['id'];
                  // }, ()=>{this.showLoader = false})
                }, () => { this.showLoader = false });
              }
            }
            else if (quantityStatus.status === false) {
              this.outOfStockMssg = quantityStatus.statusMsg;
              this.showOutOfStock = true;
            }
            this.quantityStatusSubscription$?.unsubscribe();
            quantityStatus.status !== null &&
              this.store.dispatch(KioskActions.quantityCheckDataReset());
          });
      } else {
        this.showLoader = true;
        let products = [];
        this.cartItemsSubscription$ = this.cartItems$
          .subscribe((data: IProductData[]) => {
            data?.forEach((item: IProductData) => {
              if (item['qty'] > 0 && !this.subOrderData?.length) {
                products.push({
                  "_id": item['productInfo']['_id'],
                  "quantity": item['qty']
                });
              }
              if (this.subOrderData?.length) {
                products = productArray;
              }
            })
            this.cartItemsSubscription$?.unsubscribe()
          });
        this.showTaxBreakup = true;
        const obj = {
          dineType: this.SelectBtnValue,
          tableNo: this.showSelectedTableData?.tableNo ?? 0,
          isTableOrder: this.showSelectedTableData?.tableNo ? true : false,
        }
        if (this.cartOrderId?._id) {
          if (!products?.length && this.subOrderData?.length) {

            products = this.getProductPayloadForTable();
          }
          this.kioskOrderService.checkoutUpdatedCartOrders(this.cartOrderId?._id, products, this.current_branch['_id'], obj).subscribe((data) => {
            this.cartOrderId = data;
            this.cartTax = this.cartOrderId?.payment?.price?.tax;
            this.amountToBePaid = this.cartOrderId?.payment?.price?.total;
            this.proceedToBill = true;
            this.showLoader = false;
          }, () => { this.showLoader = false });
        }
        else {
          if (!products?.length && this.subOrderData.length) {

            products = this.getProductPayloadForTable();
          }
          this.kioskOrderService.checkoutCartOrders(products, this.current_branch['_id'], obj).subscribe((data) => {
            this.cartOrderId = data;

            this.cartTax = this.cartOrderId?.payment?.price?.tax;
            this.amountToBePaid = this.cartOrderId?.payment?.price?.total; ///
            this.updatePaymentOrderId = this.cartOrderId['_id'];
            this.proceedToBill = true;
            this.showLoader = false;
          }, () => { this.showLoader = false });
        }
      }
    }
    else {
      this.showWarningBorder = true;
      setTimeout(() => {
        this.showWarningBorder = false;
      }, 5000)
    }

    this.showLoader = false;
  }

  closeAddOrderModal(modalIsOpen?: boolean) {
    this.showLoader = true;
    this.customerEmail = '';
    this.showSelectedTableData = {};
    // this.SelectBtnValue = 'dineIn'
    this.showtableData = false;
    this.selectedCategoryData = undefined;
    if (!this.currentOrderPaid && this.cartOrderId?._id) {
      this.kioskOrderService.discardOrderId(this.cartOrderId?._id, "checkout-view").subscribe(() => {
        this.searchedProduct = undefined;
        this.categoryIdStr = undefined;
        this.groupIdStr = undefined;
        this.cartOrderId = undefined;
        this.proceedToBill = false;
        this.showQrScanner = {
          visibility: false,
          src: '',
        }
        this.resetCartValues();
        // clearInterval(this.checkPaymentStatusInterval);
        // this.showAddOrdersModal = modalIsOpen? true:false;
        // this.paymentIsSuccessfull = false;
        // this.recieptItems = undefined;
        this.selectedCategoryIdx = -1;
      }, () => {
        this.showLoader = false;
      })
    }
    else {
      this.searchedProduct = undefined;
      this.categoryIdStr = undefined;
      this.groupIdStr = undefined;
      this.cartOrderId = undefined;
      this.proceedToBill = false;
      this.showQrScanner = {
        visibility: false,
        src: '',
      }
      // clearInterval(this.checkPaymentStatusInterval);
      this.resetCartValues()
      this.showAddOrdersModal = modalIsOpen ? true : false;
      // this.paymentIsSuccessfull = false;
      // this.recieptItems = undefined;
      this.selectedCategoryIdx = -1;
    }
    this.showLoader = false;
    this.currentOrderPaid = true;
  }

  closeQRModal() {
    // this.closeRowUpdateCashModal();
    this.showQrScanner.visibility = false;
    clearInterval(this.checkPaymentStatusInterval);
  }

  switchDineType() {
    this.isSwitchTable = false;
    if (!this.showtableData) {
      const dineInOption = this.stateOptions.find(option => option.value === 'dineIn');
      if (dineInOption) {
        this.SelectBtnValue = 'dineIn';
      } else {
        const dineOutOption = this.stateOptions.find(option => option.value === 'dineOut');
        if (dineOutOption) {
          this.SelectBtnValue = 'dineOut';
        } else {
          this.SelectBtnValue = this.selectedOrderTypeValue;
        }
      }
    }
    this.showLoader = false;
  }

  switchTable() {
    this.isSwitchTable = true;
    this.showTableModal = true;
    this.getTablesWithFloorId();
  }
  // orderFulfillFormClosed(){
  //   this.showOrderFulfilmentForm = false;
  // }

  rowUpdateCashModal() {
    this.showCashModal = true;
    this.amountToBePaid = this.displayPayementStatusModal.amt;
    this.updatePaymentOrderId = this.displayPayementStatusModal.id;
  }

  // closeRowUpdateCashModal(){
  //   this.displayPayementStatusModal = {
  //     visibility: false,
  //     orderId: "0",
  //     id: null,
  //     amt: 0,
  //     accountId: null,
  //   };
  //   // this.cartOrderId = undefined;
  // }

  printInvoice(v) {
    this.showLoader = true;
    this.selectedOrderId = v?._id
    this.kioskOrderService.getRecieptContent(v?._id).subscribe((data: any) => {
      if (data) {
        this.showLoader = false;
        this.recieptImgURL = data?.recieptUrl;
        this.displayRecieptPreview = true;
      }
    }, (error: any) => {
      console.log(error);
      this.showLoader = false;
    })

  }


  getCustomerEmail(e) {
    this.customerEmail = e.target.value;
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.customerEmail.match(mailformat)) {
      this.validCustomerEmail = true;
    }
    else {
      this.validCustomerEmail = false;
    }
  }


  printReciept() {
    this.showLoader = true;
    this.selectedOrderId = this.cartOrderId?._id;
    this.kioskOrderService.getRecieptContent(this.cartOrderId?._id).subscribe((data: any) => {
      if (data) {
        this.displayRecieptPreview = true;
        this.recieptImgURL = data?.recieptUrl;
        // this.showLoader = false;
      }
    }, (error: any) => {
      console.log(error);
      this.showLoader = false;
    })
  }

  closeRecieptPreview() {
    this.displayRecieptPreview = false;
  }

  setLoader(v) {
    this.showLoader = v;
  }

  showReciept() {
    this.kioskOrderService.getRecieptContent(this.cartOrderId?._id).subscribe((data: any) => {
      if (data) {
        this.showLoader = true;
        this.recieptImgURL = data?.recieptUrl;
        setTimeout(() => {
          this.showLoader = false;
          this.displayReciept = true;
        }, 500)
      }
    }, (error: any) => {
      console.log(error);
      this.showLoader = false;
    })
  }

  sendRecieptEmail() {
    this.showLoader = true;
    this.kioskOrderService.sendRecieptOnline(this.cartOrderId?._id, this.customerEmail).subscribe(() => {
      // const res = data;
      this.showLoader = false;
      this.mssgService.add({ severity: 'success', key: 'kiosk-order-page', summary: 'Receipt Sent', detail: 'Order receipt is sent to customer email' });
      this.customerEmail = "";

    }, (error) => {
      this.showLoader = false;
      this.mssgService.add({ severity: 'error', key: 'kiosk-order-page', summary: 'Error', detail: 'Failed to send receipt, try again' });
      this.customerEmail = "";
      console.log(error);
    })


  }

  paidByCash() {
    if (this.subOrderData?.length) {
      this.store.dispatch(KioskActions.filledStateWithTableData({ tableData: this.subOrderData }));
    }
    this.outOfStockTitle = 'Can\'t proceed for payment !';
    const storeId = this.current_branch['_id'];
    const productArray = [];
    let cartItemsCopy: IProductData[] = []
    this.cartItemsSubscription$ = this.cartItems$
      .subscribe((data: IProductData[]) => {
        cartItemsCopy = data
        this.cartItemsSubscription$?.unsubscribe()
      });
    for (let idx = 0; idx < cartItemsCopy.length; idx++) {
      productArray[idx] = { '_id': cartItemsCopy[idx].productInfo._id, 'quantity': cartItemsCopy[idx].qty };
    }

    if (this.kioskSettings?.inventoryManagement?.stockCheck) {
      this.store.dispatch(KioskActions.quantityCheck({ productArray, storeId }));
      this.quantityStatusSubscription$ = this.store
        .select(KioskSelectors.getQuantityStatus)
        .subscribe((quantityStatus) => {
          if (quantityStatus.status) {
            this.showCashModal = true;
            this.displayPayementStatusModal = {
              visibility: false,
              orderId: this.cartOrderId?.orderId,
              id: null,
              amt: this.cartOrderId?.payment?.price?.total,
              accountId: null,
            };
          }
          else if (quantityStatus.status === false) {
            this.outOfStockMssg = quantityStatus.statusMsg;
            this.showOutOfStock = true;
          }
          this.quantityStatusSubscription$?.unsubscribe();
          quantityStatus.status !== null &&
            this.store.dispatch(KioskActions.quantityCheckDataReset());
        });
    } else {
      this.showCashModal = true;
      this.displayPayementStatusModal = {
        visibility: false,
        orderId: this.cartOrderId?.orderId,
        id: null,
        amt: this.cartOrderId?.payment?.price?.total,
        accountId: null,
      };
    }
    this.TaxBreakupDetails = {
      orderDetails: this.cartOrderId,
      formattedTotal: this.calculateFormattedTotal(),
      cartTax: this.cartTax,
      totalTax: this.getTotalTax(),
    }
  }

  payOnline() {
    if (this.subOrderData?.length) {
      this.store.dispatch(KioskActions.filledStateWithTableData({ tableData: this.subOrderData }));
    }
    this.outOfStockTitle = 'Can\'t proceed for payment !';
    const storeId = this.current_branch['_id'];
    const productArray = [];
    let cartItemsCopy: IProductData[] = []
    this.cartItemsSubscription$ = this.cartItems$
      .subscribe((data: IProductData[]) => {
        cartItemsCopy = data
        this.cartItemsSubscription$?.unsubscribe()
      });
    for (let idx = 0; idx < cartItemsCopy.length; idx++) {
      productArray[idx] = { '_id': cartItemsCopy[idx].productInfo._id, 'quantity': cartItemsCopy[idx].qty };
    }
    if (this.kioskSettings?.inventoryManagement?.stockCheck) {
      this.store.dispatch(KioskActions.quantityCheck({ productArray, storeId }));
      this.quantityStatusSubscription$ = this.store
        .select(KioskSelectors.getQuantityStatus)
        .subscribe((quantityStatus) => {
          if (quantityStatus.status) {
            this.showLoader = true;
            this.kioskOrderService.getQrCode(this.cartOrderId?.['_id']).subscribe((data) => {
              this.showQrScanner = {
                visibility: true,
                src: data?.data ? `data:image/png;base64,${data?.data}` : data['image_url'],
              }
              this.showLoader = false;
              this.checkPaymentStatusInterval = setInterval(() => {
                this.kioskOrderService.getPaymentStatus(this.cartOrderId?.['_id']).subscribe((data) => {
                  if (data['paymentStatus']) {
                    this.showLoader = false;
                    this.showQrScanner.visibility = false;
                    this.paymentIsSuccessfull = true;
                    this.showwallpaper = true;
                    this.currentOrderPaid = true;
                    this.closeAddOrderModal(true);
                    this.mssgService.add({ severity: 'success', key: 'kiosk-order-page', summary: 'Success', detail: 'Successfully Paid...!' });
                    this.updatePaymentOrderId = '';
                  }
                }, () => { this.showLoader = false; })
              }, 1000);
            }, () => {
              this.showLoader = false;
              this.mssgService.add({ severity: 'error', key: 'kiosk-order-page', summary: 'Error', detail: 'QR Code Generation Failed, try again...!' });
            })
          }
          else if (quantityStatus.status === false) {
            this.outOfStockMssg = quantityStatus.statusMsg;
            this.showOutOfStock = true;
          }
          this.quantityStatusSubscription$?.unsubscribe();
          quantityStatus.status !== null &&
            this.store.dispatch(KioskActions.quantityCheckDataReset());
        });
    } else {
      this.showLoader = true;
      this.kioskOrderService.getQrCode(this.cartOrderId?.['_id']).subscribe((data) => {
        this.showQrScanner = {
          visibility: true,
          src: data?.data ? `data:image/png;base64,${data?.data}` : data['image_url'],
        }
        this.showLoader = false;
        this.checkPaymentStatusInterval = setInterval(() => {
          this.kioskOrderService.getPaymentStatus(this.cartOrderId?.['_id']).subscribe((data) => {
            if (data['paymentStatus']) {
              this.showLoader = false;
              this.mssgService.add({ severity: 'success', key: 'kiosk-order-page', summary: 'Success', detail: 'Successfully Paid...!' });
              this.showQrScanner.visibility = false;
              this.paymentIsSuccessfull = true;
              this.currentOrderPaid = true;
              this.showwallpaper = true;
              this.closeAddOrderModal(true);
              // this.kioskOrderService.getOrderSummary(this.cartOrderId?._id).subscribe((data:any)=>{
              //   if(data){
              //     this.orderSummaryImgURL = data?.recieptUrl;
              //   }
              // })
              this.updatePaymentOrderId = '';
            }
          }, () => { this.showLoader = false })
        }, 1000);
      }, () => {
        this.showLoader = false;
        this.mssgService.add({ severity: 'error', key: 'kiosk-order-page', summary: 'Error', detail: 'QR Code Generation Failed, try again...!' });
      })
    }
  }





  getAmountToBeGivenBack(e) {
    this.amountReceived = e.target.value;
    this.amountToGiveBack = (e.target.value - this.amountToBePaid);
  }

  closeCashModal() {
    this.amountToGiveBack = 0;
    this.amountReceived = 0;
    this.amountToBePaid = 0;
    // this.updatePaymentOrderId = '';
    this.amountToBePaid = 0;
    if (this.displayPayementStatusModal.visibility) {
      //  this.closeRowUpdateCashModal();
    }
    this.showCashModal = false;
    this.showCardModal = false;
    this.showLinkModal = false;
  }


  goToPrintReciept(obj: IPayByCashCartParam, e) {
    this.cartItemData = e;
    this.showLoader = true;
    const rowPaymentUpdateIsVisibile = this.displayPayementStatusModal.visibility;
    if (rowPaymentUpdateIsVisibile)
      this.updatePaymentOrderId = this.displayPayementStatusModal.id;
    this.kioskService.setOrderAsPicked([this.cartOrderId?._id], obj).subscribe((res: any) => {
      this.currentOrderPaid = true;
      this.closeAddOrderModal(true);
      this.closeCashModal();
      this.SelectBtnValue = '';
      this.currentTableOrderDocId = '';
      this.currentTableId = '';
      this.showwallpaper = true;
      this.subOrderData = [];
      this.tableCartItems = [];
      this.isReloadRequiredMemo();
      this.mssgService.add({ severity: 'success', key: 'kiosk-order-page', summary: 'Receipt Sent', detail: res?.msg });
      this.searchService.resetSearchTextInSearchBox();
      if (!rowPaymentUpdateIsVisibile) {
      }
    }, () => {
      this.showLoader = false;
    })
  }

  async printSummary() {
    await epsonPrint('10.10.10.136', this.recieptImgURL);
    this.showLoader = false;
  }



  openTableOccupancyDialog() {
    this.closeAddOrderModal(true);
    this.checkOccupiedTable();
    this.resetCartValues(true);
  }

  confirm(key) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: key === 'dialogClose' ? 'Do you really want to close the page ?' : key === 'tableSwitch' ? 'This will clear your cart and order. Do you really want to continue ?' : key === 'discardBtn' ? 'Do you really want to discard the order ?' : '',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (key === 'dialogClose') {
          this.showAddOrdersModal = false;
        } else if (key === 'tableSwitch') {
          this.openTableOccupancyDialog();
        } else if (key === 'discardBtn') {
          this.currentOrderPaid = false;
          this.subOrderData = [];
          this.closeAddOrderModal(true);
          this.showwallpaper = true;
          this.isReloadRequiredMemo()
        }
      },
      reject: () => {
        if (key === 'tableSwitch') {
          this.TaxBreakupDetails = true;
          const dineInOption = this.stateOptions.find(option => option.value === 'dineIn');
          if (dineInOption) {
            this.SelectBtnValue = 'dineIn';
          } else {
            const dineOutOption = this.stateOptions.find(option => option.value === 'dineOut');
            if (dineOutOption) {
              this.SelectBtnValue = 'dineOut';
            } else {
              this.SelectBtnValue = this.selectedOrderTypeValue;
            }
          }
        }
      }
    });
  }

  handleSelectButtonDeselection() {
    this.stateOptions = this.stateOptions.map((dineType) => {
      dineType.isSelected = dineType?.value === this.SelectBtnValue
      return dineType
    })
  }




  checkSelectedButton(val, otherService = null) {
    this.cancelKitchenItemsMod();
    this.selectedDineType = otherService || null;
    this.SelectBtnValue = val;
    this.selectedInKitchenProdcut = null;
    if (val === 'table') {
      this.getTablesWithFloorId();
      if (!this.showtableData && this.cartOrderId?._id) {
        // this.tableSwitch.show(tableSwitch);
        this.confirm('tableSwitch');
        return;
      }
      this.checkOccupiedTable();
      if (!this.showSelectedTableData) {
        this.showSelectedTableData = {};
        this.resetCartValues(true);
      }
    } else {
      this.showSelectedTableData = {};
      if (this.showtableData === true) {
        this.resetCartValues(true);
        this.showtableData = false;
        this.cartOrderId = '';
      } else if (this.cartOrderId?._id) {
        this.showTaxBreakup = false;
      }
    }

    if (!this.showtableData) {
      this.tableCartItems = [];
      this.subOrderData = [];
    }

  }

  onTableSelect(e) {
    this.isSwitchTable = false;
    this.tableCartItems = [];
    this.subOrderData = [];
    this.selectedTableData = e;
    this.showSelectedTableData = e;
    this.currentTableOrderDocId = e?.aProperties?.orderDocId;
    this.currentTableId = e?._id;
    this.selectedTableData['status'] = e.aProperties?.status ?? 'available';
    if (this.selectedTableData['status'] === 'available') {
      this.showEditOrderOption = true;
    } else {
      this.editOrBookOrder(this.selectedTableData);
    }

  }

  switchTableData(e) {
    this, this.showLoader = true;
    const obj = {
      sourceTableId: this.showSelectedTableData?._id,
      destinationTableId: e?._id,
    }
    this.kioskService.switchTableOrder(obj).subscribe({
      next: (res: any) => {
        this.showLoader = false;
        this.showSelectedTableData = res?.destinationTableData;
        this.currentTableOrderDocId = this.showSelectedTableData?.aProperties?.orderDocId;
        this.currentTableId = this.showSelectedTableData?._id;
        this.selectedTableData = res?.destinationTableData;
        this.mssgService.add({ severity: 'success', key: 'kiosk-order-page', summary: 'Success', detail: res?.msg });
        if (this.cartOrderId) {
          this.checkoutCart();
        }
        this.showTableModal = false;
      },
      error: (error) => {
        this.mssgService.add({ severity: 'error', key: 'kiosk-order-page', summary: 'Error', detail: error?.msg });
        this.showTableModal = false;
        this.showLoader = false;
      }
    })
  }

  editOrBookOrder(e) {
    if (e?.aProperties?.status === 'occupied' || e?.aProperties?.status === 'recieptGenerated') {
      this.activeIndex = [];
      this.subOrderData = e?.aProperties?.orderData?.subOrderData;
      this.store.dispatch(KioskActions.updateKitchenSentData({ kitchenData: this.subOrderData }));
      this.subOrderData.map((_, idx) => {
        this.activeIndex.push(idx);
      })
      // e?.aProperties?.orderData?.orderDetails?.items.map((res)=> {
      //   const obj = {
      //     metaInfo : {
      //       itemName: res?.name,
      //       price: res?.price,
      //       outOfStockStatus: false,
      //       categoryIds : '',
      //       groups:[]
      //     },
      //     qty:res?.quantity,
      //     imageUrl : '',
      //     idx:0,
      //     productInfo: {
      //       _id: res?._id,
      //       image: {},
      //     }
      //   }
      //   product.push(obj);
      // })
      this.store.dispatch(KioskActions.resetCartValues({ modalOpen: true }))

    } else {
      this.resetCartValues(true);
    }
    this.cartOrderId = e?.aProperties?.orderData;
    this.showSelectedTableData = e;
    // if table is occupied then initate checkout automatically every time
    if (this.cartOrderId) {
      this.checkoutCart()
    }
    this.showEditOrderOption = false;
    this.showTableModal = false;
    this.showtableData = true;
  }

  outOfStockCheck(value) {
    this.outOfStockTitle = "Can't add more !";
    this.showOutOfStock = true;
    if (value) {
      this.outOfStockMssg = value;
    }
  }



  openPrintSokModal: boolean = false

  resetVerification() {
    this.store.dispatch(KioskActions.resetVerifcation())
    this.openPrintSokModal = false;
    this.showTransactionProof = true;
  }

  // mainPaymentModalClosed() {
  //   this.closeRowUpdateCashModal();
  //   // this.paymentOptionsFromSettings = structuredClone(this.paymentOptionsFromSettingsCopy);
  // }

  // addOrRemoveMode(mode, action){
  //   if(action === 'remove') {
  //       this.paymentOptionsFromSettings = this.paymentOptionsFromSettings.filter(e => e !== mode);
  //   } else if(action === 'add') {
  //     const v = this.paymentOptionsFromSettings.find(r => r === mode)
  //     if(!v)
  //     this.paymentOptionsFromSettings.unshift(mode)
  //   }

  // }


  // transation proof callbacks
  showTransactionProof = true;




  calculateFormattedTotal(): string {
    if (
      this.cartOrderId?.payment?.price?.items?.length > 0 &&
      typeof this.cartOrderId?.payment?.price?.total === 'number'
    ) {
      const formattedTotal = (
        this.cartOrderId.payment.price.total - Number(this.getTotalTax())
      ).toFixed(2);

      return '₹' + formattedTotal;
    }

    return '₹0.00';
  }

  checkOccupiedTable() {
    this.showLoader = true;
    this.isSwitchTable = false;
    this.showTableModal = true;
    this.showTaxBreakup = false
    this.showLoader = false;
  }

  categoryColors = {}
  generateRandomColor(idx: number) {
    // Generate random values for red, green, and blue components
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    // Combine the components into a CSS color string
    const background = `rgb(${red}, ${green}, ${blue})`;
    // background;idx;
    if (!this.categoryColors[idx]) {
      this.categoryColors = {
        ...this.categoryColors,
        [idx]: {
          background,
          text: this.generateNegativeColor(background)
        }
      }
    } else {

    }
    return this.SelectedViewValue === 'rich';
  }

  generateNegativeColor(colorString: string) {
    const [red, green, blue] = colorString
      .match(/\d+/g)
      .map((value) => parseInt(value, 10));

    // Calculate the negative (complementary) color components
    const negativeRed = 255 - red;
    const negativeGreen = 255 - green;
    const negativeBlue = 255 - blue;

    // Combine the negative components into a CSS color string
    const negativeColorString = `rgb(${negativeRed}, ${negativeGreen}, ${negativeBlue})`;

    return negativeColorString;
  }

  changeSelectedViewValue(e) {
    localStorage.setItem('kiosk-order-view', e?.value);
  }

  onCatPositionChange(e) {
    this.catPositionVal = e?.value;
    if (e?.value === 'catLeft') {
      this.layoutt = 'horizontal';
      this.panelSize = [30, 70];
    } else if (e?.value === 'catBottom') {
      this.layoutt = 'vertical';
      this.panelSize = [70, 30];
    }
  }

  updateTableData(data) {
    const idx = this.tableCartItems?.findIndex((v) => v?.productInfo?._id === data?.item?.productInfo?._id);
    if (data.increase) {
      const updateProd = { ...this.tableCartItems[idx] };
      if (idx !== -1) {
        updateProd.qty++;
        this.tableCartItems[idx] = updateProd;
      }
      else {
        const updatePord = { ...data.item };
        updatePord.qty = 1;
        this.tableCartItems.unshift(updatePord)
      }
    }
    else if (data.remove) {
      this.tableCartItems = this.tableCartItems.filter((v) => v?.productInfo?._id !== data?._id);
    }
    else {
      if (idx !== -1) {
        const updateProd = { ...this.tableCartItems[idx] };
        if (updateProd.qty === 1) {
          this.tableCartItems.splice(idx, 1);
        }
        else {
          updateProd.qty--;
          this.tableCartItems[idx] = updateProd;
        }
      }
    }
  }

  updateTableCall() {
    if (!this.currentTableId) {
      this.currentTableId = this.cartOrderId?.tableData?._id;
    }
    const prodData = this.tableCartItems.reduce((acc, curr) => {
      const obj = { _id: curr?.productInfo?._id, quantity: curr?.qty }
      acc.push(obj);
      return acc;
    }, [])
    this.showLoader = true;
    this.kioskService.submitTableOrder(this.currentTableId, prodData, this.currentTableOrderDocId).subscribe((data: any) => {
      if (data) {
        this.selectedInKitchenProdcut = null;
        this.showLoader = false;
        this.tableCartItems = [];
        this.currentTableOrderDocId = data?._id;
        this.subOrderData = data?.subOrderData;
        this.cartOrderId = data;
        // make checkout update call when a new chunck is added into table
        if (this.cartOrderId) {
          this.checkoutCart();
        }
        this.store.dispatch(KioskActions.updateKitchenSentData({ kitchenData: this.subOrderData }));
        for (let j = 0; j < data.orderDetails?.items?.length; j++) {
          this.store.dispatch(KioskActions.updateTableCart({ prodId: data.orderDetails.items[j]?._id, isTable: this.showTableModal }))
        }
      }
    }, () => {
      this.showLoader = false;
    })
  }

  getTablesWithFloorId(defaultFloorId?: string) {
    this.showLoader = true;
    if (defaultFloorId) {
      this.currentFloor = defaultFloorId
    }
    const status = this.isSwitchTable ? 'available' : '';
    if (this.currentFloor) {
      this.kioskService.getMaestroTableWithAreaId(this.currentFloor, status).subscribe({
        next: (res) => {
          this.showLoader = false;
          this.occupiedTableData = res;
        },
        error: (err) => {
          this.showLoader = false;
          console.log(err);
        }
      })
    } else {
      this.showLoader = false;
    }
  }


  setDineType(type) {
    this.selectedOrderTypeValue = type;
    this.tableCartItems = [];
    this.subOrderData = [];
    if (type === 'table') {
      this.getTablesWithFloorId(this.defaultFloorId)
      this.openTableOccupancyDialog();
    }
    this.SelectBtnValue = type;
    this.showwallpaper = false;
    this.handleSelectButtonDeselection()
  }

  isReloadRequiredMemo() {
    if (this.isReloadModalVisible) {
      this.reloadAgainState = true
    }
    this.isReloadModalVisible = false
  }
  selectedDineType;

  getAdditionalDineServices() {
    this.kioskService.getAdditionalDineServices().subscribe((data: any[]) => {
      this.additionalDineTypes = data?.map(({ assetDetails }) => {
        return { value: assetDetails?.name, label: assetDetails?.name }
      })
    })
  }

  additionalDineTypes = []

  getProductPayloadForTable() {
    let payLoadProd = [];
    let idx = 0;
    for (let i = 0; i < this.subOrderData.length; i++) {
      for (let j = 0; j < this.subOrderData[i].items.length; j++) {
        payLoadProd[idx] = { '_id': this.subOrderData[i].items[j]?._id, 'quantity': this.subOrderData[i].items[j]?.quantity };
        idx++;
      }
    }
    return payLoadProd;
  }

  clearCart() {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you really want to clear the cart ?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.resetCartValues(true);
        !this.showtableData ? this.showwallpaper = true : ''
      },
      reject: () => {
      }
    });

  }

  printOrderReceipt() {
    this.showLoader = true;
    const param = {
      orderDocId: this.currentTableOrderDocId,
    }
    this.kioskService.postPrintOrderReciept(this.cartOrderId?._id, param).subscribe({
      next: (res) => {
        this.showLoader = false;
        this.mssgService.add({ severity: 'success', key: 'kiosk-order-page', summary: 'Message', detail: res?.['message'] });
      },
      error: (err) => {
        this.showLoader = false;
        console.log(err);
      }
    })
  }

  editInKitchenItems = []

  isInKitchenItems: boolean
  changeCartItems = true
  changedInKitchenItems = {
    products: {
      remove: []
    },
    tableId: '',
    orderDocId: '',
    subOrderId: ''
  }
  selectedInKitchenProdcut

  cancelKitchenItemsMod() {
    this.isInKitchenItems = false;
    this.selectedInKitchenProdcut = null;
    this.changedInKitchenItems = {
      products: {
        remove: []
      },
      tableId: '',
      orderDocId: '',
      subOrderId: ''
    }
  }

  editInTableItems(product) {
    if (this.tableCartItems?.length) return;
    this.selectedInKitchenProdcut = product;
    this.isInKitchenItems = true;
    this.changedInKitchenItems = {
      products: {
        remove: []
      },
      tableId: '',
      orderDocId: '',
      subOrderId: ''
    }
    this.editInKitchenItems = product.items?.map(item => {
      return { ...item, originalQty: item.quantity }
    })
  }

  actionOnTableCartItems(product, action: string) {
    if (action === "increment") {
      !this.isInKitchenItems && this.incrementCartQty(product);
      this.isInKitchenItems && this.incrementInKitchenItems(product);
    } else if (action === "decrement") {
      !this.isInKitchenItems && this.decrementCartQty(product);
      this.isInKitchenItems && this.decrementInKitchenItems(product);
    }
    else if (action === 'add-to-kitchen') {
      this.updateTableCall()
    }
    else if (action === 'remove-from-kitchen') {
      this.removeKitchenItemsCall()
    }
  }

  removeKitchenItemsCall() {
    this.showLoader = true;
    this.kioskService.submitTableOrder(
      this.changedInKitchenItems.tableId,
      this.changedInKitchenItems.products.remove,
      this.changedInKitchenItems.orderDocId || this.currentTableOrderDocId,
      this.changedInKitchenItems.subOrderId,
      'remove'
    ).subscribe((data: any) => {
      if (data) {
        this.selectedInKitchenProdcut = null;
        this.isInKitchenItems = false;
        this.showLoader = false;
        this.tableCartItems = [];
        this.editInKitchenItems = [];
        this.currentTableOrderDocId = data?._id;
        this.subOrderData = data?.subOrderData;
        this.cartOrderId = data;
        // make checkout update call when a new chunck is added into table
        if (this.cartOrderId) {
          this.checkoutCart();
        }
        this.store.dispatch(KioskActions.updateKitchenSentData({ kitchenData: this.subOrderData }));
        for (let j = 0; j < data.orderDetails?.items?.length; j++) {
          this.store.dispatch(KioskActions.updateTableCart({ prodId: data.orderDetails.items[j]?._id, isTable: this.showTableModal }))
        }
      }
    }, () => {
      this.showLoader = false;
    })
  }

  manageChangeInKitchenItems(item) {
    let isIdPresent = false
    const itemsToRemove = this.changedInKitchenItems?.products?.remove?.map(p => {
      if (p._id === item._id) {
        isIdPresent = true
        return { ...p, quantity: item.originalQty - item.quantity }
      }
      return p
    })

    if (!isIdPresent) {
      itemsToRemove.push({ _id: item._id, quantity: item.originalQty - item.quantity })
    }
    let subOrderId;
    this.subOrderData?.forEach(({ kId, _id }) => {
      if (kId === this.selectedInKitchenProdcut?.kId) {
        subOrderId = _id
      }
    })

    this.changedInKitchenItems = {
      tableId: this.selectedTableData._id,
      orderDocId: this.selectedTableData.aProperties.orderDocId,
      subOrderId,
      products: {
        remove: itemsToRemove,
      },
    };
  }

  incrementInKitchenItems(product) {
    if (product?.originalQty === product?.quantity) return;
    this.editInKitchenItems = this.editInKitchenItems.map(item => {
      if (item._id === product._id) {
        const modP = { ...item, quantity: item.quantity + 1 }
        this.manageChangeInKitchenItems(modP)
        return modP
      }
      return item
    })
  }
  removeInKitchenItem(product) {
    if (!product.quantity) return;
    const cartProducts = [];
    this.editInKitchenItems.forEach(item => {
      if (item._id === product._id) {
        const modP = { ...item, quantity: 0 }
        this.manageChangeInKitchenItems(modP);
        cartProducts.push(modP)
      } else {
        cartProducts.push(item)
      }

    })
    this.editInKitchenItems = cartProducts
  }
  decrementInKitchenItems(product) {
    if (!product.quantity) return;
    const cartProducts = [];
    this.editInKitchenItems.forEach(item => {
      if (item._id === product._id) {
        const modP = { ...item, quantity: item.quantity - 1 }
        this.manageChangeInKitchenItems(modP);
        cartProducts.push(modP)
      } else {
        cartProducts.push(item)
      }

    })
    this.editInKitchenItems = cartProducts
  }

  //   table modal pagination method
  salesModalPaginate(event) {
    this.salesModal.pagination.noOfPagesList = event.pageCount
    if (event.rows) {
      this.salesModal.pagination.recordsPerPage = event.rows;
    }
    this.salesModal.appLoader = true;
    let recordsPerPage;
    let skip;
    this.salesModal.pagination.pageNumber = event.page + 1;
    if (event.page === 0) {
      skip = 0;
      recordsPerPage = this.salesModal.pagination.recordsPerPage;
    } else {
      skip = event.page * this.salesModal.pagination.recordsPerPage;
      recordsPerPage = this.salesModal.pagination.recordsPerPage;
    }
    this.downloadProductSalesReport(true, false, skip, recordsPerPage)
  }

  async downloadProductSalesReport(view: boolean = true, isCount: boolean = true, skip?, limit?) {

    this.showLoader = true;
    this.salesModal.appLoader = true;

    const startDate = moment().startOf("days").valueOf();
    const endDate = moment().endOf('days').valueOf();
    let locationIds = '';
    locationIds = this.salesModal.maestroStoreId;
    if (view) {
      this.salesModal.appLoader = true;
      this.salesModal.displayModal = true;

      this.analyticsService.getProductSalesByStore(startDate, endDate, 'json', locationIds, isCount, skip ?? 0, limit ?? this.salesModal.pagination.recordsPerPage, 'iotzen-pos').subscribe({
        next: (data) => {
          if (data?.['count'] > 0) {
            this.salesModal.pagination.totalNoOfRecords = data?.['count'];
            this.analyticsService.getProductSalesByStore(startDate, endDate, 'json', locationIds, false, skip ?? 0, limit ?? this.salesModal.pagination.recordsPerPage, 'iotzen-pos').subscribe({
              next: (data) => {
                this.salesModal.displayModal = true;
                this.salesModal.tableApiData = data;
                this.salesModal.tabledata = data?.['data'] ? data?.['data'] : [];
                this.showLoader = false;
                this.salesModal.appLoader = false;
                if (data?.['showAmount']) {
                  this.salesModal.header = 'Total Sales: ' + data?.['total']?.['amount'];
                }
              }
            })

          } else if (data?.['data']) {
            this.salesModal.displayModal = true;
            this.salesModal.tableApiData = data;
            this.salesModal.tabledata = data?.['data'] ? data?.['data'] : [];
            this.showLoader = false;
            this.salesModal.appLoader = false;
          }

          this.showLoader = false;
          this.salesModal.appLoader = false;

        }, error: () => {
          this.showLoader = false;
          this.salesModal.appLoader = false;
        }
      })


    }
  }

  //   -----build header for data----
  getTableColumnheader() {
    let cols = []
    if (this.salesModal.tableApiData?.['headers']) {
      this.salesModal.tableApiData['headers'].map((header) => {
        let col = {}
        col['field'] = header.header ? header.header : null
        col['key'] = header.key ? header.key : null;
        col['type'] = header.type ? header.type : null
        cols.push(col)
      })
    }

    return cols
  }
  resetModalData() {
    this.salesModal.header = '';
    this.salesModal.tableApiData = {}
    this.salesModal.tabledata = [];
    this.salesModal.pagination.totalNoOfRecords = 0
  }

  buildExpectedDeliveryDateTime(date) {
    let dateTime: any = "";
    if (date) {
      // dateTime = this.dateFormatter.convertDateToSelectedTimezone(
      //   date,
      //   "DD/MM/YY"
      // );
    }
    if (date) {
      // dateTime =
      //   dateTime +
      //   ", " +
      //   this.dateFormatter.getFormattedTimeSlotForSingleTime(
      //     date
      //   );
    }
    return dateTime;
  }
  getTableStatusBgColor(status) {
    let color = '#E0E5E1'
    switch (status) {
      case 'occupied':
        color = '#DE3163';
        break;
      case 'available':
        color = '#378D4F';
        break;
      case 'recieptGenerated':
        color = '#FFA500';
        break;
      default:
        break;
    }
    return color;
  }

  isKitchenEmpty = true;

  isAnyItemInKitchen(data) {
    this.isKitchenEmpty = true;
    data?.forEach(({ items }) => {
      if (items?.length) {
        this.isKitchenEmpty = false;
        return;
      }
    });
    return this.isKitchenEmpty;
  }

}
