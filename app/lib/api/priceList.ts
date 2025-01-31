import axios from 'axios';

//works
export async function getPriceList() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/price-lists/company`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      },
    );
    //console.log('getPriceList response.data.data: ', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Price List.');
  }
}

//works
export async function getPreview(
  page: number,
  regionId: any[] | null,
  currencyIso: any[] | null,
  productName: string | null,
  productGroupIds: any[] | null,
  availability: boolean | null,
  hasBasePrice: boolean | null,
  hasSalePrice: boolean | null,
) {
  let queryString = `perPage=10&page=${page}`;

  if (productName !== null)
    queryString += `&productName=${encodeURIComponent(productName)}`;
  if (availability !== null) queryString += `&availability=${availability}`;
  if (hasBasePrice !== null) queryString += `&hasBasePrice=${hasBasePrice}`;
  if (hasSalePrice !== null) queryString += `&hasSalePrice=${hasSalePrice}`;

  // Add each product group ID to the queryString
  if (productGroupIds) {
    productGroupIds.forEach((id) => {
      queryString += `&productGroupIds[]=${id}`;
    });
  }

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //maybe from here down if the .env var says iraq we can remove the regions and currencyIso
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  // Add each region ID to the queryString
  if (regionId) {
    regionId.forEach((id) => {
      queryString += `&regionId=${id}`;
    });
  }

  // Add each currency to the queryString
  if (currencyIso) {
    currencyIso.forEach((currency) => {
      queryString += `&currencyIso=${currency}`;
    });
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/price-lists/company/preview?${queryString}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      },
    );
    // console.log('getPreview response.data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Preview.');
  }
}

//works
export async function getPriceListExport() {
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        params,
      },
    );
    //console.log('getPriceListExport response.data.data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Price List Export.');
  }
}

//works
export async function getItmesPriceList() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/price-lists/company/1/items`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
export async function getItemsPriceListExport() {
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
