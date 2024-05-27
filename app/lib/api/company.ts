import axios from 'axios';
//import { accessToken } from '../constants';

//works
export async function getCompany(access_token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/company`,
      {
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${access_token}`,
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      },
    );
    console.log('getCompany response.data.data: ', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch Company.');
  }
}
