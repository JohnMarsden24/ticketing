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
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  }
};

export default buildClient;
