"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import banner from "../../../public/banner.png";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { protectSignUpActions } from "@/app/api/actions/auth";
import { useToast } from "@/hooks/use-toast";
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { toast } = useToast();
  const handleonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const checkFirstLevelofValidation = await protectSignUpActions(
      formData.email
    );
    if (!checkFirstLevelofValidation.success) {
      toast({
        title: checkFirstLevelofValidation.error,
        variant: "destructive",
        description: "Please enter a valid email",
      });
      return;
    }
  };
  console.log(formData);

  return (
    <>
      <div className="flex h-screen">
        {/* Image Section */}
        <div className="w-1/2 bg-cover bg-center">
          <Image
            src={banner}
            alt="banner"
            className="w-full h-full object-cover"
          />
          {/* You can add any content or overlay here */}
        </div>

        {/* Form Section */}
        <div className="w-1/2 flex items-center justify-center bg-gray-50">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg p-8   rounded-lg "
          >
            {/* <Image src={} alt="logo" className="w-32 h-32 mb-10 object-cover" /> */}

            {/* Email Input */}
            <div className="mb-10 ">
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleonChange}
                className="w-full p-4 py-5 text-sm text-gray-700 bg-gray-100 rounded-lg"
              />
            </div>

            {/* Password Input */}
            <div className="mb-10">
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleonChange}
                className="w-full p-4 py-5 text-sm text-gray-700 bg-gray-100 rounded-lg"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-700 transition duration-200 ease-in-out"
            >
              Sign In
            </Button>
            <p className="text-center text-black mt-4">
              Already have an account{" "}
              <Link
                href={"/auth/register"}
                className="text-blue-600 hover:underline"
              >
                {" "}
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
