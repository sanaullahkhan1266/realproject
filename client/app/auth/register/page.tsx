"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import banner from "../../../public/banner.png";
import Image from "next/image";
import Link from "next/link";
import { protectSignUpActions } from "@/app/api/actions/auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuthStore } from "@/app/api/store/useAuthStore";
import { useRouter } from "next/navigation";
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { toast } = useToast();
  const { register } = useAuthStore();
  const router = useRouter();
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
    const userId = await register(
      formData.name,
      formData.email,
      formData.password
    );
    if (!userId) router.push("/auth/login");
  };

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

            {/* Name Input */}
            <div className="mb-10 ">
              <Input
                id="name"
                type="text"
                name="name"
                required
                placeholder="Enter your name"
                className="w-full p-4 py-5 text-sm text-gray-700 bg-gray-100 rounded-lg"
                value={formData.name}
                onChange={handleonChange}
              />
            </div>

            {/* Email Input */}
            <div className="mb-10 ">
              <Input
                id="email"
                type="email"
                name="email"
                // pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                title="Please enter a valid email address"
                required
                placeholder="Enter your email"
                className="w-full p-4 py-5 text-sm text-gray-700 bg-gray-100 rounded-lg"
                value={formData.email}
                onChange={handleonChange}
              />
            </div>

            {/* Password Input */}
            <div className="mb-10">
              <Input
                id="password"
                type="password"
                name="password"
                required
                // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                placeholder="Enter your password"
                className="w-full p-4 py-5 text-sm text-gray-700 bg-gray-100 rounded-lg"
                value={formData.password}
                onChange={handleonChange}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-700 transition duration-200 ease-in-out"
            >
              Sign Up
            </Button>
            <p className="text-center text-black mt-4">
              Already have an account{" "}
              <Link
                href={"/auth/login"}
                className="text-blue-600 hover:underline"
              >
                {" "}
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
