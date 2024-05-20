
import axios from "axios";

const setOptions = (url: string, params: any) => {
  const options = {
    method: 'GET',
    url,
    params: params,
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNWUzNDcyODZmNGI1NDMwNmIwYjRkZjcwOWExMzE0NCIsInN1YiI6IjY2NDY3ZGJiNTA2MzY3OTI2NTRjMGVjNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HtZ66gwZJhpIIEKl5r-jEXsqpnAsRUNG3nqaQ0Wt-dw',
    },
  };
  return options;
};

export const fetchApi = async (url: string, params: any) => {
  try {
    const response = await axios.request(setOptions(url, params));
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching genres');
  }
};

