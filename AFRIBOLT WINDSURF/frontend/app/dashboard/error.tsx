"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl text-red-600">!</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Erreur du Dashboard
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {error.message || "Impossible de charger le dashboard. Veuillez réessayer."}
        </p>
        <button onClick={reset} className="btn-primary">
          Réessayer
        </button>
      </div>
    </div>
  );
}
