import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h2 className="text-4xl font-bold text-red-500">404 - Page Not Found</h2>
      <p className="text-gray-600 mt-2">The page you are looking for doesn't exist.</p>
      <Link to="/dashboard" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Go to Home
      </Link>
    </div>
  );
}

export default NotFound;
