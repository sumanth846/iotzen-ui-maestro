import { ButtonModule } from 'primeng/button';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ConfirmPopupModule } from 'primeng/confirmpopup';




@Component({
  selector: 'app-cart-card',
  standalone: true,
  imports: [ButtonModule, FormsModule, BadgeModule, CommonModule, ConfirmPopupModule],
  templateUrl: './cart-card.component.html',
  styleUrl: './cart-card.component.scss'
})
export class CartCardComponent {
  @Input() numItems: number;
  @Input() cartItems: any;
  @Input() showCheckoutButton: boolean
  @Input() cartOrderId;
  @Input() selectedDineType: string;
  @Input() subOrderData;
  @Input() tableCartItems;

  @Output() resetCartEmitter = new EventEmitter<void>();
  @Output() removeItemFromCart = new EventEmitter<any>();
  @Output() overlayPanelEmitter = new EventEmitter<any>();
  @Output() setOverlayPanelItemEmitter = new EventEmitter<any>();
  @Output() checkoutCartEmitter = new EventEmitter<void>();
  @Output() emitDiscardOrder = new EventEmitter<void>();

  cartTotal: number = 0;
  subOrderLength = 0;
  subOrderPrice = 0;

  constructor(
    private confirmationService: ConfirmationService,
  ) { }

  ngOnChanges(): void {
    this.getCartTotal();
    this.subOrderLength = 0;
    this.subOrderPrice = 0;
    for (let i = 0; i < this.subOrderData.length; i++) {
      for (let j = 0; j < this.subOrderData[i].items.length; j++) {
        this.subOrderLength++;
        this.subOrderPrice += this.subOrderData[i].items[j].price * this.subOrderData[i].items[j].quantity;
      }
    }
  }
  ngOnInit(): void {
  }

  getCartTotal() {
    let temp = 0;
    if (this.cartItems) {
      this.cartItems.forEach((item) => {
        const price = this.selectedDineType ? (item?.['metaInfo']?.['prices']?.[this.selectedDineType] || item?.['metaInfo']?.['price']) : item?.['metaInfo']?.['price']
        temp += item.qty * price;
      });
    }
    return temp.toFixed(2);
  }

  emitResetCart() {
    this.resetCartEmitter.emit();
  }

  emitRemoveElem(item: any) {
    this.removeItemFromCart.emit(item['productInfo']['_id']);
  }

  emitCartItemClick(data, item) {
    this.overlayPanelEmitter.emit(data);
    this.setOverlayPanelItemEmitter.emit(item);
  }

  emitCheckoutCart() {
    this.checkoutCartEmitter.emit();
  }
  discardOrder() {
    this.emitDiscardOrder.emit();
  }
  confirm(key) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: key === 'resetCart' ? 'Do you really want to clear the cart ?' : key === 'discardOrder' ? 'Do you really want to discard the order ?' : '',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (key === 'resetCart') {
          this.emitResetCart()
        } else if (key === 'discardOrder') {
          this.discardOrder();
        }
      },
      reject: () => {
      }
    });
  }
}
