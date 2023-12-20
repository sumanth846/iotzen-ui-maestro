import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KioskActions, KioskSelectors } from 'src/app/state/kiosk';
import { Store } from '@ngrx/store';
import { IProductData } from 'src/app/interface/maestro-interface';
import { Subscription } from 'rxjs';
import { KioskSettings } from 'src/app/interface/maestro-interface';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { SokPrintModalComponent } from '../sok-print-modal-component/sok-print-modal-component.component';



@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [TooltipModule, CommonModule, SokPrintModalComponent],
  templateUrl: './order-card-component.component.html',
  styleUrl: './order-card-component.component.scss'
})
export class OrderCardComponent {
  updateCartVisible: boolean = false;
  private quantityStatusSub$: Subscription;

  @Input() item: IProductData;
  @Input() showtableData: boolean;
  @Input() SelectedViewValue: string;
  @Input() currentBranch: any;
  @Input() kioskSettings: KioskSettings;
  @Input() selectedDineType: string;
  @Input() changeCartItems = true;

  @Output() incrementQtyEmitter = new EventEmitter<any>();
  @Output() decrementQtyEmitter = new EventEmitter<any>();
  @Output() emitOutOfStock = new EventEmitter<any>();
  @Output() emitTableData = new EventEmitter<any>();
  @Output() updateCartItemEmitter = new EventEmitter<boolean>();
  @Output() updateShowTaxBreakup = new EventEmitter<boolean>();

  constructor(private store: Store) { }
  ngOnInit(): void {

  }

  incrementQty(item: IProductData) {
    let storeId: string = this.currentBranch?.["_id"];
    let productArray = [{ _id: "", quantity: 0 }];
    productArray[0]._id = item?.productInfo?._id;
    productArray[0].quantity = item?.qty + 1;
    if (this.kioskSettings?.inventoryManagement?.stockCheck) {
      this.store.dispatch(KioskActions.quantityCheck({ productArray, storeId }));
      this.quantityStatusSub$ = this.store
        .select(KioskSelectors.getQuantityStatus)
        .subscribe((quantityStatus) => {
          if (quantityStatus.status) {
            this.store.dispatch(KioskActions.incrementQtyViaProduct({ product: item, isTable: this.showtableData }));
            if (this.showtableData) {
              const obj = {
                item: { ...item, productInfo: { ...item.productInfo } },
                increase: true
              }
              this.emitTableData.emit(obj)
            }
          } else if (quantityStatus.status === false) {
            this.emitOutOfStock.emit(quantityStatus.statusMsg);
          }
          this.quantityStatusSub$?.unsubscribe();
          quantityStatus.status !== null && this.store.dispatch(KioskActions.quantityCheckDataReset());
        });
    } else {
      this.store.dispatch(KioskActions.incrementQtyViaProduct({ product: item, isTable: this.showtableData }));
      if (this.showtableData) {
        const obj = {
          item: { ...item, productInfo: { ...item.productInfo } },
          increase: true
        }
        this.emitTableData.emit(obj)
      }
    }
    this.updateShowTaxBreakup.emit(false);
  }
  addbuttonClick(item) {
    if (!item.qty && this.changeCartItems) {
      this.incrementQty(item);
    }
  }

  decrementQty(product: IProductData) {
    product.qty && this.store.dispatch(KioskActions.decrementQtyViaProduct({ product }));
    if (this.showtableData) {
      const obj = {
        item: { ...product, productInfo: { ...product.productInfo } },
        increase: false
      }
      this.emitTableData.emit(obj)
    }
    this.updateShowTaxBreakup.emit(false);
  }

  showOverlayCartPanel() {
    this.updateCartVisible = !this.updateCartVisible;
    this.updateCartItemEmitter.emit(this.updateCartVisible);
  }
  ngOnDestroy() {
    this.quantityStatusSub$?.unsubscribe();
  }
}
