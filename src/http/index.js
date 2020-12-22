import Vue from "vue";
import axios from "./axios.js";

const http = {
  get(url, params = {}, headers = {}) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params,
          headers,
        })
        .then((resp) => {
          resolve(resp);
        })
        .catch((err) => {
          console.log("error:", err);
          resolve(null);
        });
    });
  },

  post(url, data = {}) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, data)
        .then((resp) => resolve(resp))
        .catch((err) => {
          console.log("error:", err);
          resolve(null);
        });
    });
  },

  del(url, data = {}) {
    return new Promise((resolve, reject) => {
      axios
        .delete(url, { data })
        .then((resp) => resolve(resp))
        .catch((err) => {
          console.log("error:", err);
        });
    });
  },

  put(url, data) {
    return new Promise((resolve, reject) => {
      axios
        .put(url, data)
        .then((resp) => resolve(resp))
        .catch((err) => {
          console.log("error:", err);
          resolve(null);
        });
    });
  },
};

function request(url, data, method = "get") {
  return http[method](url, data);
}

export default {
  get: http.get,
  post: http.post,
  delete: http.del,
  put: http.put,
  request,
};
