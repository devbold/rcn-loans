import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
// App Models
import { Loan } from './../../models/loan.model';
// App Spinner
import { NgxSpinnerService } from 'ngx-spinner';
// App Components
import { DialogInsufficientFoundsComponent } from '../../dialogs/dialog-insufficient-founds/dialog-insufficient-founds.component';
// App Services
import { Utils } from './../../utils/utils';
import { TxService, Tx } from './../../tx.service';
import { ContractsService } from './../../services/contracts.service';
import { BrandingService } from './../../services/branding.service';
import { ScriptService } from './../../services/script.service';
import { CivicService } from '../../services/civic.service';
import { Web3Service } from '../../services/web3.service';
import { AvailableLoansService } from '../../services/available-loans.service';

@Component({
  selector: 'app-open-loans',
  templateUrl: './open-loans.component.html',
  styleUrls: ['./open-loans.component.scss']
})
export class OpenLoansComponent implements OnInit{
  public loading: boolean;
  available: any;
  loans = [];
  availableLoans = true;
  pendingLend = [];

  constructor(
    private contractsService: ContractsService,
<<<<<<< HEAD
    private txService: TxService,
    private scriptService: ScriptService,
    private brandingService: BrandingService,
=======
>>>>>>> 150d9727de1e0bb38a145cc3b417545dedcbcdd0
    private spinner: NgxSpinnerService,
    private availableLoansService: AvailableLoansService,
    public dialog: MatDialog,
  ) {}

  // Available Loans service
  upgradeAvaiblable() {
    this.availableLoansService.updateAvailable(this.loans.length);
  }

  loadLoans() {
    this.contractsService.getOpenLoans().then((result: Loan[]) => {
      this.loans = result;
      this.upgradeAvaiblable();
      this.spinner.hide();
      if (this.loans.length === 0) {
        this.availableLoans = false;
      }
    });
  }

  // Open Insufficient Founds Dialog
  openDialogFounds() {
    const dialogRef: MatDialogRef<DialogInsufficientFoundsComponent> = this.dialog.open(DialogInsufficientFoundsComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  loadStyles() {
    const dynamicStyles = ['https://hosted-sip.civic.com/css/civic-modal.min.css'];
    for (let i = 0; i < dynamicStyles.length; i++) {
      const node = document.createElement('link');
      node.type = 'text/css';
      node.rel = 'stylesheet';
      node.href = dynamicStyles[i];
      document.getElementsByTagName('head')[0].appendChild(node);
      console.log(dynamicStyles + ' has been added');
    }
  }

  loadScripts() {
    const dynamicScripts = ['https://hosted-sip.civic.com/js/civic.sip.min.js'];
    console.log(dynamicScripts);
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      node.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(node);
      console.log(dynamicScripts + ' has been added');
    }
  }

  scriptsLoader(){
    this.scriptService.load('civic').then(data => {
      console.log('script loaded ', data);
    }).catch(error => console.log(error));
  }

  ngOnInit() {
    this.spinner.show(); // Initialize spinner
    this.loadLoans();
    
    // Available Loans service
    this.availableLoansService.currentAvailable.subscribe(available => this.available = available);
    
    
    this.loadStyles();
    // this.loadScripts();
    
    this.scriptsLoader();
  }
}
