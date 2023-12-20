import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KioskOrderService } from 'src/app/services/kiosk-order-service';
import { MessageService } from 'primeng/api';
import { IPayByCashCartParam } from 'src/app/interface/maestro-interface';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-cash-modal',
  standalone: true,
  imports: [DialogModule, TableModule, ButtonModule, CommonModule, ToastModule],
  templateUrl: './cash-modal.component.html',
  styleUrl: './cash-modal.component.scss'
})
export class CashModalComponent {

  showActualRefundModal = false
  refundInitialisationCall = false

  amountReceived: number = null;
  amountToGiveBack: number = 0;
  amountToRefund: number = 0;
  refundReason: string;
  recieptImgUrl: string;
  displayReciept: boolean = false;
  showTaxDetails = false;
  showAmount: boolean = true;
  orderDetailsPrintPageTable = [
    { field: '#', header: '#' },
    { field: 'item', header: 'Item' },
    { field: 'quantity', header: 'Qty' },
    { field: 'amount', header: 'Amount' },
  ];
  @Input() isUpdatingPayment: boolean;
  @Input() showCashModal: any;
  @Input() showRefundModal: boolean = false;
  @Input() amountToBePaid: number;
  @Input() orderId: string;
  @Input() refundObject: any;
  @Input() totalAmount: number;
  @Input() TaxBreakupData: any;
  @Input() showCardModal: boolean;
  @Input() cartItems: boolean;
  @Input() selectedDineType: string;

  @Output() emitCashRecieved: EventEmitter<IPayByCashCartParam> = new EventEmitter();
  @Output() emitModalsAreClosed: EventEmitter<void> = new EventEmitter();
  @Output() closeRefundModal: EventEmitter<void> = new EventEmitter();
  @Output() showLoader: EventEmitter<boolean> = new EventEmitter();

  constructor(private kioskOrderService: KioskOrderService, private messageService: MessageService) { }

  ngOnInit(): void {

  }

  ngOnChanges() {
    this.showReciept();
  }

  closeCashModal() {
    this.showAmount = true;
    this.showRefundModal = false
    this.showActualRefundModal = false
    this.amountReceived = null;
    this.amountToGiveBack = 0;
    this.amountToRefund = 0;
    this.refundObject = undefined;
    this.emitModalsAreClosed.emit();
    this.closeRefundModal.emit();
    this.refundInitialisationCall = false
  }

  getAmountToBeGivenBack(e) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    if (inputValue.length === 1 && inputValue === '0') {
      inputElement.value = '';
      return;
    }
    this.amountReceived = e.target.value;
    this.amountToGiveBack = (e.target.value - this.amountToBePaid);
    this.showAmount = false;
  }

  exactAmtSave() {
    this.showAmount = false;
    this.amountReceived = this.amountToBePaid * 1;
    this.amountToGiveBack = (this.amountReceived - this.amountToBePaid);
  }

  getReasonForRefund(e) {
    this.refundReason = e.target.value;
  }

  getAmountToBeRefunded(e) {
    this.amountToRefund = Number(e.target.value);
  }

  goToPrintReciept() {
    const obj: IPayByCashCartParam = {
      amount: Number(this.amountReceived),
      pMode: (!this.showRefundModal && !this.showCardModal) ? 'cash' : 'card',
    }
    this.emitCashRecieved.emit(obj);
    this.amountToGiveBack = 0;
    this.amountReceived = 0;
  }

  startRefund() {
    this.refundInitialisationCall = true
    this.kioskOrderService.initiateRefund(this.refundObject?._id, this.amountToRefund, this.refundReason).subscribe((data: any) => {
      let res = data;

      if (res) {
        this.amountToRefund = 0;
        this.closeRefundModal.emit();
        this.emitModalsAreClosed.emit();
        this.refundInitialisationCall = false
        this.showToast('success', 'Success', 'Refund Made Successfully')
        this.closeCashModal()
      }
    }, (e) => {
      const errorMsg = e.error.msg.slice(0, e.error.msg.lastIndexOf(' '))
      this.showToast('error', 'Error', errorMsg)
      this.refundInitialisationCall = false
    })
  }

  showToast(severity, summary, detail) {
    this.messageService.add({ key: 'refund-status-msg', severity, summary, detail });
  }


  showReciept() {
    if (this.refundObject) {
      this.kioskOrderService.getRecieptContent(this.refundObject?._id).subscribe((data: any) => {
        if (data) {
          this.recieptImgUrl = data?.recieptUrl;
        }
      }, (error: any) => {
        console.log(error);
      })
    }
  }


  toggleTaxDetails() {
    this.showTaxDetails = !this.showTaxDetails;
  }
}
