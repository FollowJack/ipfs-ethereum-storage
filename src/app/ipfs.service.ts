import {Injectable} from '@angular/core';
import {EthereumService} from './ethereum.service';

const ipfsHost = 'localhost';
const ipfsAPIPort = '5001';
const ipfsWebPort = '8080';

declare var require: any;

@Injectable()
export class IpfsService {
  ipfsAddress: string;
  node: any;
  IPFSHash;
  currentData;

  constructor(private ethereumService: EthereumService) {
    this.initializeIpfs();
  }

  private initializeIpfs() {
    console.log('Initialize IPFS');

    /* IPFS initialization */
    const IPFS = require('ipfs-api');
    this.node = new IPFS(ipfsHost, ipfsAPIPort); // , {protocol: 'https'}

    /*this.node.on('ready', () => {
      console.log('IPFS Node is now ready');

      // stopping a node
      this.node.stop(() => {
        console.log('IPFS Node is now offline');
      });
    });*/
  }

  storeContent(url: string) {
    return this.node.util.addFromURL(url);/*, (err, result) => {
      if (err) {
        console.error('Content submission error:', err);
        return false;
      } else if (result && result[0] && result[0].hash) {
        console.log('Content successfully stored. IPFS address:', result[0].hash);
        return result[0].hash;
      } else {
        console.error('Unresolved content submission error');
        return null;
      }
    });*/
  }

  fetchContent() {
    if (!this.ethereumService.contractInstance) {
      console.error('Storage contract has not been deployed');
      return;
    }

    this.ethereumService.contractInstance.get.call((err, result) => {
      if (err) {
        console.error('Content fetch error:', err);
      } else if (result && this.IPFSHash === result) {
        console.log('New data is not mined yet. Current data: ', result);
        return;
      } else if (result) {
        this.IPFSHash = result;
        const url = this.ipfsAddress + '/' + result;
        console.log('Content successfully retrieved. IPFS address', result);
        console.log('Content URL:', URL);
      } else {
        console.error('No data, verify the transaction has been mined');
      }
    });
  }

}
