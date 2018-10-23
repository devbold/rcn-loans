import { Component, OnInit } from '@angular/core';
// App Component
import { MatDialog, MatDialogRef } from '@angular/material';
import { Web3Service } from '../../services/web3.service';
import { ContractsService } from '../../services/contracts.service';
import { EventsService, Category } from '../../services/events.service';
import { environment } from '../../../environments/environment';

export enum ApproveTarget { Basalt, LoanManager }

@Component({
  selector: 'app-dialog-approve-contract',
  templateUrl: './dialog-approve-contract.component.html',
  styleUrls: ['./dialog-approve-contract.component.scss']
})
export class DialogApproveContractComponent implements OnInit {
  autoClose: boolean;
  displayOnly: ApproveTarget;
  lender: string;

  approved = [];
  basaltApproved: boolean;
  loanManagerApproved: boolean;

  constructor(
    private web3Service: Web3Service,
    private contracts: ContractsService,
    private eventsService: EventsService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<DialogApproveContractComponent>
  ) { }

  loadLender() {
    this.web3Service.getAccount().then((resolve: string) => {
      this.lender = resolve;
    });
  }
  async loadApproved(): Promise<any> {
    const pbasalt = this.contracts.isBasaltApproved();
    const pmanager = this.contracts.isLoanManagerApproved();
    this.approved[ApproveTarget.Basalt] = await pbasalt;
    this.approved[ApproveTarget.LoanManager] = await pmanager;
  }
  display(target: ApproveTarget): boolean {
    return this.displayOnly === undefined || target === this.displayOnly;
  }
  clickCheck(target: ApproveTarget) {
    let action;
    let actionCode;

    if (this.approved[target]) {
      actionCode = 'disapprove';
      action = this.contracts.disapproveEngine();
    } else {
      actionCode = 'approve';
      action = this.contracts.approveEngine();
    }

    this.eventsService.trackEvent(
      'click-' + actionCode + '-basalt-rcn',
      Category.Account,
      environment.contracts.basaltEngine
    );

    action.then(() => {
      this.loadApproved().then(() => {
        this.eventsService.trackEvent(
          actionCode + '-basalt-rcn',
          Category.Account,
          environment.contracts.basaltEngine
        );
        if (this.autoClose) {
          this.dialogRef.close(this.isApproved);
        }
      });
    });
  }
  ngOnInit() {
    this.loadLender();
    this.loadApproved();
  }
}
