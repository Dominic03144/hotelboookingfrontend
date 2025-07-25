// ✅ src/StripeProvider.tsx
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// ✅ Add debug log to verify what Vite actually sees
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
console.log("[DEBUG] VITE_STRIPE_PUBLISHABLE_KEY =", publishableKey);

if (!publishableKey) {
  console.error(
    "[Stripe] Missing VITE_STRIPE_PUBLISHABLE_KEY — check your .env!"
  );
}

const stripePromise = loadStripe(publishableKey || "");

export default function StripeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
