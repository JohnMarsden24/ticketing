import axios from 'axios';

const buildClient = (req) => {
  /**
   * Kubernetes Namespace external communication
   */
  if (typeof window !== 'undefined') {
    return axios.create({
      baseURL: '/',
    });
  } else {
    return axios.create({
      baseURL: 'http://www.ticketing-app.me/',
      headers: req.headers,
    });
  }
};

export default buildClient;
