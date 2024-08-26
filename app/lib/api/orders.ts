import axios from 'axios';
//import { access_token } from '../constants';

const ITEMS_PER_PAGE = 10;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchInvoicesParams {
  orderId?: string | null;
  dateFrom?: string;
  dateTo?: string;
  dateType?: string;
  client?: string | null;
  product?: string | null;
  status?: string | null;
  perPage?: number;
  page?: number | null;
}

export async function getOrdersList(
  access_token: string,
  currentPage: number | null,
  statuses: number[],
) {
  const params = new URLSearchParams({
    perPage: ITEMS_PER_PAGE.toString(),
    page: currentPage ? currentPage.toString() : '1',
  });

  statuses.forEach((status) => {
    params.append('status[]', status.toString());
  });

  try {
    const response = await axios.get(`${API_URL}/distributor-crm/v1/orders`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      params, // axios automatically converts this to a query string
    });

    //console.log('getOrdersList response: ', response);
    return response;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

//works
export async function fetchOrderPage(currentPage: number | null) {
  const params: FetchInvoicesParams = {
    orderId: null,
    dateFrom: '',
    dateTo: '',
    dateType: '',
    client: null,
    product: null,
    status: null,
    perPage: ITEMS_PER_PAGE,
    page: currentPage ? currentPage : 1,
  };

  try {
    const response = await axios.get(`${API_URL}/distributor-crm/v1/orders`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      params, // axios automatically converts this to a query string
    });

    const totalPages = Math.ceil(
      Number(response.data.data.length) / ITEMS_PER_PAGE,
    );
    //console.log('response: ', response.data);
    return totalPages;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

//works
export async function fetchOrderById(ID: string) {
  try {
    const response = await axios.get(
      `${API_URL}/distributor-crm/v1/orders/${Number(ID)}`,
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
    throw new Error('Failed to fetch invoice by ID.');
  }
}

//works
export async function downloadInvoice(ID: number) {
  const params = {
    invoiceFormat: 'pdf',
    onlyFirstPage: false,
  };

  try {
    const response = await axios.get(
      `${API_URL}/distributor-crm/v1/orders/${ID}/download`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        params,
        responseType: 'blob', // Ensure the response is a blob
      },
    );
    console.log('response downloadInvoice:', response);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch invoice by ID.');
  }
}

//works
export async function getInvoice(ID: number, access_token: string) {
  try {
    const response = await axios.get(
      `${API_URL}/distributor-crm/v1/orders/${ID}/cards`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      },
    );

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error response data:', error.response?.data);
      console.error('Axios error response status:', error.response?.status);
      console.error('Axios error response headers:', error.response?.headers);
    } else {
      console.error('Unexpected error:', error);
    }
    throw new Error('Failed to fetch invoice by ID.');
  }
}

export async function createOrder(products: any[], vat: number | null) {
  let requestBody = {
    products: products,
    vat: vat,
  };
  console.log('requestBody in createOrder :', JSON.stringify(requestBody));

  const token = localStorage.getItem('access_token');

  if (!token) {
    throw new Error('No access token found');
  }

  console.log('requestBody in createOrder :', requestBody);
  console.log('access_token in createOrder :', token);

  try {
    const response = await axios.post(
      `${API_URL}/distributor-crm/v1/orders`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log('Axios response.data.data from createOrder:', response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error response data:', error.response?.data);
      console.error('Axios error response status:', error.response?.status);
      console.error('Axios error response headers:', error.response?.headers);
    } else {
      console.error('Unexpected error:', error);
    }
    throw new Error('Failed to create order.');
  }
}
