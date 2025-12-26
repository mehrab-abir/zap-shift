import React from 'react';
import liveTracking from '../../assets/live-tracking.png'
import safeDelivery from '../../assets/safe-delivery.png'

const TopFeature = () => {
    return (
      <div className="space-y-3 w-11/12 mx-auto md:w-full">
        <div className="flex flex-col md:flex-row items-center gap-7 bg-surface shadow px-3 py-6 rounded-3xl">
          <div className="">
            <img src={liveTracking} alt="" className="object-cover" />
          </div>

          <div className="md:border-l border-dashed pl-7">
            <h2 className="text-lg md:text-xl font-bold my-4">
              Live Percel Tracking
            </h2>
            <p className="text-sm md:text-base">
              Stay updated in real-time with our live parcel tracking feature.
              From pick-up to delivery, monitor your shipment's journey and get
              instant status updates for complete peace of mind.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-7 bg-surface shadow px-3 py-6 rounded-3xl">
          <div className="">
            <img src={safeDelivery} alt="" className="object-cover" />
          </div>

          <div className="md:border-l border-dashed pl-7">
            <h2 className="text-lg md:text-xl font-bold my-4">
              100% Safe Delivery
            </h2>
            <p className="text-sm md:text-base">
              We ensure your parcels are handled with the utmost care and
              delivered securely to their destination. Our reliable process
              guarantees safe and damage-free delivery every time.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-7 bg-surface shadow px-3 py-6 rounded-3xl">
          <div className="">
            <img src={liveTracking} alt="" className="object-cover w-42" />
          </div>

          <div className="md:border-l border-dashed pl-7">
            <h2 className="text-lg md:text-xl font-bold my-4">
              24/7 Call Center Support
            </h2>
            <p className="text-sm md:text-base">
              Our dedicated support team is available around the clock to assist
              you with any questions, updates, or delivery concerns—anytime you
              need us.
            </p>
          </div>
        </div>
      </div>
    );
};

export default TopFeature;