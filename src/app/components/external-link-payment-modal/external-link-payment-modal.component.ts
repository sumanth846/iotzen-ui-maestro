import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'primeng/api';
import { KioskOrderService } from 'src/app/services/kiosk-order-service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-external-link-payment-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, MessagesModule, FormsModule],
  templateUrl: './external-link-payment-modal.component.html',
  styleUrl: './external-link-payment-modal.component.scss'
})
export class ExternalLinkPaymentModalComponent {
  constructor(private messageService: MessageService, private kioskOrderService: KioskOrderService) { }

  @Input() orderId: string;
  @Input() showLinkModal: boolean;
  @Input() order_id: string;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  customerEmail: string;
  validCustomerEmail: boolean = true;
  sendingEmail: boolean = false;

  ngOnInit(): void {
  }



  closeLinkModal() {
    this.messageService.clear();
    this.customerEmail = "";
    this.closeModal.emit();
  }

  sendRecieptEmail() {
    this.sendingEmail = true;
    this.kioskOrderService?.sendPaymentLink(this.order_id, this.customerEmail).subscribe((data: any) => {
      let res = data;
      let mssg = res?.msg;
      this.sendingEmail = false;
      this.messageService.add({ severity: 'success', summary: 'Link Sent', detail: mssg });
      this.customerEmail = "";

    }, (error) => {
      this.sendingEmail = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to send payment link, try again' });
      this.customerEmail = "";
      console.log(error);
    })

  }
}
