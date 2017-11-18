import {Injectable} from '@angular/core';
import {Account} from './account';
import {MatSnackBar} from "@angular/material";

const web3Host = 'http://localhost';
const web3Port = '8545';

declare var require: any;

const contractInterface = [{
  'constant': false,
  'inputs': [{
    'name': 'x',
    'type': 'string'
  }],
  'name': 'set',
  'outputs': [],
  'type': 'function'
}, {
  'constant': true,
  'inputs': [],
  'name': 'get',
  'outputs': [{
    'name': 'x',
    'type': 'string'
  }],
  'type': 'function'
}];


@Injectable()
export class EthereumService {
  accounts: Account[];
  web3: any;
  contractInstance: any;
  contract: any;
  contractAddress: any;
  currentData: any;
  contractObject = {
    from: '',
    gas: 300000,
    data: '0x6060604052610282806100126000396000f360606040526000357c010000000000000000000000000000000000000000000' +
    '0000000000000900480634ed3885e146100445780636d4ce63c1461009a57610042565b005b61009860048080359060200190820180' +
    '35906020019191908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505' +
    '0505050909091905050610115565b005b6100a760048050506101c6565b604051808060200182810382528381815181526020019150' +
    '80519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561010757808203805160018' +
    '36020036101000a031916815260200191505b509250505060405180910390f35b806000600050908051906020019082805460018160' +
    '0116156101000203166002900490600052602060002090601f016020900481019282601f1061016457805160ff19168380011785556' +
    '10195565b82800160010185558215610195579182015b82811115610194578251826000505591602001919060010190610176565b5b' +
    '5090506101c091906101a2565b808211156101bc57600081815060009055506001016101a2565b5090565b50505b50565b602060405' +
    '190810160405280600081526020015060006000508054600181600116156101000203166002900480601f0160208091040260200160' +
    '405190810160405280929190818152602001828054600181600116156101000203166002900480156102735780601f1061024857610' +
    '100808354040283529160200191610273565b820191906000526020600020905b815481529060010190602001808311610256578290' +
    '03601f168201915b5050505050905061027f565b9056'
  };
  sendDataObject = {
    from: '',
    gas: 300000,
  };

  constructor(public snackBar: MatSnackBar) {
    this.initializeEthereum();
    this.loadContract();
    this.deployStorage();
  }

  private loadAccounts() {
    const ethAccounts = this.web3.eth.accounts;
    this.accounts = [];

    for (let i = 0; i < ethAccounts.length; i++) {
      const account = new Account();
      account.name = ethAccounts[i];
      account.balance = this.getBalance(ethAccounts[i]);
      this.accounts.push(account);
    }
    console.log(this.accounts);

    // set first account as default "from" in contract
    if (this.accounts.length > 0) {
      this.contractObject.from = this.accounts[0].name;
      this.sendDataObject.from = this.accounts[0].name;
    }
  }

  private getBalance(name: String) {
    const balance = this.web3.eth.getBalance(name);
    return parseFloat(this.web3.fromWei(balance, 'ether'));
  }

  private initializeEthereum() {
    /* web3 initialization */
    const Web3 = require('web3');
    this.web3 = new Web3();
    this.web3.setProvider(new this.web3.providers.HttpProvider(web3Host + ':' + web3Port));
    if (!this.web3.isConnected()) {
      this.snackBar.open('Ethereum - no connection to RPC server');
      console.error('Ethereum - no connection to RPC server');
    } else {
      this.snackBar.open('Ethereum - connected to RPC server');
    }

    this.loadAccounts();
  }

  private deployStorage() {

    if (this.contractInstance) {
      this.snackBar.open('Contract already been deployed at: ' + this.contractAddress);
      console.error('Contract already been deployed at: ', this.contractAddress);
      return;
    }

    this.contract.new(this.contractObject, (err, contract) => {
      if (err) {
        console.error('Contract deployment error: ', err);
        this.snackBar.open('Contract deployment error: ' + err);

      } else if (contract.address) {
        this.contractAddress = contract.address;
        this.contractInstance = this.contract.at(contract.address);
        this.snackBar.open('Contract successfully deployed at: ' + contract.address);

      } else if (contract.transactionHash) {
        this.snackBar.open('Awaiting contract deployment with transaction hash: ' + contract.transactionHash);
      } else {
        this.snackBar.open('Unresolved contract deployment error');
        console.error('Unresolved contract deployment error');
      }
    });
  }

  storeAddress(data) {
    if (!this.contractInstance) {
      this.snackBar.open('Ensure the storage contract has been deployed');
      console.error('Ensure the storage contract has been deployed');
      return;
    }

    if (this.currentData === data) {
      this.snackBar.open('Overriding existing data with same data');
      console.error('Overriding existing data with same data');
      return;
    }

    this.contractInstance.set.sendTransaction(data, this.sendDataObject, (err, result) => {
      if (err) {
        this.snackBar.open('Transaction submission error:' + err);

        console.error('Transaction submission error:', err);
      } else {
        this.currentData = data;
        this.snackBar.open('Address successfully stored. Transaction hash:' + result);
        return this.currentData;
      }
    });
  }


  private loadContract() {
    this.contract = this.web3.eth.contract(contractInterface);
  }
}
