"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1e1e2e] rounded-xl p-8 border border-red-500/20">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong!</h2>
        <p className="text-gray-300 mb-4">
          {error.message || "An unexpected error occurred"}
        </p>
        {error.digest && (
          <p className="text-sm text-gray-500 mb-4">Error ID: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Try again
        </button>
        <p className="text-sm text-gray-400 mt-4">
          If this error persists, please check that all environment variables are configured correctly in Vercel.
        </p>
      </div>
    </div>
  );
}
