import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatSnackBarModule,
  MatInputModule
} from '@angular/material';

import {IpfsService} from './ipfs.service';
import {EthereumService} from './ethereum.service';
import {StorageService} from './shared/storage.service';


import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {StorageComponent} from './storage/storage.component';
import {FooterComponent} from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StorageComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
    MatInputModule
  ],
  providers: [IpfsService, EthereumService, StorageService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
