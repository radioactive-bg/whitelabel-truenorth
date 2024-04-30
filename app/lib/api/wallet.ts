import axios from 'axios';

//works
export async function getWalletsList(access_token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/wallets`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    console.log('getWalletsList response.data.data: ', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Wallets List.');
  }
}

//error -500 -server error
export async function getShowWallets(access_token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/wallets/1`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    console.log('getShowWallets response.data.data: ', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Show Wallets.');
  }
}

//error -500 -server error
export async function getTransactionsList(access_token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/wallets/1/transactions`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    console.log('getTransactionsList response.data.data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Transactions List.');
  }
}

//add more data when you figurte out how to get the body params
//error -500 -server error
export async function postCredit(access_token: string) {
  const Body = {
    type: 'redeem_card',
    data: {
      number: '123',
      cvv: '123',
    },
  };
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/wallets/1/credit`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: Body,
      },
    );
    console.log('postCredit response.data.data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Post Credit.');
  }
}

//error -500 -server error
export async function checkCredit(access_token: string) {
  const body = {
    type: 'redeem_card',
    data: {
      number: '123',
      cvv: '123',
    },
  };
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/wallets/check-credit`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    console.log('checkCredit response.data.data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Check Credit.');
  }
}

//works
export async function getCreditMethods(access_token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/wallets/credit-methods`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    console.log('getCreditMethods response.data.data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Credit Methods.');
  }
}
