import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { sendPaymentVerification } from 'src/app/state/kiosk/kiosk.action';
import { AppState } from 'src/app/state/app.state';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-verify-payment-modal',
  standalone: true,
  imports: [DialogModule],
  templateUrl: './verify-payment-modal.component.html',
  styleUrl: './verify-payment-modal.component.scss'
})
export class VerifyPaymentModalComponent {
  @Input() visible: boolean = false;
  @Input() status: string;
  @Input() orderId: string | number
  @Input() amount: number;
  @Input() orderNo: unknown | number;
  @Output() modalClosed: EventEmitter<{ visible: boolean, all: boolean }> = new EventEmitter();

  constructor(private store: Store<AppState>) {
  }
  onHideModal() {
    this.visible
    this.modalClosed.emit({ visible: this.visible, all: false })
  }
  verifyPayment() {
    this.store.dispatch(sendPaymentVerification({ orderId: this.orderId, Id: this.orderNo }))
    this.modalClosed.emit({ visible: this.visible, all: true })
  }

}
