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
  tomorrowDate: Date = new Date(this.tomorrow.setDate(this.now.getDate() + 1));

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
  currencies: string[] = ['rcn', 'mana', 'ars'];
  selectedOracle: string;

  skipped = false;

  // Card Variables
  account: string;
  loan: Loan = new Loan(
    '0xbee217bfe06c6faaa2d5f2e06ebb84c5fb70d9bf', // engine
    0, // id
    this.selectedOracle, // oracle
    Status.Request, // statusFlag
    '0xe4d3ba99ffdae47c003f1756c01d8e7ee8fef7c9', // borrower
    '0x0679cde060990fb409cb19b4434714c1e5f2ae6e', // creator
    1, // rawAmount
    this.fullDuration, // duration
    this.annualInterest, // rawAnnualInterest
    this.annualPunitory, // rawAnnualPunitoryInterest
    this.requestedCurrency = '', // currencyRaw
    this.returnValue, // rawPaid
    0, // cumulatedInterest
    0, // cumulatedPunnitoryInterest
    this.fullDuration, // interestTimestamp
    this.fullDuration, // dueTimestamp
    0, // lenderBalance
    0, // expirationRequest
    '0x0', // owner
    '0x0' // cosigner
  );

  // Progress bar
  progress: number;

  constructor(
    private contractsService: ContractsService,
    private web3Service: Web3Service,
    public snackBar: MatSnackBar
  ) {}

  createFormControls() { // Create form controls and define values
    this.fullDuration = new FormControl(0, Validators.required); // formGroup1
    this.payableAtDate = new FormControl('0', Validators.required); // formGroup1
    this.annualInterest = new FormControl('40', Validators.required); // formGroup1
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
  }

  onSubmitStep1(form: NgForm) {
    if (this.formGroup1.valid) {
      this.fullDurationContract = new Date();
      console.info('You are Submit fullDuration ' + this.fullDurationContract);

      this.requestedCurrencyContract = form.value.conversionGraphic.requestedCurrency;
      console.info('You are Submit requestedCurrency ' + this.requestedCurrencyContract);

      this.requestValueContract = form.value.conversionGraphic.requestValue;
      console.info('You are Submit requestValue ' + this.requestValueContract);

      this.annualInterestContract = form.value.interest.annualInterest;
      console.info('You are Submit annualInterest ' + this.annualInterestContract);

      this.annualPunitoryContract = form.value.interest.annualPunitory;
      console.info('You are Submit annualPunitory ' + this.annualPunitoryContract);

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
      case 'rcn':
        this.selectedOracle = Utils.address0x;
        break;
      case 'mana':
        if (environment.production) {
          this.selectedOracle = '0x2aaf69a2df2828b55fa4a5e30ee8c3c7cd9e5d5b'; // Mana Prod Oracle
        } else {
          this.selectedOracle = '0xac1d236b6b92c69ad77bab61db605a09d9d8ec40'; // Mana Dev Oracle
        }
        break;
      case 'ars':
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
    const interest = this.annualInterest.value / 100;
    const returnInterest = (interest * this.requestValue.value) + this.requestValue.value; // Calculate the return amount
    this.returnValue = Utils.formatAmount(returnInterest);
  }
  expectedDuration() {
    const now = Math.round((new Date()).getTime() / 1000);
    this.fullDuration.value = Math.round((this.fullDuration.value).getTime() / 1000);
    this.fullDuration.value = this.fullDuration.value - now;
    this.fullDuration.value = Utils.formatDelta(this.fullDuration.value); // Calculate the duetime of the loan
  }

  openSnackBar(message: string, action: string) {
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
    this.web3Service.getAccount().then((account) => {
      this.account = Utils.shortAddress(account); // Get account address
    });
    console.info(Status.Request);

    this.createFormControls(); // Generate Form Controls variables
    this.createForm(); // Generate Form Object variables
  }
}
