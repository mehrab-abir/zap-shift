import React, { use, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { AuthContext } from "../Context/Auth/AuthContext";

const axiosInstance = axios.create({
  baseURL: "https://zap-shift-backend-theta.vercel.app",
  // baseURL : "http://localhost:3000",
});

const useAxios = () => {
  const { user, logOutUser, loading } = use(AuthContext);
  const navigate = useNavigate();
  const isLoggingOutRef = useRef(false);

  useEffect(() => {
    //request interceptor
    const reqInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        if (loading || !user) return config;

        const token = await user.getIdToken();

        config.headers = config.headers ?? {};
        config.headers.authorization = `Bearer ${token}`;

        return config;
      },
      (error) => Promise.reject(error)
    );

    //response interceptor
    const responseInterceptor = axiosInstance.interceptors.response.use((response)=>{
      return response;
    }, async (error)=>{
      // console.log(error);

      const statusCode = error?.response?.status;

      if (!user || loading) return Promise.reject(error);
      
       if ((statusCode === 401 || statusCode === 403) && !isLoggingOutRef.current) {
         isLoggingOutRef.current = true;

         // leave private routes first
         navigate("/", { replace: true });
         try {
           await logOutUser();
         } finally {
           setTimeout(() => {
             isLoggingOutRef.current = false; //for future logOut
           }, 800);
         }
       }

      return Promise.reject(error)
    });

    return () => {
      axiosInstance.interceptors.request.eject(reqInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [user, loading, logOutUser, navigate]);

  return axiosInstance;
};

export default useAxios;
