import React from "react";

const InputField = ({ name, label, placeholder, type, register, errors }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-600 text-sm font-semibold">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, {
          required: `${label} is required`,
        })}
        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors[name] && <p className="text-red-500">{errors[name]?.message}</p>}
    </div>
  );
};

export default InputField;
