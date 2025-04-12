import axios from 'axios';

const server1 = axios.create({
  baseURL: 'http://localhost:3001/api',
});

const server2 = axios.create({
  baseURL: 'http://localhost:3002/api',
});

let useServer2 = false;

const addInterceptors = (instance, serverName) => {
  instance.interceptors.request.use((config) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${serverName} Request:`, {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data
    });

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      const timestamp = new Date().toLocaleTimeString();
      console.log(`[${timestamp}] ${serverName} Response:`, {
        status: response.status,
        url: response.config.url
      });
      return response;
    },
    (error) => {
      const timestamp = new Date().toLocaleTimeString();
      console.error(`[${timestamp}] ${serverName} Error:`, {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message
      });
      throw error;
    }
  );
};

addInterceptors(server1, 'Server 1');
addInterceptors(server2, 'Server 2');

const instance = {
  async get(url) {
    try {
      if (useServer2) {
        return await server2.get(url);
      }
      const response = await server1.get(url);
      return response;
    } catch (error) {
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'] || 5;
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        useServer2 = true;
        return server2.get(url);
      }
      throw error;
    }
  },

  async post(url, data) {
    try {
      if (useServer2) {
        return await server2.post(url, data);
      }
      const response = await server1.post(url, data);
      return response;
    } catch (error) {
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'] || 5;
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        useServer2 = true;
        return server2.post(url, data);
      }
      throw error;
    }
  },

  async put(url, data) {
    try {
      if (useServer2) {
        return await server2.put(url, data);
      }
      const response = await server1.put(url, data);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        useServer2 = true;
        return server2.put(url, data);
      }
      throw error;
    }
  },

  async delete(url) {
    try {
      if (useServer2) {
        return await server2.delete(url);
      }
      const response = await server1.delete(url);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        useServer2 = true;
        return server2.delete(url);
      }
      throw error;
    }
  }
};

export default instance;