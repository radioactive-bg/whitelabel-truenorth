import axios from 'axios';
//import { access_token } from '../constants';

//works
export async function getYesNoFilter() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/filters/yes-no-filter`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      },
    );
    console.log('getYesNoFilter response.data.data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Yes No Filter.');
  }
}

//works
export async function getProductGroups() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/filters/product-groups`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      },
    );
    console.log('getProductGroups response.data.data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Product Groups.');
  }
}
//works
export async function getRegions() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/filters/regions`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Product Groups.');
  }
}

export async function getCurrencies() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/filters/currencies`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Product Groups.');
  }
}

//works
export async function getProducts() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/filters/products`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      },
    );
    //console.log('getProducts response.data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Products.');
  }
}

//works
export async function getStatuses() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/filters/status`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      },
    );
    //console.log('getStatuses response.data.data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Statuses.');
  }
}

//works
export async function getTransactionMethods() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/filters/transaction-methods`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      },
    );
    console.log('getTransactionMethods response.data.data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Transaction Methods.');
  }
}

//works
export async function getTransactionTypes() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/filters/transaction-types`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      },
    );
    console.log('getTransactionTypes response.data.data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Transaction Types.');
  }
}

//works
export async function getOrderProducts() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/filters/order-products`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      },
    );
    console.log('getOrderProducts response.data.data: ', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Order Products.');
  }
}

//works
export async function getClients(page: number | null) {
  const params = {
    page: page ? page : 1,
    q: 'NewClient',
  };
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/filters/clients`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        params,
      },
    );
    console.log('getClients response.data.data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Order Products.');
  }
}

//works
export async function getDateType() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/filters/date-type`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      },
    );
    console.log('getDateType response.data.data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Date Type.');
  }
}
