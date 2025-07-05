import axios from './axios';
import { setCookie } from './cookies';

export const verifyGoogleToken = async (token) => {
  try {
    const response = await axios.post(`/api/account/verify-google/${token}`);
    if (response.data && response.data.token) {
      setCookie('jwtToken', response.data.token);
      console.log(response.data);
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
