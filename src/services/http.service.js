import axios from "axios";

class HttpService {
  constructor() {
    this.client = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/api`,
    });
  }

  async get(url, queryParams) {
    const { data } = await this.client.get(url, {
      params: queryParams,
    });
    return data;
  }

  async post(url, payload, queryParams) {
    const { data } = await this.client.post(url, payload, {
      params: queryParams,
    });
    return data;
  }

  async authGet(url, queryParams) {
    const token = localStorage.getItem("token");
    const { data } = await this.client.get(url, {
      params: queryParams,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return data;
  }

  async authPost(url, payload, queryParams) {
    const authToken = localStorage.getItem("token");
    const headers = {
      authorization: `Bearer ${authToken}`,
    };
    if (payload && payload instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    }
    const { data } = await this.client.post(url, payload, {
      params: queryParams,
      headers,
    });
    return data;
  }

  async authPatch(url, payload, queryParams) {
    const authToken = localStorage.getItem("token");
    const headers = {
      authorization: `Bearer ${authToken}`,
    };
    if (payload && payload instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    }
    const { data } = await this.client.patch(url, payload, {
      params: queryParams,
      headers,
    });
    return data;
  }

  async authPut(url, payload, queryParams) {
    const authToken = localStorage.getItem("token");
    const headers = {
      authorization: `Bearer ${authToken}`,
    };
    if (payload && payload instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    }
    const { data } = await this.client.put(url, payload, {
      params: queryParams,
      headers,
    });
    return data;
  }

  async authDelete(url, queryParams) {
    const token = localStorage.getItem("token");
    const { data } = await this.client.delete(url, {
      params: queryParams,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return data;
  }
}

export default new HttpService();
