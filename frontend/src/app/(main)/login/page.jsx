"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Package } from "lucide-react";
import { useFormik } from "formik";
import axios from "axios";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Button from "@/app/ui/Button";
import FormField from "@/app/components/forms/FormField";
import useAppContext from "@/context/AppContext";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const UserLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { userLogin } = useAppContext();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values, { setSubmitting }) => {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/u/authenticate`, values)
        .then((response) => {
          toast.success("Logged in successfully");
          userLogin(response.data.token, response.data.user);
          router.push("/");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Login failed. Please check your credentials.");
          setSubmitting(false);
        });
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="page-transition min-h-screen bg-neutral-50 py-20">
      <div className="container-custom max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center">
                <Package size={32} className="text-primary-500 mr-2" />
                <span className="text-2xl font-bold text-neutral-900">
                  Marketplace
                </span>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-6">
              Welcome Back
            </h1>

            <form onSubmit={formik.handleSubmit}>
              <FormField
                label="Email Address"
                htmlFor="email"
                error={formik.touched.email ? formik.errors.email : ""}
                required
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="your.email@example.com"
                />
              </FormField>

              <FormField
                label="Password"
                htmlFor="password"
                error={formik.touched.password ? formik.errors.password : ""}
                required
              >
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="form-input pr-10"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormField>

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-neutral-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    className="font-medium text-primary-500 hover:text-primary-600"
                    onClick={() => router.push("/forgot-password")}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={formik.isSubmitting}
                disabled={formik.isSubmitting}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-neutral-600">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-primary-500 hover:text-primary-600"
                  onClick={() => router.push("/signup")}
                >
                  Sign up
                </button>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-200">
              <p className="text-center text-sm text-neutral-500 mb-4">
                Are you a seller?
              </p>
              <Button
                onClick={() => router.push("/seller/login")}
                variant="outline"
                fullWidth
              >
                Sign in as Seller
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserLoginPage;
