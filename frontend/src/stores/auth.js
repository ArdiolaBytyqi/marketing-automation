import { defineStore } from "pinia";
import api from "../api/index";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === "admin",
    isMarketer: (state) => state.user?.role === "marketer",
  },

  actions: {
    async login(email, password) {
      const res = await api.post("/auth/login", { email, password });
      this.token = res.data.token;
      this.user = res.data.user;
      localStorage.setItem("token", this.token);
      localStorage.setItem("user", JSON.stringify(this.user));
    },
   
 async register(name, email, password) {
  const res = await api.post("/auth/register", { 
    name, 
    email, 
    password,
    role: "client"
  });
  this.token = res.data.token;
  this.user = res.data.user;
  localStorage.setItem("token", this.token);
  localStorage.setItem("user", JSON.stringify(this.user));
},

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});