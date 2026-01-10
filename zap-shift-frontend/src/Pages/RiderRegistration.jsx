import React from "react";
import { use } from "react";
import { AuthContext } from "../Context/Auth/AuthContext";
import { useForm, useWatch } from "react-hook-form";
import rider from "../assets/agent-pending.png";
import { useLoaderData, useNavigate } from "react-router";
import useAxios from "../Hook/useAxios";
import Swal from "sweetalert2";
import { useState } from "react";

const RiderRegistration = () => {
  const { user } = use(AuthContext);
  const servieCenters = useLoaderData();

  const axiosHook = useAxios();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, reset } = useForm();

  const regions = [...new Set(servieCenters.map((c) => c.region))];

  const riderRegion = useWatch({
    control,
    name: "riderRegion",
  });

  const districtByRegion = (region) => {
    const thisRegionsObjs = servieCenters.filter((c) => c.region === region);
    const districts = thisRegionsObjs.map((r) => r.district);
    return districts;
  };

  const registerRider = async (data) => {
    // console.log(data);

    setIsSubmitting(true);

    try {
      const rider = {
        ...data,
        status: "pending",
        appliedAt: new Date(),
      };

      const response = await axiosHook.post("/riders", rider);
      if (response.data.insertedId) {
        Swal.fire({
          title: "Thank you for your application. We will contact you soon.",
          icon: "success",
          draggable: true,
        });
        navigate('/',{replace : true})
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="w-11/12 md:w-10/12 mx-auto bg-surface my-10 p-10 rounded-xl">
      <h1 className="text-2xl md:text-4xl font-bold my-5">Be A Rider</h1>
      <p className="text-primary my-3">
        Enjoy fast, reliable parcel delivery with real-time tracking and zero
        hassle. From personal packages to business shipments — we deliver on
        time, every time.
      </p>

      <h3 className="text-lg md:text-2xl font-bold mt-10 mb-5">
        Tell Us About Yourself
      </h3>

      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-20">
        <form
          onSubmit={handleSubmit(registerRider)}
          className="flex flex-col w-full flex-1 space-y-2.5"
        >
          <div className="flex flex-col">
            <label className="text-primary">Name:</label>
            <input
              type="text"
              className="input w-full focus:outline-2 outline-lime-500"
              {...register("riderName")}
              value={user?.displayName}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-primary">Email:</label>
            <input
              type="email"
              className="input w-full focus:outline-2 outline-lime-500"
              {...register("riderEmail")}
              value={user?.email}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-primary">Driving License Number:</label>
            <input
              type="text"
              className="input w-full focus:outline-2 outline-lime-500"
              {...register("drivingLicense")}
              placeholder="Enter your driving license number"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-primary">NID Number:</label>
            <input
              type="text"
              className="input w-full focus:outline-2 outline-lime-500"
              {...register("nidNumber")}
              placeholder="Enter your NID number"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-primary">Phone Number:</label>
            <input
              type="text"
              className="input w-full focus:outline-2 outline-lime-500"
              {...register("phoneNumber")}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-primary">Bike Model and Year:</label>
            <input
              type="text"
              className="input w-full focus:outline-2 outline-lime-500"
              {...register("bikeModel")}
              placeholder="Bike brand model and year"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-primary">Bike Registration Number:</label>
            <input
              type="text"
              className="input w-full focus:outline-2 outline-lime-500"
              {...register("bikeRegistrationNumber")}
              placeholder="Bike registration number"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-primary">Current Address:</label>
            <input
              type="text"
              className="input w-full focus:outline-2 outline-lime-500"
              {...register("currentAddress")}
              placeholder="Your current address"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-primary">Region</label>
            <select
              defaultValue="Region"
              className="select input w-full focus:outline-2 outline-lime-500 cursor-pointer"
              {...register("riderRegion")}
              required
            >
              <option disabled={true}>Your Region</option>
              {regions.map((region, index) => {
                return (
                  <option key={index} value={region}>
                    {region}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-primary">District</label>
            <select
              defaultValue="District"
              className="select input w-full focus:outline-2 outline-lime-500 cursor-pointer"
              {...register("riderDistrict")}
              required
            >
              <option disabled={true}>Your District</option>
              {districtByRegion(riderRegion).map((district, index) => {
                return (
                  <option key={index} value={district}>
                    {district}
                  </option>
                );
              })}
            </select>
          </div>
          <button onClick={()=>reset()} className="btn btn-sm max-w-fit">Reset</button>

          <button
            type="submit"
            className="btn bg-primary mt-5 text-black cursor-pointer"
          >
            {isSubmitting ? <i>Submitting...</i> : "Submit"}
          </button>
        </form>

        <div className="flex-1 self-center">
          <img src={rider} alt="" className="object-cover" />
        </div>
      </div>
    </div>
  );
};

export default RiderRegistration;
