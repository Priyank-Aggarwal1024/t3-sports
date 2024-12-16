import axios from 'axios';


let nimbusPostToken = null; // Store token in memory (or securely in Redis if needed)
let tokenExpiryTime = null;

const getNimbusPostToken = async () => {
  // Check if token is still valid
  if (nimbusPostToken && new Date() < tokenExpiryTime) return nimbusPostToken;

  // Get a new token
  const response = await axios.post('https://nimbuspost.com/auth/token', {
    // API keys and credentials
  });

  
  nimbusPostToken = response.data.token;
  tokenExpiryTime = new Date(new Date().getTime() + response.data.expires_in * 1000);
  return nimbusPostToken;
};

const getCourier = async () => {
  const token = await getNimbusPostToken();
  const response = await axios.get('https://nimbuspost.com/api/v1/courier', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
