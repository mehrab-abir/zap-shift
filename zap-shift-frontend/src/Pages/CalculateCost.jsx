import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData } from "react-router";

const CalculateCost = () => {
  const serviceCenters = useLoaderData();
  const [totalCost, setTotalCost] = useState();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

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

  const handleCalculation = (data)=>{
    console.log(data);

    const isDocument = data.parcelType === "document";
    const isSameDistrict = data.senderDistrict === data.receiverDistrict;
    const weight = Number(data.parcelWeight);

    let cost = 0;

    if (isDocument) {
      cost = isSameDistrict ? 20 : 35;
    } else {
      if (weight <= 3) {
        cost = isSameDistrict ? 40 : 65;
      } else {
        const minCharge = isSameDistrict ? 40 : 65;
        const extraWeight = weight - 3;
        const extraCharge = isSameDistrict
          ? extraWeight * 20
          : extraWeight * 20 + 20;
        cost = minCharge + extraCharge;
      }
    }

    setTotalCost(cost);
  }

  return (
    <div className="w-11/12 md:w-10/12 bg-surface mx-auto my-10 p-10 rounded-lg">
      <title>Calculate Cost</title>
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-5">
        Calculate Cost
      </h1>
      <p className="text-secondary">
        Enjoy fast, reliable parcel delivery with real-time tracking and zero
        hassle. From personal packages to business shipments — we deliver on
        time, every time.
      </p>
      <p className="my-4 text-muted md:w-[50%]">
        Calculate the cost before you proceed to request a parcel delivery
      </p>

      <div className="flex flex-col md:flex-row justify-around items-center md:p-10">
        <form
          onSubmit={handleSubmit(handleCalculation)}
          className="flex flex-col space-y-3 w-full flex-1"
        >
          <p className="mb-2">Select Parcle Type: </p>
          <div className="flex flex-col sm:flex-row space-x-4 space-y-2 sm:space-y-0 sm:items-center">
            <label className="text-base">
              <input
                type="radio"
                value="document"
                className="radio radio-sm"
                {...register("parcelType", { required: true })}
              />
              &nbsp;&nbsp;Document
            </label>
            <label className="text-base">
              <input
                type="radio"
                value="non-document"
                className="radio radio-sm"
                {...register("parcelType", { required: true })}
              />
              &nbsp;&nbsp;Non-Document
            </label>
          </div>

          <div className="mt-3">
            <label className="font-semibold">Parcel Weight (KG)</label>
            <input
              type="number"
              step="any"
              min="0"
              className="input w-full focus:outline-2 outline-lime-500"
              placeholder="Parcel weight (KG)"
              {...register("parcelWeight")}
              required
            />
          </div>

          <div className="flex-1">
            <label className="font-semibold">Sender Region</label>
            <select
              defaultValue="Sender Region"
              className="select input w-full focus:outline-2 outline-lime-500 cursor-pointer"
              {...register("senderRegion")}
              required
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
              required
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
            <label className="font-semibold">Receiver Region</label>
            <select
              defaultValue="receiver Region"
              className="select input w-full focus:outline-2 outline-lime-500 cursor-pointer"
              {...register("receiverRegion")}
              required
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
            {errors.receiverRegion?.type === "required" && (
              <p className="text-red-500 text-sm">*This field required</p>
            )}
          </div>

          <div className="flex-1">
            <label className="font-semibold">Receiver District</label>
            <select
              defaultValue="receiver District"
              className="select input w-full focus:outline-2 outline-lime-500 cursor-pointer"
              {...register("receiverDistrict")}
              required
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
            {errors.receiverDistrict?.type === "required" && (
              <p className="text-red-500 text-sm">*This field required</p>
            )}
          </div>

          <button type="submit" className="btn bg-primary text-black">
            Calculate Cost
          </button>
        </form>
        <div className="self-center text-center mt-10 md:mt-0 flex-1">
          {totalCost > 0 ? (
            <>
              <h3 className="text-2xl md:text-3xl font-bold">Total Cost: </h3>
              <h3 className="text-2xl font-semibold mt-2 text-accent">
                ${totalCost}
              </h3>
            </>
          ) : (
            <h3 className="text-2xl md:text-3xl font-bold">Total Cost </h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculateCost;
