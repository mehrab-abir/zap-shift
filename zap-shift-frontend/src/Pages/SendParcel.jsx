import React, { use } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../Context/Auth/AuthContext";
import useAxios from "../Hook/useAxios";

const SendParcel = () => {
  const { user } = use(AuthContext);
  const { register, handleSubmit, control } = useForm();
  const axios = useAxios();

  const serviceCenters = useLoaderData();
  const regions = [...new Set(serviceCenters.map((c) => c.region))];
  //   console.log(regions)
  //   console.log(serviceCenters);

  const senderRegion = useWatch({
    control,
    name: "senderRegion",
  });
  const receiverRegion = useWatch({
    control,
    name: "receiverRegion",
  });

  const districtByRegion = (region) => {
    const thisRegionObjs = serviceCenters.filter((c) => c.region === region);
    const district = thisRegionObjs.map((r) => r.district);
    // console.log(district);
    return district;
  };

  const handleParcelDetails = (data) => {
    // console.log(data);

    const isDocument = data.parcelType === "document";
    const isSameDistrict = data.senderDistrict === data.receiverDistrict;
    const weight = Number(data.parcelWeight);

    let cost = 0;

    if (isDocument) {
      cost = isSameDistrict ? 60 : 80;
    } else {
      if (weight <= 3) {
        cost = isSameDistrict ? 110 : 150;
      } else {
        const minCharge = isSameDistrict ? 110 : 150;
        const extraWeight = weight - 3;
        const extraCharge = isSameDistrict
          ? extraWeight * 40
          : extraWeight * 40 + 40;
        cost = minCharge + extraCharge;
      }
    }
    const createdAt = new Date();
    const parcelDetails = { ...data, deliveryFee: cost, createdAt };

    // console.log("Total cost : ",cost);
    Swal.fire({
      text: `Total cost : ${cost} BDT`,
      title: "Please review the total cost",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ok, continue!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post("/parcels", parcelDetails).then((afterPost) => {
          if (afterPost.data.insertedId) {
            Swal.fire({
              title: "Thank you.",
              text: "Courier driver is on the way...",
              icon: "success",
            });
          }
        })
        .catch(error=>console.log("Post error",error))
      }
    });
  };

  return (
    <div className="w-11/12 md:w-10/12 mx-auto my-10 bg-surface rounded-lg">
      <div className="p-2 md:p-12">
        <h1 className="text-2xl md:text-4xl font-bold text-primary mb-5">
          Send A Parcel
        </h1>
        <p className="text-lg font-bold text-primary">
          Enter Your Parcel Details
        </p>

        <form onSubmit={handleSubmit(handleParcelDetails)} className="">
          {/* parcel info */}
          <div className="space-y-2">
            <div className="flex gap-4 items-center">
              <label className="">
                <input
                  type="radio"
                  value="document"
                  className="radio radio-sm"
                  defaultChecked
                  {...register("parcelType", { required: true })}
                />
                &nbsp;&nbsp;Document
              </label>
              <label className="">
                <input
                  type="radio"
                  value="non-document"
                  className="radio radio-sm"
                  {...register("parcelType", { required: true })}
                />
                &nbsp;&nbsp; Non-Document
              </label>
            </div>

            <div className="flex flex-col md:flex-row space-y-2 md:gap-10 mt-5">
              <div className="flex-1">
                <label>Parcel Name:</label>
                <input
                  type="text"
                  className="input w-full focus:outline-2 outline-lime-500"
                  {...register("parcelName", { required: true })}
                  placeholder="Parcel name"
                />
              </div>
              <div className="flex-1">
                <label>Parcel Weight (KG)</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  className="input w-full focus:outline-2 outline-lime-500"
                  {...register("parcelWeight", { required: true })}
                  placeholder="Parcel weight (KG)"
                />
              </div>
            </div>
          </div>

          {/* sender and receiver info */}
          <div className="flex flex-col md:flex-row md:gap-10 mt-5">
            {/* sender info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Sender Details</h2>
              <div className="items-center mt-5 space-y-2">
                <div className="flex-1">
                  <label className="font-semibold">Sender Name:</label>
                  <input
                    type="text"
                    defaultValue={user?.displayName}
                    className="input w-full focus:outline-2 outline-lime-500"
                    {...register("senderName", { required: true })}
                    placeholder="Sender name"
                  />
                </div>
                <div className="flex-1">
                  <label className="font-semibold">Sender Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="input w-full focus:outline-2 outline-lime-500"
                    {...register("senderEmail", { required: true })}
                    placeholder="Sender email"
                  />
                </div>
                <div className="flex-1">
                  <label className="font-semibold">Sender Phone No.</label>
                  <input
                    type="text"
                    className="input w-full focus:outline-2 outline-lime-500"
                    {...register("senderPhone", { required: true })}
                    placeholder="Sender phone no"
                  />
                </div>

                <div className="flex-1">
                  <label className="font-semibold">Sender Address</label>
                  <input
                    type="text"
                    className="input w-full focus:outline-2 outline-lime-500"
                    {...register("senderAddress", { required: true })}
                    placeholder="Sender address"
                  />
                </div>

                <div className="flex-1">
                  <label className="font-semibold">Sender Region</label>
                  <select
                    defaultValue="Sender Region"
                    className="select input w-full focus:outline-2 outline-lime-500 cursor-pointer"
                    {...register("senderRegion")}
                  >
                    <option disabled={true}>Sender Region</option>
                    {regions.map((region, index) => {
                      return (
                        <option key={index} value={region}>
                          {region}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="font-semibold">Sender District</label>
                  <select
                    defaultValue="Sender District"
                    className="select input w-full focus:outline-2 outline-lime-500 cursor-pointer"
                    {...register("senderDistrict")}
                  >
                    <option disabled={true}>Sender District</option>
                    {districtByRegion(senderRegion).map((district, index) => {
                      return (
                        <option key={index} value={district}>
                          {district}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="font-semibold">Pickup Instruction</label>
                  <textarea
                    type="text"
                    className="border border-gray-300 p-1 rounded-md w-full focus:outline-2 outline-lime-500"
                    {...register("pickupInstruction", { required: true })}
                    placeholder="Pickup instruction"
                  />
                </div>
              </div>
            </div>

            {/* receiver info */}
            <div className="flex-1 mt-5 md:mt-0">
              <h2 className="text-2xl font-bold">Receiver Details</h2>
              <div className="items-center mt-5 space-y-2">
                <div className="flex-1">
                  <label className="font-semibold">Receiver Name:</label>
                  <input
                    type="text"
                    className="input w-full focus:outline-2 outline-lime-500"
                    {...register("receiverName", { required: true })}
                    placeholder="receiver name"
                  />
                </div>
                <div className="flex-1">
                  <label className="font-semibold">Receiver Email</label>
                  <input
                    type="email"
                    className="input w-full focus:outline-2 outline-lime-500"
                    {...register("receiverEmail", { required: true })}
                    placeholder="receiver email"
                  />
                </div>
                <div className="flex-1">
                  <label className="font-semibold">Receiver Phone No.</label>
                  <input
                    type="text"
                    className="input w-full focus:outline-2 outline-lime-500"
                    {...register("receiverPhone", { required: true })}
                    placeholder="receiver phone no"
                  />
                </div>

                <div className="flex-1">
                  <label className="font-semibold">Receiver Address</label>
                  <input
                    type="text"
                    className="input w-full focus:outline-2 outline-lime-500"
                    {...register("receiverAddress", { required: true })}
                    placeholder="receiver address"
                  />
                </div>

                <div className="flex-1">
                  <label className="font-semibold">Receiver Region</label>
                  <select
                    defaultValue="receiver Region"
                    className="select input w-full focus:outline-2 outline-lime-500 cursor-pointer"
                    {...register("receiverRegion")}
                  >
                    <option disabled={true}>Receiver Region</option>
                    {regions.map((region, index) => {
                      return (
                        <option key={index} value={region}>
                          {region}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="font-semibold">Receiver District</label>
                  <select
                    defaultValue="receiver District"
                    className="select input w-full focus:outline-2 outline-lime-500 cursor-pointer"
                    {...register("receiverDistrict")}
                  >
                    <option disabled={true}>Receiver District</option>
                    {districtByRegion(receiverRegion).map((district, index) => {
                      return (
                        <option key={index} value={district}>
                          {district}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="font-semibold">Delivery Instruction</label>
                  <textarea
                    type="text"
                    className="border border-gray-300 p-1 rounded-md w-full focus:outline-2 outline-lime-500"
                    {...register("deliveryInstruction", { required: true })}
                    placeholder="Delivery instruction"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn bg-primary text-black border-none outline-none hover:shadow-md hover:shadow-lime-300 mt-5 w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendParcel;
