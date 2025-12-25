import React from "react";
import serviceImg from "../../assets/service.png";

const OurServices = () => {
  return (
    <div className="mt-10 py-10 bg-accent md:rounded-3xl">
      <h1 className="text-center text-2xl md:text-4xl font-bold text-white">
        Our Services
      </h1>
      <p className="text-center my-8 text-white md:w-[60%] mx-auto">
        Enjoy fast, reliable parcel delivery with real-time tracking and zero
        hassle. From personal packages to business shipments — we deliver on
        time, every time.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-10">
        <div className="flex flex-col items-center p-6 rounded-3xl bg-surface space-y-3 hover:bg-lime-300!">
          <img src={serviceImg} alt="" />
          <h3 className="text-xl font-bold text-center text-primary">
            Express and Standard Delivery
          </h3>
          <p className="text-sm text-secondary text-center">
            We deliver parcels within 24-72 hours in Dhaka, Chittagong, Sylhet,
            Khulna, and Rajshahi. Express delivery available in Dhaka within 4-6
            hours from pick-up to drop-off.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 rounded-3xl bg-surface space-y-3 hover:bg-lime-300!">
          <img src={serviceImg} alt="" />
          <h3 className="text-xl font-bold text-center text-primary">
            Nationwide Delivery
          </h3>
          <p className="text-sm text-secondary text-center">
            We deliver parcels nationwide with home delivery in every district,
            ensuring your products reach customers within 48-72 hours.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 rounded-3xl bg-surface space-y-3 hover:bg-lime-300!">
          <img src={serviceImg} alt="" />
          <h3 className="text-xl font-bold text-center text-primary">
            Fulfillment Solution
          </h3>
          <p className="text-sm text-secondary text-center">
            We also offer customized service with inventory management support,
            online order processing, packaging, and after sales support.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 rounded-3xl bg-surface space-y-3 hover:bg-lime-300!">
          <img src={serviceImg} alt="" />
          <h3 className="text-xl font-bold text-center text-primary">
            Cash on Home Delivery
          </h3>
          <p className="text-sm text-secondary text-center">
            100% cash on delivery anywhere in Bangladesh with guaranteed safety
            of your product.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 rounded-3xl bg-surface space-y-3 hover:bg-lime-300!">
          <img src={serviceImg} alt="" />
          <h3 className="text-xl font-bold text-center text-primary">
            Corporate Service / Contract In Logistics
          </h3>
          <p className="text-sm text-secondary text-center">
            Customized corporate services which includes warehouse and inventory
            management support.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 rounded-3xl bg-surface space-y-3 hover:bg-lime-300!">
          <img src={serviceImg} alt="" />
          <h3 className="text-xl font-bold text-center text-primary">
            Parcel Return
          </h3>
          <p className="text-sm text-secondary text-center">
            Through our reverse logistics facility we allow end customers to
            return or exchange their products with online business merchants.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurServices;
