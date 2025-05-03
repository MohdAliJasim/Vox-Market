'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Package } from 'lucide-react';
import Button from '@/app/ui/Button';
import FormField from '@/app/components/forms/FormField';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { SpeechContext } from '@/context/SpeechContext';
import { useContext, useEffect } from 'react';

const SellerLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { triggerLogin, setTriggerLogin } = useContext(SpeechContext);

  // Form validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/s/authenticate`,
          values
        );
        
        localStorage.setItem('Sellertoken', response.data.token);
        localStorage.setItem('Seller', JSON.stringify(response.data.seller));
        toast.success('Login successful');
        router.push('/seller/manage-product');
      } catch (error) {
        console.error('Login error:', error);
        toast.error(error.response?.data?.message || 'Login failed');
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Handle speech recognition trigger
  useEffect(() => {
    if (triggerLogin) {
      formik.handleSubmit();
      setTriggerLogin(false);
    }
  }, [triggerLogin, formik, setTriggerLogin]);

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
              <Link href="/" className="inline-flex items-center justify-center">
                <Package size={32} className="text-primary-500 mr-2" />
                <span className="text-2xl font-bold text-neutral-900">Marketplace</span>
              </Link>
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-2">Seller Sign In</h1>
            <p className="text-center text-neutral-600 mb-6">Access your seller dashboard</p>
            
            <form onSubmit={formik.handleSubmit}>
              <FormField 
                label="Email Address" 
                htmlFor="email" 
                error={formik.touched.email && formik.errors.email}
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
                error={formik.touched.password && formik.errors.password}
                required
              >
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
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
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <Link href="/seller/forgot-password" className="font-medium text-primary-500 hover:text-primary-600">
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              <Button 
                type="submit" 
                variant="secondary" 
                fullWidth 
                loading={isLoading}
                disabled={isLoading}
              >
                Sign In as Seller
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-neutral-600">
                Don't have a seller account?{' '}
                <Link href="/seller/signup" className="font-medium text-primary-500 hover:text-primary-600">
                  Register now
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-200">
              <p className="text-center text-sm text-neutral-500 mb-4">
                Are you a customer?
              </p>
              <Button
                href="/login"
                variant="outline"
                fullWidth
              >
                Sign in as Customer
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerLoginPage;



// "use client";
// import { useFormik } from "formik";
// import { useRouter } from "next/navigation";
// import React, { useContext, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import * as Yup from "yup";
// import { SpeechContext } from "@/context/SpeechContext";

// const SellerLoginSchema = Yup.object().shape({
//   email: Yup.string().email("Invalid email").required("Required"),
//   password: Yup.string().required("Please Enter your password"),
// });

// const SellerLogin = () => {
//   const router = useRouter();
//   const loginForm = useFormik({
//     initialValues: {
//       name: "",
//       email: "",
//       password: "",
//     },
//     onSubmit: (values, { resetForm, setSubmitting }) => {
//       console.log(values);
//       axios
//         .post(`${process.env.NEXT_PUBLIC_API_URL}/s/authenticate`, values)
//         .then((result) => {
//           localStorage.setItem("Sellertoken", result.data.token);
//           localStorage.setItem("Seller", JSON.stringify(result.data.seller));
//           toast.success("Login Success");
//           router.push("./");
//         })
//         .catch((err) => {
//           console.log(err);
//           toast.error(err.response.data.message);
//         });
//     },
//     validationSchema: SellerLoginSchema,
//   });

//   const { triggerLogin, setTriggerLogin } = useContext(SpeechContext);
//   useEffect(() => {
//     if (triggerLogin) {
//       loginForm.handleSubmit(); // Programmatically submit the form
//       setTriggerLogin(false); // Reset trigger
//     }
//   }, [triggerLogin, loginForm, setTriggerLogin]);

//   return (
//     <div>
//       <div className="w-screen h-48 md:h-64 flex flex-col justify-center items-center bg-[#F2EFE5]">
//         <p className="text-black font-normal text-5xl font-poppins">
//           Seller Login
//         </p>
//         <div className="mt-4 flex flex-row gap-1 justify-center items-center">
//           <p className="text-black text-lg font-medium font-poppins">Home</p>
//           <button className="bg-[#F2EFE5] h-[18px]">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="1em"
//               height="1em"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fill="currentColor"
//                 d="m6 15l5-5l-5-5l1-2l7 7l-7 7z"
//                 className="font-medium"
//               />
//             </svg>
//           </button>
//           <p className="text-black text-lg font-extralight font-poppins">
//             Seller Login
//           </p>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg mt-6 md:mt-12 font-poppins">
//         <h1 className="md:text-4xl text-2xl font-medium text-center">
//           Login to Your Account
//         </h1>
//         <p className="text-center text-gray-400  mt-2 mb-8 md:mb-16">
//           Enter your details to access your account and explore the benefits.
//         </p>

//         <form
//           onSubmit={loginForm.handleSubmit}
//           className="flex flex-col gap-6 "
//         >
//           <div className="flex flex-col">
//             <label className="mb-2 font-medium text-md text-gray-900">
//               Email Address
//             </label>
//             <input
//               className="border border-gray-300 p-2 rounded-md"
//               type="email"
//               name="email"
//               placeholder="your.email@example.com"
//               onChange={loginForm.handleChange}
//               value={loginForm.values.email}
//             />
//             {loginForm.touched.email && (
//               <p className="text-xs text-red-600 mt-2" id="email-error">
//                 {loginForm.errors.email}
//               </p>
//             )}
//           </div>

//           <div className="flex flex-col">
//             <label className="mb-2 font-medium text-md text-gray-900">
//               Password
//             </label>
//             <input
//               className="border border-gray-300 p-2 rounded-md"
//               type="password"
//               name="password"
//               placeholder="********"
//               onChange={loginForm.handleChange}
//               value={loginForm.values.password}
//             />
//             {loginForm.touched.password && (
//               <p className="text-xs text-red-600 mt-2" id="password-error">
//                 {loginForm.errors.password}
//               </p>
//             )}
//           </div>
//           <div className="md:col-span-2">
//             <button
//               type="submit"
//               className="w-full bg-[#2F6EB8] text-white p-2 rounded-md font-bold"
//             >
//               Login
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SellerLogin;
