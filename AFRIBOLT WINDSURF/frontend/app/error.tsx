"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">!</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Une erreur est survenue
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || "Quelque chose s'est mal passé. Veuillez réessayer."}
        </p>
        <button
          onClick={reset}
          className="btn-primary"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
