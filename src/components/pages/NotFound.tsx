import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/404.svg";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <h1 className="text-6xl md:text-8xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        404
      </h1>
      <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-400 mb-8 text-center">
        Oops! The page you're looking for doesn't exist.
      </p>
      <img src={Logo} alt="404 Illustration" className="w-64 md:w-96 mb-8" />
      <Link
        to="/"
        className="px-6 py-3 bg-blue-500 text-white hover:text-white rounded-md hover:bg-blue-600 transition duration-300 text-lg font-semibold"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
