import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-progress-modal',
  templateUrl: './progress-modal.component.html',
  styleUrls: ['./progress-modal.component.scss']
})
export class ProgressModalComponent {
  @Input() showModal: boolean = false;
  @Input() currentProgress: number = 0;
  @Input() totalProgress: number = 0;

  constructor(private activeModal: NgbActiveModal){

  }
  
  get progressPercentage(): number {
    return (this.currentProgress / this.totalProgress) * 100;
  }

  close() {
    this.activeModal.close();
  }
}
