import {Component, OnInit} from '@angular/core';
import {IpfsService} from '../ipfs.service';
import {EthereumService} from '../ethereum.service';
import {StorageService} from '../shared/storage.service';
import {Storage} from '../shared/storage.model';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit {

  urlToStore = 'https://ethereum.org/images/wallpaper-homestead.jpg';
  storedObject: Storage;

  constructor(private ipfsService: IpfsService,
              public ethereumService: EthereumService,
              private storageService: StorageService) {
  }

  ngOnInit() {
  }

  onStoreContent() {
    const result = this.storageService.storeIpfs(this.urlToStore).then(
      (jsonData) => {
        this.storedObject = new Storage();
        this.storedObject.path = jsonData[0].path;
        this.storedObject.hash = jsonData[0].hash;
        this.storedObject.size = jsonData[0].size;
        this.storedObject.url = this.urlToStore;
        console.log(jsonData);

        this.storageService.storeEthereum(this.storedObject.hash);
      },
      // The 2nd callback handles errors.
      (err) => console.error(err)
    );
    console.log(result);
  }
}
