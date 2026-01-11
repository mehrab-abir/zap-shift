import React from 'react';
import { BsTruck } from "react-icons/bs";
import { BsCashCoin } from "react-icons/bs";
import { PiWarehouseDuotone } from "react-icons/pi";

const HowItWorks = () => {
    return (
      <div className="w-10/12 md:w-full mt-10 bg-base mx-auto">
        <h1 className="text-2xl font-bold">How It Works</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-5 gap-4">
          <div className="p-5 bg-surface rounded-3xl">
            <BsTruck className="text-4xl mt-3" />
            <h4 className="text-lg font-bold my-3">Booking Pick & Drop</h4>
            <p className="text-sm">
              From personal packages to business shipments — we deliver on time,
              every time.
            </p>
          </div>
          <div className="p-5 bg-surface rounded-3xl">
            <BsCashCoin className="text-4xl mt-3" />
            <h4 className="text-lg font-bold my-3">Cash On Delivery</h4>
            <p className="text-sm">
              From personal packages to business shipments — we deliver on time,
              every time.
            </p>
          </div>
          <div className="p-5 bg-surface rounded-3xl ">
            <PiWarehouseDuotone className="text-4xl mt-3" />
            <h4 className="text-lg font-bold my-3">Delivery Hub</h4>
            <p className="text-sm">
              From personal packages to business shipments — we deliver on time,
              every time.
            </p>
          </div>
          <div className="p-5 bg-surface rounded-3xl">
            <BsTruck className="text-4xl mt-3" />
            <h4 className="text-lg font-bold my-3">Booking SME & Corporate</h4>
            <p className="text-sm">
              From personal packages to business shipments — we deliver on time,
              every time.
            </p>
          </div>
        </div>
      </div>
    );
};

export default HowItWorks;