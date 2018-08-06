import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CollateralSelectorComponent } from './collateral-selector/collateral-selector.component';
import { AssetItem } from '../../models/asset.model';
import { Tx, TxService } from '../../tx.service';
import { ContractsService } from '../../services/contracts.service';
import { environment } from '../../../environments/environment';
import { Utils } from '../../utils/utils';
import { Web3Service } from '../../services/web3.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-loan',
  templateUrl: './request-loan.component.html',
  styleUrls: ['./request-loan.component.scss']
})
export class RequestLoanComponent implements OnInit, OnDestroy {
  pending: Tx = undefined;

  selectedCollateral: AssetItem[] = [];

  private txCb;

  constructor(
    public dialog: MatDialog,
    private contractService: ContractsService,
    private txService: TxService,
    private router: Router,
  ) { }

  ngOnInit() {
    console.log('Hi!');
    this.loadPendingTx();
  }

  ngOnDestroy(): void {
    if (this.txCb !== undefined) {
      this.txService.unsubscribe(this.txCb);
    }
  }

  verboseSelectedCollateral(): string {
    let result = '';
    this.selectedCollateral.forEach(c => result += c.asset.name + ' ' + c.id + ', ');
    return result;
  }

  loadPendingTx() {
    this.pending = this.txService.getPendingRequest();

    if (this.pending !== undefined) {
      this.txCb = this.txService.subscribe((tx: Tx, receipt: any) => {
        if (tx === this.pending) {
          // Find the created loan ID
          console.log(receipt);
          // Search for the 'createdLoan' event and open detail in new window
          const log = receipt.logs.find(r => r.topics[0] === '0xd1acb464ac8b592a0bd76da52fada20c0b6e5fc41cccd5ad10a27f7e410a9302');
          const id = parseInt(log.data.substring(2, 66), 16);
          this.router.navigate(['/loan/' + id]);
          // Unsubscribe
          this.txService.unsubscribe(this.txCb);
        }
      });
    }
  }

  openCollateralSelector() {
    console.log('Open collateral window');
    const dialogRef = this.dialog.open(CollateralSelectorComponent, { data: {
      pawnManager: environment.contracts.pawnManager
    }});

    dialogRef.afterClosed().subscribe(selected => {
      console.log('Selected', selected);
      this.selectedCollateral = selected;
    });
  }

  async onSubmit(event: any, _amount, _duration, _firstpayment, _interestrate, _description) {
    event.preventDefault();

    if (this.pending !== undefined) {
      window.open(environment.network.explorer.tx.replace('${tx}', this.pending.tx), '_blank');
    } else {
      const amount = _amount.value * 10 ** 18;
      const duration = _duration.value * 24 * 60 * 60;
      const firstPayment = _firstpayment.value * 24 * 60 * 60;
      const interestRate = 311040000000000 / _interestrate.value;
      const expirationRequest = Math.floor(Date.now() / 1000) + (31 * 24 * 60 * 60); // 31 days
      const description = _description.value;

      let txHash: string;

      if (this.selectedCollateral.length === 0) {
        // Create a classic loan
        // TODO Show alert non-attractive loan
        // TODO Open in a new tab a pending transaction
        txHash = await this.contractService.requestLoan(amount, duration, firstPayment, interestRate, description);
      } else {
        // tslint:disable-next-line:max-line-length
        txHash = await this.contractService.requestPawnLoan(amount, duration, firstPayment, interestRate, description, this.selectedCollateral);
      }

      this.txService.registerRequestTx(txHash);
      this.loadPendingTx();
    }
  }
}
