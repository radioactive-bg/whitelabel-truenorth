import axios from 'axios';

//works
export async function getUserProfile(access_token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/profile`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    console.log('response of getUserProfile:', JSON.stringify(response));
    return response.data.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch user.');
  }
}
