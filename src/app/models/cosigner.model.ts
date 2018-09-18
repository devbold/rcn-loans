import { Loan } from './loan.model';

export class CosignerDetail {}

export class Cosigner {
    constructor (
        public contract: string,
        public cosignerDetail: CosignerDetail
    ) {}
}

export class CosignerOffer extends Cosigner {
    constructor (
        public contract: string,
        public cosignerDetail: CosignerDetail,
        public lendData: string,
        public cancel: () => Promise<string>
    ) {
        super(contract, cosignerDetail);
    }
}

export class CosignerLiability extends Cosigner {
    constructor (
        public contract: string,
        public cosignerDetail: CosignerDetail,
        public canClaim: (address: string) => boolean,
        public claim: () => Promise<string>
    ) {
        super(contract, cosignerDetail);
    }
}

export class UnknownCosigner extends CosignerDetail {
    constructor () {
        super();
    }
}
