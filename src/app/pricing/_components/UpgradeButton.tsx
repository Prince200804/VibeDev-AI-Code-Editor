"use client";
import { Zap } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import toast from "react-hot-toast";

export default function UpgradeButton() {
  const { user } = useUser();
  const createCheckout = useAction(api.stripeActions.createCheckoutSession);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Please sign in to upgrade");
      return;
    }

    try {
      setIsLoading(true);
      const { url } = await createCheckout({
        email: user.emailAddresses[0].emailAddress,
        userId: user.id,
      });

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast.error("Failed to start checkout process");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={isLoading}
      className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white 
        bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg 
        hover:from-blue-600 hover:to-blue-700 transition-all
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Zap className="w-5 h-5" />
      {isLoading ? "Loading..." : "Upgrade to Pro"}
    </button>
  );
}
