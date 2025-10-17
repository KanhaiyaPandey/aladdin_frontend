import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Oops! The page you're looking for doesn’t exist.</p>
      <button
        onClick={() => navigate("/")}
        className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
      >
        Go Home
      </button>
    </div>
  );
};

export default ErrorPage;
