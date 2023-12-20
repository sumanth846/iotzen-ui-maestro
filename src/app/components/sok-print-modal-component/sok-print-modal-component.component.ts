import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { printReceiptOnSok } from 'src/app/state/kiosk/kiosk.action';
import { AppState } from 'src/app/state/app.state';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-sok-print-modal',
  standalone: true,
  imports: [DialogModule],
  templateUrl: './sok-print-modal-component.component.html',
  styleUrl: './sok-print-modal-component.component.scss'
})
export class SokPrintModalComponent {
  @Input() orderId: number | string;
  @Input() orderNo: number | unknown;
  @Input() visible: boolean = false;
  @Output() resetVerification: EventEmitter<unknown> = new EventEmitter<unknown>();

  constructor(private store: Store<AppState>) {

  }

  ngOnInit() {

  }

  printSok() {
    this.store.dispatch(printReceiptOnSok({ orderId: this.orderId }))
    this.resetVerification.emit(true)
  }

  cancelPrint() {
    this.resetVerification.emit(true)
  }
}
