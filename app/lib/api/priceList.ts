import axios from 'axios';

//works
export async function getPriceList(access_token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/price-lists/company`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    console.log('getPriceList response.data.data: ', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Price List.');
  }
}

//works
export async function getPreview(access_token: string, page: number) {
  const params = {
    productGroup: null,
    productName: null,
    hasBasePrice: null,
    hasSalePrice: null,
    availability: null,
    perPage: 10,
    page: page ? page : 1,
  };
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/price-lists/company/preview`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        params,
      },
    );
    console.log('getPreview response.data.data: ', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Preview.');
  }
}

//works
export async function getPriceListExport(access_token: string) {
  const params = {
    productGroup: null,
    productName: null,
    hasBasePrice: null,
    hasSalePrice: null,
    availability: null,
  };
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/price-lists/company/export`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        params,
      },
    );
    console.log('getPriceListExport response.data.data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Price List Export.');
  }
}

//works
export async function getItmesPriceList(access_token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/price-lists/company/1/items`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    console.log('getItmesPriceList response.data.data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Itmes Price List.');
  }
}

//works
export async function getItemsPriceListExport(access_token: string) {
  const params = {
    productGroup: null,
    productName: null,
    hasBasePrice: null,
    hasSalePrice: null,
    availability: null,
  };
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/price-lists/company/1/items/export`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        params,
      },
    );
    console.log('getItemsPriceListExport response.data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Items Price List Export.');
  }
}
