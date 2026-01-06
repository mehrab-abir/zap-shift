import React from 'react'
import axios from "axios";

const instance = axios.create({
  baseURL: "https://zap-shift-backend-theta.vercel.app",
});

const useBasicAxios = () => {
    return instance;
};

export default useBasicAxios;