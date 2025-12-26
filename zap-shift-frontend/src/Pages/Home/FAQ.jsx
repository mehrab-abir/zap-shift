import React from 'react';

const FAQ = () => {
    return (
      <div className="mb-10">
        <h1 className="text-xl md:text-4xl font-bold text-accent text-center mb-5">
          Frequently Asked Questions (FAQ)
        </h1>
        <p className="text-center mx-auto w-[90%] md:w-[60%]">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>

        <div className="mt-10">
          <div className="collapse collapse-arrow bg-surface border border-base-300">
            <input type="radio" name="my-accordion-2" defaultChecked />
            <div className="collapse-title font-semibold">
              How does this posture corrector work?
            </div>
            <div className="collapse-content text-sm text-secondary">
              It uses ergonomic straps to gently pull your shoulders back and
              align your spine. By providing physical resistance when you
              slouch, it trains your muscle memory to maintain an upright
              position naturally over time.
            </div>
          </div>
          <div className="collapse collapse-arrow bg-surface border border-base-300">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title font-semibold">
              Is it suitable for all ages and body types?
            </div>
            <div className="collapse-content text-sm text-secondary">
              Yes, our posture corrector features adjustable high-elastic straps
              and Velcro fasteners, making it suitable for men, women, and
              teenagers of various body sizes and shapes.
            </div>
          </div>
          <div className="collapse collapse-arrow bg-surface border border-base-300">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title font-semibold">
              Does it really help with back pain and posture improvement?
            </div>
            <div className="collapse-content text-sm text-secondary">
              Absolutely. By reducing the strain on your neck, shoulders, and
              upper back muscles, it helps alleviate chronic pain caused by
              slouching and ensures long-term spinal health through consistent
              use.
            </div>
          </div>
          <div className="collapse collapse-arrow bg-surface border border-base-300">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title font-semibold">
              Does it have smart features like vibration alerts?
            </div>
            <div className="collapse-content text-sm text-secondary">
              This specific model is a classic ergonomic support brace focused
              on physical alignment. For our electronic version with integrated
              vibration sensors that alert you when you slouch beyond 25
              degrees, please check our "Smart Pro" series.
            </div>
          </div>
          <div className="collapse collapse-arrow bg-surface border border-base-300">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title font-semibold">
              How will I be notified when the product is back in stock?
            </div>
            <div className="collapse-content text-sm text-secondary">
              You can sign up for our "Back in Stock" alerts by entering your
              email address on the product page. We will send you an automated
              notification the moment our inventory is refreshed.
            </div>
          </div>
        </div>
      </div>
    );
};

export default FAQ;