import axios from "axios";

// Create Axios instance
export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData = null, headers = null, params = null) => {
  return axiosInstance({
    method,
    url,
    data: bodyData,
    headers,
    params,
  });
};

export default apiConnector;
