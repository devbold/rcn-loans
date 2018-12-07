import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, NgForm, Validators } from '@angular/forms';
import {
  MatStepper,
  MatSnackBar,
  MatSnackBarHorizontalPosition
} from '@angular/material';
// App Models
import { Loan, Status } from './../../models/loan.model';
// App Services
import { environment } from '../../../environments/environment.prod';
import { Utils } from '../../utils/utils';
import { ContractsService } from './../../services/contracts.service';
import { Web3Service } from './../../services/web3.service';

@Component({
  selector: 'app-create-loan',
  templateUrl: './create-loan.component.html',
  styleUrls: ['./create-loan.component.scss']
})
export class CreateLoanComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';

  // Date Variables
  now: Date = new Date();
  tomorrow: Date = new Date();
  tomorrowDate: any = new Date(this.tomorrow.setDate(this.now.getDate() + 1));

  // Form Variables
  isOptional$ = true;
  isEditable$ = true;
  disabled$ = false;

  formGroup1: FormGroup;
  fullDuration: any;
  payableAtDate: FormControl;
  annualInterest: any;
  annualPunitory: any;
  requestValue: any;
  requestedCurrency: any;
  returnValue: any = 0;

  fullDurationContract: Date;
  requestValueContract: number;
  requestedCurrencyContract: number;
  annualInterestContract: number;
  annualPunitoryContract: number;

  formGroup4: FormGroup;
  expirationRequestDate: FormControl;

  requiredInvalid$ = false;
  currencies: string[] = ['RCN', 'MANA', 'ARS'];
  selectedOracle: string;

  skipped = false;

  // Card Variables
  loan: Loan;
  account: string;

  // Progress bar
  progress: number;

  constructor(
    private contractsService: ContractsService,
    private web3Service: Web3Service,
    public snackBar: MatSnackBar
  ) { }

  createFormControls() { // Create form controls and define values
    this.fullDuration = new FormControl(0, Validators.required); // formGroup1
    this.payableAtDate = new FormControl('0', Validators.required); // formGroup1
    this.annualInterest = new FormControl((40), Validators.required); // formGroup1
    this.annualPunitory = new FormControl('60', Validators.required); // formGroup1
    this.requestValue = new FormControl('0'); // formGroup1
    this.requestedCurrency = new FormControl(undefined, Validators.required); // formGroup1

    this.expirationRequestDate = new FormControl('', Validators.required); // formGroup4
  }

  createForm() { // Create form groups
    this.formGroup1 = new FormGroup({
      duration: new FormGroup({
        fullDuration: this.fullDuration,
        payableAtDate: this.payableAtDate
      }),
      interest: new FormGroup({
        annualInterest: this.annualInterest,
        annualPunitory: this.annualPunitory
      }),
      conversionGraphic: new FormGroup({
        requestValue: this.requestValue,
        requestedCurrency: this.requestedCurrency
      })
    });

    this.formGroup4 = new FormGroup({
      expiration: new FormGroup({
        expirationRequestDate: this.expirationRequestDate
      })
    });

    this.buildLoan();
    this.formGroup1.valueChanges.subscribe(() => { this.buildLoan(); });
    this.formGroup4.valueChanges.subscribe(() => { this.buildLoan(); });
  }

  buildDuration(duration: Date): number {
    if (!duration) {
      return 60;
    }
    return Math.floor((duration.getTime() - new Date().getTime()) / 1000);
  }

  buildCurrency() {
    switch (this.selectedOracle) {
      case 'asd':
        return '0x0000000000000000000000000000000000000000';
        break;
      case 'MANA':
        return '0x0000000000000000000000000000000000000000';
        break;
      default:
        return '';
    }
  }

  buildLoan() {
    this.loan = new Loan(
      '0xbee217bfe06c6faaa2d5f2e06ebb84c5fb70d9bf', // engine
      0, // id
      this.selectedOracle, // oracle
      Status.Request, // statusFlag
      this.account, // borrower
      this.account, // creator
      this.requestValue.value * 10 ** 18, // rawAmount
      this.buildDuration(this.fullDuration.value), // duration
      311040000000000 / this.annualInterest.value, // rawAnnualInterest
      311040000000000 / this.annualPunitory.value, // rawAnnualPunitoryInterest
      this.buildCurrency(), // currencyRaw
      0, // rawPaid
      0, // cumulatedInterest
      0, // cumulatedPunnitoryInterest
      this.fullDuration, // interestTimestamp
      0, // dueTimestamp
      0, // lenderBalance
      this.tomorrowDate, // expirationRequest
      '0x0', // owner
      '0x0' // cosigner
    );

    this.returnValue = Utils.formatAmount(this.loan.expectedReturn);
  }

  onSubmitStep1(form: NgForm) {
    if (this.formGroup1.valid) {
      console.info(form + ' Is Valid');
    } else {
      this.requiredInvalid$ = true;
    }
  }

  onCreateLoan() {
    if (this.formGroup4.valid) {
      console.info('VALID FORM');

      const duesIn = new Date(this.fullDurationContract);
      const cancelableAt = new Date(this.fullDurationContract);
      const expirationRequest = new Date();
      expirationRequest.setDate(expirationRequest.getDate() + 30); // FIXME: HARKCODE

      this.contractsService.requestLoan(
        this.selectedOracle, // This is the oracle
        Utils.asciiToHex(this.requestedCurrencyContract), // This is the currency
        this.requestValueContract, // This is the amount
        Utils.formatInterest(this.annualInterestContract), // This is the interest
        Utils.formatInterest(this.annualPunitoryContract), // This is the punitory
        this.fullDuration,
        this.fullDuration,
        // duesIn.getTime() / 1000, // This is the duesIn
        // cancelableAt.getTime() / 1000, // This is the cancelableAt
        expirationRequest.getTime() / 1000, // This is the expirationRequest
        '' // This is the metaData
      );

      this.openSnackBar('Your Loan is being processed. It might be available in a few seconds', ''); // Notify about the transaction

    } else {
      console.info('INVALID FORM');
    }
  }

  moveTo(index: number) {
    this.stepper.selectedIndex = index;
  }

  onCurrencyChange(requestedCurrency) {
    switch (requestedCurrency.value) {
      case 'RCN':
        this.selectedOracle = Utils.address0x;
        break;
      case 'MANA':
        if (environment.production) {
          this.selectedOracle = '0x2aaf69a2df2828b55fa4a5e30ee8c3c7cd9e5d5b'; // Mana Prod Oracle
        } else {
          this.selectedOracle = '0xac1d236b6b92c69ad77bab61db605a09d9d8ec40'; // Mana Dev Oracle
        }
        break;
      case 'ARS':
        if (environment.production) {
          this.selectedOracle = '0x22222c1944efcc38ca46489f96c3a372c4db74e6'; // Ars Prod Oracle
        } else {
          this.selectedOracle = '0x0ac18b74b5616fdeaeff809713d07ed1486d0128'; // Ars Dev Oracle
        }
        break;
      default:
        this.selectedOracle = 'Please select a currency to unlock the oracle';
    }
  }
  onRequestedChange() {
    if (this.requestValue.value < 0) { this.requestValue = new FormControl(0); } // Limit de min to 0
    if (this.requestValue.value > 1000000) { this.requestValue = new FormControl(1000000); } // Limit the max to 1000000
  }
  expectedReturn() {
    // if (this.fullDuration === 60) {
    //   this.returnValue = Utils.formatAmount(returnInterest);
    //   console.info('Duration Undefined');
    // } else {
    //   console.info('Touched duration');
    //   const duration = Math.round((new Date(this.fullDuration.value).getTime() - new Date().getTime()) / 1000);
    //   const rawAnnualInterest = Math.floor(311040000000000 / this.annualInterest.value);
    //   const requestAmount = this.requestValue.value;
    //   this.returnValue = Math.floor((requestAmount * 100000 * duration) / rawAnnualInterest) + requestAmount;
    //   console.info(duration);
    //   console.info(rawAnnualInterest);
    //   console.info(requestAmount);
    //   console.info(this.returnValue);
    // }
  }

  openSnackBar(message: string, action: string) { // On metamask transaction requested
    this.snackBar.open(message , action, {
      duration: 4000,
      horizontalPosition: this.horizontalPosition
    });
  }

  onSelectionChange() {
    switch (this.stepper.selectedIndex) {
      case 0:
        if (this.formGroup1.valid) { // Form 1 is completed
          this.progress = 60;
        } else {
          this.progress = 0;
        }
        break;
      case 1:
        if (this.formGroup1.valid) { // Form 1 is completed
          this.progress = 60;
        }
        break;
      default:
        this.progress = 0;
    }
  }

  ngOnInit() {
    this.web3Service.loginEvent.subscribe(() => this.loadLogin());
    this.loadLogin();
    this.createFormControls(); // Generate Form Controls variables
    this.createForm(); // Generate Form Object variables
    console.info(this.loan);
  }

  async loadLogin() {
    this.account = await this.web3Service.getAccount();
    this.buildLoan();
  }
}
