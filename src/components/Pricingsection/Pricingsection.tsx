import React from "react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: [
      "Access to 10 free courses",
      "Basic analytics",
      "Community support",
    ],
    buttonText: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    features: [
      "Unlimited course access",
      "AI-powered recommendations",
      "Advanced analytics",
      "Priority support",
    ],
    buttonText: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    features: [
      "Everything in Pro",
      "Custom branding",
      "Dedicated support",
      "API access",
    ],
    buttonText: "Contact Sales",
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Simple, Transparent Pricing
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border border-gray-400 p-8 flex flex-col justify-between shadow-md transition hover:shadow-lg ${
                plan.highlighted
                  ? "bg-gradient-to-b from-pink-500 to-orange-400 text-white scale-105"
                  : "bg-white"
              }`}
            >
              {plan.highlighted && (
                <span className="mx-auto mb-4 inline-block bg-white text-pink-600 text-sm font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-2xl font-semibold mb-4">{plan.name}</h3>

                <p className="text-4xl font-bold mb-6">
                  {plan.price}
                  <span className="text-base font-medium">{plan.period}</span>
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span
                        className={` ${
                          plan.highlighted ? "text-white" : "text-green-600"
                        }`}
                      >
                        ✔
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`w-full btn btn-outline text-xl border-gray-300 py-8 rounded-xl font-semibold transition ${
                  plan.highlighted
                    ? "bg-white text-black hover:bg-gray-100  "
                    : " hover:bg-gray-200"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
