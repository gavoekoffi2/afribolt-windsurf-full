import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute inset-0 bg-gradient-to-br from-afribolt-50 via-white to-primary-50 opacity-50"></div>
      
      <div className="relative">
        <div className="absolute top-4 left-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-afribolt-600 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AB</span>
            </div>
            <span className="font-bold text-xl text-gray-900">AFRIBOLT</span>
          </Link>
        </div>
        
        <div className="flex items-center justify-center min-h-screen pt-16">
          {children}
        </div>
      </div>
    </div>
  );
}
