import axios from "axios";
import { BASEURI } from "../common/config";

const state = {
  user: {},
  error: null,
  items: [],
  isAuth: false
};

const getters = {
  getError: state => state.error,
  getItems: state => state.items,
  getIsAuth: state => state.isAuth,
  getUser(state) {
    return state.user;
  }
};

const actions = {
  async login(context, payload) {
    try {
      const data = await axios.get(`${BASEURI}/users/checkAuth`, {
        auth: {
          username: payload.username,
          password: payload.password
        }
      });
      context.commit("setErrors", null);
    } catch (error) {
      context.commit("setErrors", error.response.data);
    }
  },
  async getUserByName(context, payload) {
    try {
      const data = await axios.get(
        `${BASEURI}/users/getByName/${payload.username}`,
        {
          auth: {
            username: payload.username,
            password: payload.password
          }
        }
      );
      console.log("ddd => ", data.data);
      context.commit("setAuth", data.data);
    } catch (error) {
      context.commit("setErrors", error.response.data);
    }
  },
  async register(context, user) {
    try {
      const data = await axios.post(`${BASEURI}/users/register`, user);

      context.commit("setErrors", null);
    } catch (error) {
      context.commit("setErrors", error.response.data);
    }
  },
  async getAllItems(context, payload) {
    try {
      const data = await axios.get(`${BASEURI}/items/getAll`, {
        auth: {
          username: payload.username,
          password: payload.password
        }
      });
      console.log("DATA => ", data.data);
      context.commit("setItems", data.data);
    } catch (error) {
      context.commit("setErrors", error.response.data);
    }
  },
  async deleteItemById(context, payload) {
    try {
      await axios.delete(`${BASEURI}/items/delete/${payload.id}`, {
        auth: {
          username: payload.username,
          password: payload.password
        }
      });
    } catch (error) {
      context.commit("setErrors", error.response.data);
    }
  },
  async addItem(context, payload) {
    try {
      await axios.post(
        `${BASEURI}/items/addItem`,
        {
          sellerID: payload.sellerID,
          name: payload.name,
          description: payload.description,
          price: payload.price
        },
        {
          auth: {
            username: payload.username,
            password: payload.password
          }
        }
      );
    } catch (error) {
      context.commit("setErrors", error.response.data);
    }
  },
  async updateItem(context, payload) {
    try {
      await axios.put(
        `${BASEURI}/items/updateItem/${payload.id}`,
        {
          name: payload.name,
          description: payload.description,
          price: payload.price
        },
        {
          auth: {
            username: payload.username,
            password: payload.password
          }
        }
      );
    } catch (error) {
      context.commit("setErrors", error.response.data);
    }
  },
  logout(context) {
    context.commit("logout");
  }
};

const mutations = {
  logout(state) {
    state.user = {};
    state.isAuth = false;
  },
  setAuth(state, payload) {
    state.error = null;
    state.user = payload;
    state.isAuth = true;
  },
  setAuthReg(state, payload) {
    state.error = null;
    state.isAuth = true;
  },
  setErrors(state, payload) {
    state.error = payload;
  },
  setItems(state, payload) {
    state.error = null;
    state.items = payload;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
