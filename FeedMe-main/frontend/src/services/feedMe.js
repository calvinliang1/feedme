import axios from 'axios';

const DEFAULT_ERROR = 'Unable to process request.';

export const post = async (url, authToken, data = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) headers.Authorization = `Token ${authToken}`;

  try {
    return await fetch(`${process.env.REACT_APP_SERVER_URL}${url}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error(error);
    throw new Error(DEFAULT_ERROR);
  }
};

export const get = async (url, authToken) => {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers.Authorization = `Token ${authToken}`;
  
    try {
      return await fetch(`${process.env.REACT_APP_SERVER_URL}${url}`, {
        method: 'GET',
        headers: headers,
      });
    } catch (error) {
      console.error(error);
      throw new Error(DEFAULT_ERROR);
    }
  };