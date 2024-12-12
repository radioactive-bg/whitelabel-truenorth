import axios from 'axios';

export async function getProductGroupsList(access_token: string) {
  const params = {
    perPage: 50,
  };
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/product-groups`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        params,
      },
    );
    // console.log('getProductGroupsList response.data.data: ', response.data);
    return response;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Price List Export.');
  }
}
