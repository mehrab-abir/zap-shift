import React from 'react'
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
});

const useBasicAxios = () => {
    return instance;
};

export default useBasicAxios;