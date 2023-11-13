import { Component, OnDestroy } from '@angular/core';
import { FileService } from '../../services/file.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProgressModalComponent } from '../progress-modal/progress-modal.component';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../toast/toast.component';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnDestroy {
  file: File | null = null;
  fileName: string = '';
  showModal = false;
  currentProgress = 0;
  totalProgress = 0;
  fileUploadId = null;
  private modalRef: any;
  private pollingSubscription!: Subscription;
  constructor(private fileService: FileService, 
    private modalService: NgbModal, 
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute) {}

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    if (file && file.type === 'text/csv') {
      this.file = file;
      this.fileName = file.name;
      this.uploadFile();
    }
  }

  uploadFile(): void {
    if (this.file) {
      this.fileService.uploadFile(this.file).subscribe({
        next: response => {
          console.log(response);
          this.fileUploadId = response.uploadId || 1;
          this.totalProgress = response.totalCount;
          this.openProgressModal();
          this.pollUploadStatus();
        },
        error: error => {
          this.toastService.showError(`Error occurred while uploading the file -  ${error?.error?.message}`, 5000);
        }
      });
    }
  }

  pollUploadStatus(): void {
    if (this.fileUploadId) {
      this.pollingSubscription = this.fileService.pollUploadStatus(this.fileUploadId).subscribe({
        next: statusResponse => {
          this.currentProgress = statusResponse.completedCount;
          if (this.currentProgress >= this.totalProgress) {
            this.completeProgress();
          } else {
            this.updateProgress(this.currentProgress);
          }
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }

  openProgressModal() {
    this.modalRef = this.modalService.open(ProgressModalComponent, { size: 'sm', centered: true });
    this.modalRef.componentInstance.currentProgress = this.currentProgress;
    this.modalRef.componentInstance.totalProgress = this.totalProgress;
  }

  updateProgress(newProgress: number) {
    if (this.modalRef) {
      this.modalRef.componentInstance.currentProgress = newProgress;
    }
  }

  completeProgress() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.toastService.showSuccess('Keyword upload processed successfully');

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}
