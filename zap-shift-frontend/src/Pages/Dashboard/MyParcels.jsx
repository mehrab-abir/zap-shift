import React from "react";
import { use } from "react";
// import { useEffect } from "react";
// import { useState } from "react";
import { AuthContext } from "../../Context/Auth/AuthContext";
import useAxios from "../../Hook/useAxios";
import { useQuery } from "@tanstack/react-query";

const MyParcels = () => {
  const { user } = use(AuthContext);
  const axios = useAxios();

  const { data: myParcels = [], isLoading, isFetching } = useQuery({
    queryKey: ["myParcels", user?.email],
    queryFn: async () => {
      const response = await axios.get(`/parcels?email=${user?.email}`);
      return response.data;
    },
  });

  if(isLoading){
    return <p><i>Percels Loading...</i></p>
  }

  /* const [myParcels, setMyparcels] = useState([]);

    useEffect(()=>{
        if(!user.email) return <p><i>Parcels loading...</i></p>

        axios.get(`/parcels?email=${user?.email}`)
        .then(response =>setMyparcels(response.data));
    },[axios, user?.email]) */

  return (
    <div className="w-11/12 md:w-10/12 mx-auto my-5">
        {isFetching && <p><i>fetching data...</i></p>}
      <h1 className="text-2xl font-bold">My Parcels {myParcels.length}</h1>
    </div>
  );
};

export default MyParcels;
