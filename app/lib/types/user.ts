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

interface ACLWallet {
  list: {
    crud: ACLActions;
    special: ACLWalletSpecial;
  };
}

interface ACLTransactions {
  crud: ACLActions;
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

export interface ACL {
  orders: ACLOrder;
  wallet: ACLWallet;
  transactions: ACLTransactions;
  profile: ACLProfile;
  company: ACLCompany;
  filters: ACLFilters;
}

export interface User {
  id: number;
  name: string;
  email: string;
  is2FAEnable: boolean;
  acl: ACL;
}
