import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// App Services
import { NgxSpinnerService } from 'ngx-spinner';
import { ContractsService } from './../../services/contracts.service';
// App Utils
import { Utils } from './../../utils/utils';
// App Modules
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../../shared/shared.module';
// App Component
import { ActiveLoansComponent } from './active-loans.component';

@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
    SharedModule,
    Utils
  ],
  declarations: [
    ActiveLoansComponent,
  ],
  providers: [
    ContractsService,
    NgxSpinnerService
  ]
})
export class ActiveLoansModule { }
