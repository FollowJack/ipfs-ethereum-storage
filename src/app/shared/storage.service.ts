import {Injectable} from '@angular/core';
import {IpfsService} from '../ipfs.service';
import {EthereumService} from '../ethereum.service';

@Injectable()
export class StorageService {

  constructor(public ipfsService: IpfsService,
              public ethereumService: EthereumService) {
  }

  storeIpfs(url: string) {
    const result = this.ipfsService.storeContent(url);
    return result;
  }

  storeEthereum(hash: string) {
    const result = this.ethereumService.storeAddress(hash);
    return result;
  }
}
