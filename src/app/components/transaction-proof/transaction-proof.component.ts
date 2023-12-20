import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-transaction-proof',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './transaction-proof.component.html',
  styleUrl: './transaction-proof.component.scss'
})
export class TransactionProofComponent {
  @Input() visible: boolean = false;
  @Input() isMobileView: boolean = false;
  @Output() sendTransactionProofSubmit: EventEmitter<{}> = new EventEmitter();


  selectedFile: File = null;
  showCameraModule: boolean;
  cameraImages: string;
  imageSelected: boolean;
  transactionId: string = '';

  onHideModal() {
    this.visible = false
    this.sendTransactionProofSubmit.emit(null)
  }

  skip() {
    this.visible = false
    this.sendTransactionProofSubmit.emit('skip')

  }

  openCameraModal() {
    this.showCameraModule = true
  }
  openUploadModal() {

  }

  onFileSelected(event): void {
    this.selectedFile = null
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile)
  }

  onUpload() {

  }

  getSelectedFileURL(): string {
    return this.selectedFile ? URL.createObjectURL(this.selectedFile) : '';
  }

  capturedImages(images) {
    this.cameraImages = images[0].url;
  }
  reopenCamera() {
    this.cameraImages = ''
  }
  closeCameraModal(imageSelected = false) {
    this.cameraImages = ''
    this.showCameraModule = false;
    (imageSelected ? this.imageSelected = false : null)
  }

  imageOk() {
    this.imageSelected = true
    this.showCameraModule = false;
  }
  submitTransactionProof() {
    if (this.cameraImages) {
      this.sendTransactionProofSubmit.emit({ image: this.cameraImages, transacctionId: this.transactionId })
    }
  }
}
