export default function setupAxios(axios) {
    axios.defaults.baseURL = process.env.REACT_APP_API_URL
    axios.interceptors.request.use(
      config => config,
      err => Promise.reject(err)
    );
    axios.interceptors.response.use(
      response => {
        return response;
      },
      err => Promise.reject(err)
    );
  }