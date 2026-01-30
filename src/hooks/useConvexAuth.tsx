"use client";

import { useAuth as useClerkAuth } from "@clerk/nextjs";
import { useMemo } from "react";

export function useConvexAuth() {
  const { getToken, ...auth } = useClerkAuth();

  const fetchAccessToken = useMemo(
    () => async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      try {
        const token = await getToken({
          template: "convex",
          skipCache: forceRefreshToken,
        });
        return token;
      } catch (error) {
        console.error("Error fetching Convex token:", error);
        return null;
      }
    },
    [getToken]
  );

  return useMemo(
    () => ({
      ...auth,
      fetchAccessToken,
      isLoading: auth.isLoaded === false,
      isAuthenticated: auth.isSignedIn ?? false,
    }),
    [auth, fetchAccessToken]
  );
}
