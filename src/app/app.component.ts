import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title="Learnspace";

  schema = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    'name': 'Learnspace',
    'url': 'https://learnspace.co.nz',
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+64-021-02264770",
      "contactType": "Customer service"
    }
  };
}