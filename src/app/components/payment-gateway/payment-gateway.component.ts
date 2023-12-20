import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { KioskStoreService } from 'src/app/services/kiosk.store.service';
import { IPayByCashCartParam } from 'src/app/interface/maestro-interface';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CashModalComponent } from '../cash-modal/cash-modal.component';
import { OnlineModalComponent } from '../online-modal/online-modal.component';
import { ExternalLinkPaymentModalComponent } from '../external-link-payment-modal/external-link-payment-modal.component';
import { VerifyPaymentModalComponent } from '../verify-payment-modal/verify-payment-modal.component';
import { TransactionProofComponent } from '../transaction-proof/transaction-proof.component';

@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [CommonModule, TransactionProofComponent, VerifyPaymentModalComponent, DialogModule, ConfirmPopupModule, CashModalComponent, OnlineModalComponent, ExternalLinkPaymentModalComponent],
  templateUrl: './payment-gateway.component.html',
  styleUrl: './payment-gateway.component.scss'
})
export class PaymentGatewayComponent {
  @Input() modalProps: any;
  @Input() qrProps: any;
  @Input() branchName: any;
  @Input() showCashModal: boolean = false;
  @Input() showLinkModal: boolean = false;
  @Input() paymentOptions: string[] = null;
  @Input() showRefundModal: boolean = false;
  @Input() refundObject: any;
  @Input() orderId: any;
  @Input() showOtherMethods: boolean = false;
  @Input() TaxBreakupDetails: any
  @Input() showCardModal: boolean
  @Input() cartItems: any;
  @Input() selectedDineType: string;

  @Output() emitCashRecieved: EventEmitter<IPayByCashCartParam> = new EventEmitter();
  @Output() emitModalsAreClosed: EventEmitter<void> = new EventEmitter();
  @Output() emitQrIsClosed: EventEmitter<void> = new EventEmitter();
  @Output() emitChoseOnlinePayment: EventEmitter<void> = new EventEmitter();
  @Output() emitOpenRzp: EventEmitter<void> = new EventEmitter();
  @Output() emitCloseRefundModal: EventEmitter<void> = new EventEmitter();
  @Output() emitLoader: EventEmitter<boolean> = new EventEmitter();
  @Output() emitMainModalClosed: EventEmitter<boolean> = new EventEmitter();


  showVerifyModal: boolean = false;
  isMobileView: any;
  showVerifyCaptureModal: boolean;
  MOBILE_BREAK_POINT = 481

  constructor(private kioskService: KioskStoreService) { }

  ngOnInit(): void {
    this.isMobileView = this.isMobieViewCalculate();

  }

  updateCashModal() {
    this.showCashModal = true;
  }

  payByLink() {
    this.showLinkModal = true;
  }

  updateOnlineModal() {
    this.emitChoseOnlinePayment.emit();
  }

  cashIsReceived(e) {
    this.showCashModal = false;
    this.emitCashRecieved.emit(e);
  }

  amountModalIsClosed() {
    this.showCashModal = false;
    this.emitModalsAreClosed.emit();
  }

  qrModalIsClosed() {
    this.emitQrIsClosed.emit();
  }

  openRazorpay() {
    this.emitOpenRzp.emit();
  }

  closeRefundModal() {
    this.showRefundModal = false
    this.emitCloseRefundModal.emit();
  }

  recieveLoader(v) {
    this.emitLoader.emit(v);
  }

  transformOptionName(option) {
    if (option) {
      return option.charAt(0).toUpperCase() + option.slice(1);
    }
  }

  sendLinkForPayment() {

  }

  closeLinkModal() {
    this.showLinkModal = false;
    // this.emitModalsAreClosed.emit();
  }

  openVerifyModal() {
    this.showVerifyModal = true;
  }
  openVerifyCaptureModal() {
    this.showVerifyCaptureModal = true
  }

  verifyModalClosed(event) {
    if (event != null && event != undefined) {
      this.showVerifyModal = false
      if (event?.all == true) {
        this.emitModalsAreClosed.emit()
        this.emitMainModalClosed.emit()

      }
    }
  }

  emitModalHidden(cancel = false) {
    if (cancel) {
      this.modalProps.visibility = false
    }
    this.emitMainModalClosed.emit()

  }

  transactionSubmited(event, orderId) {
    if (event == null) {
      // this.store.dispatch(KioskActions.resetVerifcation())
      // this.openPrintSokModal = true;
      // this.showTransactionProof = false;
      this.showVerifyCaptureModal = false
    } else if (event == 'skip') {
      this.showVerifyModal = true;
    }
    else {
      this.kioskService.effectSendTransaction({ file: event.image }, orderId).subscribe((res) => {
        if (res) {
          // this.store.dispatch(KioskActions.resetVerifcation())
          // this.openPrintSokModal = true;
          // this.showTransactionProof = false;
          this.showVerifyCaptureModal = false
          this.showVerifyModal = true;
        }
      })
    }
  }

  isMobieViewCalculate() {
    return window.innerWidth < this.MOBILE_BREAK_POINT;
  }
}
