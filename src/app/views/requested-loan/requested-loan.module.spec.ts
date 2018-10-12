import { RequestedLoanModule } from './requested-loan.module';

describe('RequestedLoanModule', () => {
  let requestedLoanModule: RequestedLoanModule;

  beforeEach(() => {
    requestedLoanModule = new RequestedLoanModule();
  });

  it('should create an instance', () => {
    expect(requestedLoanModule).toBeTruthy();
  });
});
