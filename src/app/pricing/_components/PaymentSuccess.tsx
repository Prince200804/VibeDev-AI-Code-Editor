"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useQuery, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const [isVerifying, setIsVerifying] = useState(false);
  
  const convexUser = useQuery(api.users.getUser, {
    userId: user?.id || "",
  });
  
  const verifyPayment = useAction(api.stripeActions.verifyPaymentAndUpgrade);

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    const sessionId = searchParams.get("session_id");

    if (success === "true" && sessionId && !isVerifying) {
      setIsVerifying(true);
      
      toast.loading("Verifying your payment...", { id: "verify-payment" });

      // Verify the payment immediately
      verifyPayment({ sessionId })
        .then((result) => {
          toast.dismiss("verify-payment");
          
          if (result.success && result.isPaid) {
            toast.success("Payment verified! You are now a Pro member! 🎉", {
              duration: 4000,
              icon: "✨",
            });
            
            // Redirect to home after a short delay
            setTimeout(() => {
              router.push("/");
            }, 2000);
          } else {
            toast.error("Payment verification failed. Please contact support.", {
              duration: 5000,
            });
          }
        })
        .catch((error) => {
          toast.dismiss("verify-payment");
          console.error("Payment verification error:", error);
          toast.error("Failed to verify payment. Please refresh the page.", {
            duration: 5000,
          });
        });
    }

    if (canceled === "true") {
      toast.error("Payment canceled. You can try again anytime.", {
        duration: 4000,
      });
      // Clear the URL parameter
      router.replace("/pricing");
    }
  }, [searchParams, router, verifyPayment, isVerifying]);

  // Also check if user became Pro (backup check)
  useEffect(() => {
    if (convexUser?.isPro && searchParams.get("success") === "true") {
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  }, [convexUser, searchParams, router]);

  return null;
}
