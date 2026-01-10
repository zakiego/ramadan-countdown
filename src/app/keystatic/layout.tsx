import KeystaticApp from "./keystatic";

export default function Layout() {
  // Disable Keystatic admin in production on Cloudflare Workers
  // Keystatic requires Node.js file system APIs which are not available on edge runtime
  if (process.env.NODE_ENV === "production") {
    return (
      <html lang="en">
        <body>
          <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="text-center p-8">
              <h1 className="text-2xl font-bold mb-4">Keystatic Admin</h1>
              <p className="text-gray-400">
                Keystatic admin is only available in development mode.
              </p>
              <p className="text-gray-500 mt-2 text-sm">
                To manage content, run the development server locally.
              </p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html>
      <head />
      <body>
        <KeystaticApp />
      </body>
    </html>
  );
}
