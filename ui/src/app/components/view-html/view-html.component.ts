import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { KeywordService } from 'src/app/services/keyword.service';
@Component({
  selector: 'app-view-html',
  template: `<iframe style="width:100vw; height:100vh" [src]="iframeSrc"></iframe>`
})
export class ViewHtmlComponent {
  safeHtmlContent!: any;
  iframeSrc!: SafeResourceUrl;
  constructor(private keywordService: KeywordService, private sanitizer: DomSanitizer, private route: ActivatedRoute) {}

  ngOnInit() {
    const keywordId = this.route.snapshot.paramMap.get('keywordId');
    if (keywordId) {
      this.keywordService.getKeywordById(keywordId).subscribe({
        next: statusResponse => {
          const scrapedHtml = statusResponse?.data?.keyword?.htmlContent;
          this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(scrapedHtml);
          const blob = new Blob([this.safeHtmlContent], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }
}
