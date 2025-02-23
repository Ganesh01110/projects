import React from "react";

const SubmitButton = () => {
  return (
    <div className="flex items-center justify-between">
      <button
        type="submit"
        className="w-full px-4 py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        submit
      </button>
    </div>
  );
};

export default SubmitButton;
