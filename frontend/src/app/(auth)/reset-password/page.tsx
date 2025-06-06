import ForgetPassword from "@/components/auth/ForgetPassword";
import ResetPassword from "@/components/auth/ResetPassword";
import React from "react";

const forgetPassword = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[550px] bg-white rounded-xl py-5 px-10 shadow-md">
        <h1 className="text-4xl text-center font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
          Versus
        </h1>
        <h1 className="text-3xl font-bold">Reset Password</h1>
        
        <ResetPassword />
      </div>
    </div>
  );
};

export default forgetPassword;
