import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
// import { loginApiCallSlice } from "../AppStore/AuthSlice/LoginSlice.js";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
// import RoleSelect from "../components/RoleSelect";
import SubmitButton from "../components/SubmitButton";
import { toast } from "react-toastify";
import { registerUser } from "../AppStore/AuthSlice/userSlice.js";

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async ({name, email, password }) => {
    try {
      console.log("before Dispatching RegisterApiCallSlice with data:", {name, email, password});
      // Dispatch the login action and wait for the response
      // const response = await dispatch(RegisterApiCallSlice({name, email, password}));
      const response = await dispatch(registerUser({name, email, password}));


      if (response) {
        toast.success("register successful");
      }

    //   console.log("from login line 22::response",response);
    //   console.log("from login line 23::response.payload",response.payload);
    //   console.log("from login line 24::response.payload.data",response.payload.data);
      

      // Check if the login was successful
      // if (response.meta.requestStatus === "fulfilled") {
      //   // Retrieve role from localStorage
      //   // const role = response.payload;
      //   const { role } = response.payload || {}; // Safely destructure role
      //   if (!role || typeof role !== "string") {
      //     throw new Error("Invalid role received from server");
      // }

      //   console.log("Retrieved role from payload:", role);

      //   const normalizedRole = role?.toLowerCase();

      //   // Redirect based on role
      //   // if (normalizedRole === "admin" ) {
      //   //     // navigate("/");
      //   //   navigate("/admin-dashboard");
      //   //   toast.success("Login successful");
      //   // } else if (normalizedRole === "receptionist") {
      //   //   navigate("/receptionist-dashboard");
      //   // } else {
      //   //   toast.error("Unrecognized role or its format.");
      //   // }
      // } else {
      //   toast.error("register failed! Please check your credentials.");
      // }
    } catch (error) {
      console.error("register failed:", error);
      toast.error("An error occurred during register.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="text-3xl uppercase font-semibold text-center text-gray-700">
          register Your Account
        </h3>
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Role Select Component */}
          {/* <RoleSelect register={register} errors={errors} /> */}

          <InputField
            name="name"
            label="name"
            placeholder="Enter name"
            type="text"
            register={register}
            errors={errors}
          />

          {/* Username Input Component */}
          <InputField
            name="email"
            label=" Email Address"
            placeholder="Enter email"
            type="text"
            register={register}
            errors={errors}
          />

          {/* Password Input Component */}
          <InputField
            name="password"
            label="password"
            placeholder="Enter password"
            type="password"
            register={register}
            errors={errors}
          />

          {/* Submit Button Component */}
          <SubmitButton />
        </form>

        {/* Forgot Password Link */}
        <div className="mt-6 text-sm text-center text-gray-600">
          <a href="/" className="text-blue-500 hover:underline">
            login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
