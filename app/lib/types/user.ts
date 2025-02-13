// ACL & User Types

interface ACLActions {
  view: boolean;
  store?: boolean;
}

interface ACLOrderSpecial {
  downloadInvoice: boolean;
  storePreOrder: boolean;
}

interface ACLOrder {
  list: {
    crud: ACLActions;
    special: ACLOrderSpecial;
  };
}

interface ACLWalletSpecial {
  redeemCards: boolean;
  redeemInvoiceCode: boolean;
}

interface ACLTransactions {
  crud: ACLActions;
}

interface ACLWallet {
  list: {
    crud: ACLActions;
    special: ACLWalletSpecial;
  };
  transactions: ACLTransactions; // nested transactions inside wallet
}

interface ACLProfileSpecial {
  login: boolean;
  logout: boolean;
}

interface ACLProfile {
  list: {
    crud: ACLActions;
    special: ACLProfileSpecial;
  };
}

interface ACLCompany {
  list: {
    crud: ACLActions;
  };
  priceList: {
    crud: ACLActions;
  };
}

interface ACLFilters {
  list: {
    crud: ACLActions;
  };
}

interface ACLPayoutTransaction {
  list: {
    crud: {
      view: boolean;
      store: boolean;
    };
  };
}

interface ACLPayoutMethod {
  list: {
    crud: {
      view: boolean;
    };
  };
}

interface CompanyPayout {
  isEnable: boolean;
}

export interface Company {
  payout: CompanyPayout;
}

export interface ACL {
  orders: ACLOrder;
  wallet: ACLWallet;
  profile: ACLProfile;
  company: ACLCompany;
  filters: ACLFilters;
  payoutTransaction: ACLPayoutTransaction;
  payoutMethod: ACLPayoutMethod;
}

export interface User {
  id: number;
  name: string;
  email: string;
  is2FAEnable: boolean;
  company: Company;
  acl: ACL;
}
