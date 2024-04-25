import axios from 'axios';

const fetchData = async (url, id) => {
  try {
    const fullUrl = id ? `${url}${id}` : url;
    console.log('Fetching data from:', fullUrl);
    const response = await axios.get(fullUrl);
    const data = response.data;
    console.log('Data fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return error.response.data;
  }
};

const postData = async (url, body) => {
  try {
    const response = await axios.post(url, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error posting data:', error);
    return error.response.data;
  }
};

const putData = async (url, body) => {
  try {
    const response = await axios.put(url, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error putting data:', error);
    return error.response.data;
  }
};

const deleteData = async (url, body) => {
  try {
    const response = await axios.delete(url, { data: body });
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error deleting data:', error);
    return error.response.data;
  }
};

export { fetchData, postData, putData, deleteData };
