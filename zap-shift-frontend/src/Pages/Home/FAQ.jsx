import React from 'react';

const FAQ = () => {
    return (
      <div className="mb-10">
        <h1 className="text-xl md:text-4xl font-bold text-accent text-center mb-5">
          Frequently Asked Questions (FAQ)
        </h1>

        <div className="mt-10">
          <div className="collapse collapse-arrow bg-surface border border-base-300">
            <input type="radio" name="my-accordion-2" defaultChecked />
            <div className="collapse-title font-semibold">
              How do I place a parcel delivery request?
            </div>
            <div className="collapse-content text-sm text-secondary">
              You can place a delivery request by logging into your account,
              filling out the parcel details (pickup location, delivery
              location, parcel type, and weight), and confirming the request.
              Once submitted, a rider will be assigned to your parcel.
            </div>
          </div>
          <div className="collapse collapse-arrow bg-surface border border-base-300">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title font-semibold">
              How can I track my parcel?
            </div>
            <div className="collapse-content text-sm text-secondary">
              After placing a parcel request, go to My Parcels page from the
              Dashboard, click on the Tracking Id which takes you to the parcel
              tracking page.
            </div>
          </div>
          <div className="collapse collapse-arrow bg-surface border border-base-300">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title font-semibold">
              What types of parcels can I send?
            </div>
            <div className="collapse-content text-sm text-secondary">
              We support documents, small packages, and medium-sized parcels.
              Restricted or hazardous items (such as explosives, illegal goods,
              or perishable food) are not allowed. use.
            </div>
          </div>
          <div className="collapse collapse-arrow bg-surface border border-base-300">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title font-semibold">
              How is the delivery fee calculated?
            </div>
            <div className="collapse-content text-sm text-secondary">
              The delivery fee is calculated based on distance, parcel weight,
              and delivery urgency. The total cost is shown before you proceed
              to payment, so there are no hidden charges.
            </div>
          </div>
          <div className="collapse collapse-arrow bg-surface border border-base-300">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title font-semibold">
              What happens if no rider accepts my delivery request?
            </div>
            <div className="collapse-content text-sm text-secondary">
              If no rider accepts your request immediately, your parcel status
              will remain as “Looking for a rider.” The system continues
              notifying available riders until one accepts, or you may cancel
              the request at any time.
            </div>
          </div>
        </div>
      </div>
    );
};

export default FAQ;