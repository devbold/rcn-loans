import { Agent } from '../../environments/environment';
import { CompanyIdentity } from './../models/identity.model';

export const companyIdentities = {
    [Agent.RipioCreator]: new CompanyIdentity(
            'Ripio',
<<<<<<< HEAD
            'Ripio is one of the leading Bitcoin wallets in Latin America. ... Ripio is offering its services across several Latin American countries.',
            '../../assets/img/logo-ripio-white.svg',
            new Date()
=======
            'Ripio is now one of the main Blockchain companies in Latin America. Ripio main product is their mobile wallet that operates on Bitcoin, Ether and local currency: users can receive, store, buy / sell and send cryptocurrency, and also make digital payments from their mobile phones, and also request micro-loans to finance their purchases.',
            'https://ripio-cms-us.s3.amazonaws.com/filer_public/80/d7/80d76109-a560-446c-9385-d6d911168dbe/logo-ripio-white.svg',
            'August 2013'
>>>>>>> 150d9727de1e0bb38a145cc3b417545dedcbcdd0
        )
};
