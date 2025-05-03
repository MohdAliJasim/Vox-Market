'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Package } from 'lucide-react';
import Button from '@/app/ui/Button';
import FormField from '@/app/components/forms/FormField';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const SellerSignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Form validation schema
  const validationSchema = Yup.object().shape({
    businessName: Yup.string()
      .required('Business name is required')
      .min(2, 'Business name must be at least 2 characters'),
    contactName: Yup.string()
      .required('Contact name is required')
      .min(2, 'Contact name must be at least 2 characters'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
    businessType: Yup.string()
      .required('Business type is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    acceptTerms: Yup.boolean()
      .oneOf([true], 'You must accept the terms and conditions')
  });

  const formik = useFormik({
    initialValues: {
      businessName: '',
      contactName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      businessType: '',
      acceptTerms: false
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Prepare data for API
        const sellerData = {
          name: values.contactName,
          businessName: values.businessName,
          email: values.email,
          phoneNumber: values.phone,
          password: values.password,
          businessType: values.businessType
        };

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/s/addSeller`,
          sellerData
        );

        // Store token and seller data
        localStorage.setItem('Sellertoken', response.data.token);
        localStorage.setItem('Seller', JSON.stringify(response.data.seller));
        
        toast.success('Seller account created successfully!');
        router.push('/seller/profile');
      } catch (error) {
        console.error('Signup error:', error);
        if (error.response?.data?.code === 11000) {
          toast.error('Email already exists');
        } else {
          toast.error(error.response?.data?.message || 'Failed to create account');
        }
      }
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="page-transition min-h-screen bg-neutral-50 py-20">
      <div className="container-custom max-w-xl">
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
            
            <h1 className="text-2xl font-bold text-center mb-2">Become a Seller</h1>
            <p className="text-center text-neutral-600 mb-6">Create your seller account and start selling your products</p>
            
            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField 
                  label="Business Name" 
                  htmlFor="businessName" 
                  error={formik.touched.businessName && formik.errors.businessName}
                  required
                  className="md:col-span-2"
                >
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    className="form-input"
                    value={formik.values.businessName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Your Business Name"
                  />
                </FormField>
                
                <FormField 
                  label="Contact Person" 
                  htmlFor="contactName" 
                  error={formik.touched.contactName && formik.errors.contactName}
                  required
                >
                  <input
                    id="contactName"
                    name="contactName"
                    type="text"
                    className="form-input"
                    value={formik.values.contactName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="John Doe"
                  />
                </FormField>
                
                <FormField 
                  label="Phone Number" 
                  htmlFor="phone" 
                  error={formik.touched.phone && formik.errors.phone}
                  required
                >
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-input"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="1234567890"
                  />
                </FormField>
                
                <FormField 
                  label="Email Address" 
                  htmlFor="email" 
                  error={formik.touched.email && formik.errors.email}
                  required
                  className="md:col-span-2"
                >
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="business@example.com"
                  />
                </FormField>
                
                <FormField 
                  label="Business Type" 
                  htmlFor="businessType" 
                  error={formik.touched.businessType && formik.errors.businessType}
                  required
                  className="md:col-span-2"
                >
                  <select
                    id="businessType"
                    name="businessType"
                    className="form-input"
                    value={formik.values.businessType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select business type</option>
                    <option value="individual">Individual / Sole Proprietor</option>
                    <option value="llc">Limited Liability Company (LLC)</option>
                    <option value="corporation">Corporation</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
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
                
                <FormField 
                  label="Confirm Password" 
                  htmlFor="confirmPassword" 
                  error={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  required
                >
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="••••••••"
                  />
                </FormField>
              </div>
              
              <div className="mt-4 mb-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      className="h-4 w-4 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                      checked={formik.values.acceptTerms}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="acceptTerms" className="text-neutral-700">
                      I agree to the {' '}
                      <Link href="/terms-of-service" className="text-primary-500 hover:text-primary-600">
                        Terms of Service
                      </Link> {' '}
                      and {' '}
                      <Link href="/privacy-policy" className="text-primary-500 hover:text-primary-600">
                        Privacy Policy
                      </Link> {' '}
                      and {' '}
                      <Link href="/seller-agreement" className="text-primary-500 hover:text-primary-600">
                        Seller Agreement
                      </Link>
                    </label>
                    {formik.touched.acceptTerms && formik.errors.acceptTerms && (
                      <p className="mt-1 text-sm text-error-500">{formik.errors.acceptTerms}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                variant="secondary" 
                fullWidth 
                loading={formik.isSubmitting}
                disabled={formik.isSubmitting}
              >
                Create Seller Account
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-neutral-600">
                Already have a seller account?{' '}
                <Link href="/seller/login" className="font-medium text-primary-500 hover:text-primary-600">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-200">
              <p className="text-center text-sm text-neutral-500 mb-4">
                Want to shop instead?
              </p>
              <Button
                href="/signup"
                variant="outline"
                fullWidth
              >
                Create Customer Account
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerSignupPage;

// "use client";
// import { useFormik } from "formik";
// import { useRouter } from "next/navigation";
// import React from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import * as Yup from "yup";

// const signUpSchema = Yup.object().shape({
//   name: Yup.string()
//     .min(2, "make it longer")
//     .max(50, "too long")
//     .required("Name is required"),
//   email: Yup.string().email("Invalid email").required("email is required"),
//   password: Yup.string()
//     .required("password is required"),
//     // .matches(/[a-z]/, "must include a lower case")
//     // .matches(/[A-Z]/, "must include an upper case")
//     // .matches(/[0-9]/, "must include a number")
//     // .matches(/\w/, "must include a special character"),
//   confirmPassword: Yup.string()
//     .label("confirm password")
//     .required("confirm password is required")
//     .oneOf([Yup.ref("password"), null], "Passwords must match"),

// phoneNumber: Yup.string()
// .required("Phone number is required")
// .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"), 
// });

// const SignUp = () => {
//   const router = useRouter();
//   const signUp = useFormik({
//     initialValues: {
//       name: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       phoneNumber:"",
//     },
//     onSubmit(values, { resetForm, setSubmitting }) {
//       console.log(values);
//       axios
//         .post(`${process.env.NEXT_PUBLIC_API_URL}/s/addSeller`, values)
//         .then((response) => {
//           console.log(response);
//           localStorage.setItem("Sellertoken",response.data.token);
//           localStorage.setItem("Seller", JSON.stringify(response.data.seller));
//           resetForm();
//           toast.success("Seller added successfully");
//           router.push("./seller/profile");
//         })
//         .catch((err) => {
//           console.log(err);
//           if (err.response.data.code === 11000) {
//             toast.error("Email already exists");
//           }
//           setSubmitting(false);
//         });
//     },
//     validationSchema: signUpSchema,
//   });

//   return (
//     <div>
//       <div className="w-screen h-48 md:h-64 flex flex-col justify-center items-center bg-[#F2EFE5]">
//         <p className="text-black font-normal text-5xl font-poppins">Seller Register</p>
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
//             Seller Register
//           </p>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg mt-6 md:mt-12 font-poppins">
//         <h1 className="md:text-4xl text-2xl font-medium text-center">
//           Register Your Account
//         </h1>
//         <p className="text-center text-gray-400  mt-2 mb-8 md:mb-16">
//           Create an account to enjoy all the benefits and stay connected.
//         </p>

//         <form
//           onSubmit={signUp.handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-2 gap-6 "
//         >
//           <div className="flex flex-col">
//             <label className="mb-2 font-medium text-md text-gray-900">
//               Full Name
//             </label>
//             <input
//               className="border border-gray-300 p-2 rounded-md"
//               type="text"
//               name="name"
//               placeholder="Your Name"
//               onChange={signUp.handleChange}
//               value={signUp.values.name}
//             />
//             {signUp.touched.name && (
//               <p className="text-xs text-red-600 mt-2" id="name-error">
//                 {signUp.errors.name}
//               </p>
//             )}
//           </div>

//           <div className="flex flex-col">
//             <label className="mb-2 font-medium text-md text-gray-900">
//               Email Address
//             </label>
//             <input
//               className="border border-gray-300 p-2 rounded-md"
//               type="email"
//               name="email"
//               placeholder="your.email@example.com"
//               onChange={signUp.handleChange}
//               value={signUp.values.email}
//             />
//             {signUp.touched.email && (
//               <p className="text-xs text-red-600 mt-2" id="email-error">
//                 {signUp.errors.email}
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
//               onChange={signUp.handleChange}
//               value={signUp.values.password}
//             />
//             { signUp.touched.password && 

// <p className="text-xs text-red-600 mt-2" id="password-error">
 
//  {signUp.errors.password}

// </p>
// }
//           </div>

//           <div className="flex flex-col">
//             <label className="mb-2 font-medium text-md text-gray-900">
//               Confirm Password
//             </label>
//             <input
//               className="border border-gray-300 p-2 rounded-md"
//               type="password"
//               name="confirmPassword"
//               placeholder="********"
//               onChange={signUp.handleChange}
//               value={signUp.values.confirmPassword}
//             />
//             { signUp.touched. confirmPassword &&

// <p className="text-xs text-red-600 mt-2" id="confirmPassword-error">
 
//  {signUp.errors.confirmPassword}

// </p>
// }
//           </div>

//           <div className="flex flex-col md:col-span-2">
//             <label className="mb-2 font-medium text-md text-gray-900">
//               Phone Number
//             </label>
//             <input
//               className="border border-gray-300 p-2 rounded-md"
//               type="tel"
//               name="phoneNumber"
//               placeholder="+91 9999999999"
//               onChange={signUp.handleChange}
//               value={signUp.values.phoneNumber}
//             />
//             {
//                signUp.touched.phoneNumber && 

//                <p className="text-xs text-red-600 mt-2" id="number-error">
                
//                 {signUp.errors.phoneNumber}
 
//                </p>
 
//             }
//           </div>

//           <div className="flex items-center md:col-span-2">
//             <input type="checkbox" className="mr-2" />
//             <span>
//               I agree to the{" "}
//               <a href="#" className="text-[#2F6EB8]">
//                 terms and conditions
//               </a>
//             </span>
//           </div>

//           <div className="md:col-span-2">
//             <button className="w-full bg-[#2F6EB8] text-white p-2 rounded-md font-bold">
            
//               Register
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignUp;
