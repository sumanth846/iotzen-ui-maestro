import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-online-modal',
  standalone: true,
  imports: [DialogModule],
  templateUrl: './online-modal.component.html',
  styleUrl: './online-modal.component.scss'
})
export class OnlineModalComponent {
  @Input() qrProps: any;
  @Input() branchName: string;
  @Input() showOtherMethods: boolean = false
  @Output() emitQrIsClosed: EventEmitter<void> = new EventEmitter();
  @Output() emitOpenRzp: EventEmitter<void> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  closeQRModal() {
    this.emitQrIsClosed.emit();
  }
  openRazorpay() {
    this.emitOpenRzp.emit();
  }
}
