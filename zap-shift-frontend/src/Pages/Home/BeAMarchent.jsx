import React from 'react';
import locationMarchent from "../../assets/location-merchant.png";
import { Link } from 'react-router';

const BeAMarchent = () => {
    return (
      <div className="my-15 p-10 bg-accent rounded-3xl flex flex-col-reverse md:flex-row justify-between items-center">
        <div className="mt-10 md:mt-0">
          <h1 className="text-xl md:text-3xl font-bold text-white text-center md:text-left">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="text-sm text-muted my-4 md:w-[70%] text-center md:text-left">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <button className="btn bg-primary text-black rounded-full hover:bg-lime-400!">
              Become a Merchant
            </button>
            <Link to='/rider-registration' className="btn bg-accent text-lime-400 border border-lime-400 rounded-full hover:bg-lime-400! hover:text-black">
              Earn With ZapShift Courier
            </Link>
          </div>
        </div>

        <div>
          <img src={locationMarchent} alt="" />
        </div>
      </div>
    );
};

export default BeAMarchent;