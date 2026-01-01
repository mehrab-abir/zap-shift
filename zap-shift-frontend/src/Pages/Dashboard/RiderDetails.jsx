import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router';
import useAxios from '../../Hook/useAxios';

const Field = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <p className="text-sm opacity-70">{label}</p>
    <p className="font-semibold wrap-break-words">{value || "—"}</p>
  </div>
);

const RiderDetails = () => {
    const {id} = useParams();
    const axios = useAxios();

    const {data : rider, isLoading} = useQuery({
        queryKey : ["rider", id],
        queryFn : async ()=>{
            const response = await axios.get(`/riders/${id}`);
            return response.data;
        }
    })

    if(isLoading){
        return <p><i>Loading...</i></p>
    }

    return (
      <div className="w-11/12 md:w-10/12 mx-auto my-10">
        <div className="bg-surface p-6 md:p-10 rounded-xl shadow">
          <h1 className="text-2xl md:text-4xl font-bold mb-6">Rider Details</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Name" value={rider?.name} />
            <Field label="Email" value={rider?.email} />

            <Field label="Driving License" value={rider?.drivingLicense} />
            <Field label="Phone Number" value={rider?.phoneNumber} />

            <Field label="Bike Model" value={rider?.bikeModel} />
            <Field
              label="Bike Registration Number"
              value={rider?.bikeRegistrationNumber}
            />

            <Field label="Current Address" value={rider?.currentAddress} />
            <Field label="Rider Region" value={rider?.riderRegion} />

            <Field label="Status" value={rider?.status} />
            <Field label="Applied At" value={rider?.appliedAt} />
          </div>
        </div>
      </div>
    );
};

export default RiderDetails;