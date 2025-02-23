import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
// import { loginApiCallSlice, loginUser } from "../AppStore/AuthSlice/LoginSlice.js";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
// import RoleSelect from "../components/RoleSelect";
import SubmitButton from "../components/SubmitButton";
import { toast } from "react-toastify";
import { loginUser1 } from "../AppStore/AuthSlice/userSlice.js";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async ({ email, password }) => {
    try {
      console.log("before Dispatching loginApiCallSlice with data:", {email, password });
      // Dispatch the login action and wait for the response
      const response = await dispatch(loginUser1({email, password }));

      console.log("Login response:", response);

      // Check if the action was fulfilled successfully
      if (response.meta.requestStatus === "fulfilled") {
        toast.success("Login successful");
        console.log("Response payload:", response.payload);
        navigate("/admin-dashboard");
      } else {
        toast.error("Login failed");
        console.error("Login failed:", response.error);
        console.error("Login failed:", response);
      }


      // Dispatch Redux action
    // dispatch(addLabUnitTest(formData))
    // .unwrap()
    // .then(() => {
    //   toast.success("Lab Test Registered!");
    //   handleReset(); // Reset form after successful submission
    //   getUnitTestListWithuotRefresh(); //calling funtion to render dtaa without refreshment
    // })
    // .catch((error) => {
    //   console.error("Error registering lab test:", error);
    //   toast.error("Failed to register lab test.");
    // })
    // .finally(() => setIsLoading(false));


      // console.log("from login line 22::response",response);
      // console.log("from login line 23::response.payload",response.payload);
      // console.log("from login line 24::response.payload.data",response.payload.data);
      


    } catch (error) {
      console.error("Login failed:", error);
      toast.error("An error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="text-3xl uppercase font-semibold text-center text-gray-700">
          Log Into Your Account
        </h3>
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Role Select Component */}
          {/* <RoleSelect register={register} errors={errors} /> */}

          {/* Username Input Component */}
          <InputField
            name="email"
            label="Email Address"
            placeholder="Enter Email"
            type="text"
            register={register}
            errors={errors}
          />

          {/* Password Input Component */}
          <InputField
            name="password"
            label="password"
            placeholder="Enter Password"
            type="password"
            register={register}
            errors={errors}
          />

          {/* Submit Button Component */}
          <SubmitButton />
        </form>

        {/* Forgot Password Link */}
        <div className="mt-6 text-sm text-center text-gray-600">
          <a href="/register" className="text-blue-500 hover:underline">
            register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
