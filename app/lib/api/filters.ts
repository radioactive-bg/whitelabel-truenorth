import axios from 'axios';

//works
export async function getYesNoFilter(access_token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/filters/yes-no-filter`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
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
export async function getProductGroups(access_token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/filters/product-groups`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
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
export async function getProducts(access_token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/filters/products`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    console.log('getProducts response.data.data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Products.');
  }
}

//works
export async function getStatuses(access_token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/filters/status`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    console.log('getStatuses response.data.data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Statuses.');
  }
}

//works
export async function getTransactionMethods(access_token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/filters/transaction-methods`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
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
export async function getTransactionTypes(access_token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/filters/transaction-types`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
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
export async function getOrderProducts(access_token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/filters/order-products`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
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
export async function getClients(access_token: string, page: number | null) {
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
          Authorization: `Bearer ${access_token}`,
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
export async function getDateType(access_token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/filters/date-type`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
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
