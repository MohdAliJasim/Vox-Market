'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Package } from 'lucide-react';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import Button from '@/app/ui/Button';
import FormField from '@/app/components/forms/FormField';
import useAppContext from '@/context/AppContext';

const signUpSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too short")
    .max(50, "Too long")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Too short")
    .max(50, "Too long")
    .required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Must include a lowercase letter")
    .matches(/[A-Z]/, "Must include an uppercase letter")
    .matches(/[0-9]/, "Must include a number")
    .matches(/[^a-zA-Z0-9]/, "Must include a special character"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  acceptTerms: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
});

const UserSignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      acceptTerms: false
    },
    validationSchema: signUpSchema,
    onSubmit: (values, { setSubmitting }) => {
      const userData = {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber
      };

      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/u/addUser`, userData)
        .then((response) => {
          toast.success("Account created successfully!");
          router.push("/login");
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.data?.code === 11000) {
            toast.error("Email already exists");
          } else {
            toast.error("Registration failed. Please try again.");
          }
          setSubmitting(false);
        });
    }
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
                <span className="text-2xl font-bold text-neutral-900">EchoBazaar</span>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
            
            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField 
                  label="First Name" 
                  htmlFor="firstName" 
                  error={formik.touched.firstName ? formik.errors.firstName : ''}
                  required
                >
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="form-input"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="John"
                  />
                </FormField>
                
                <FormField 
                  label="Last Name" 
                  htmlFor="lastName" 
                  error={formik.touched.lastName ? formik.errors.lastName : ''}
                  required
                >
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="form-input"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Doe"
                  />
                </FormField>
              </div>
              
              <FormField 
                label="Email Address" 
                htmlFor="email" 
                error={formik.touched.email ? formik.errors.email : ''}
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
                label="Phone Number" 
                htmlFor="phoneNumber" 
                error={formik.touched.phoneNumber ? formik.errors.phoneNumber : ''}
                required
              >
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  className="form-input"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="1234567890"
                />
              </FormField>
              
              <FormField 
                label="Password" 
                htmlFor="password" 
                error={formik.touched.password ? formik.errors.password : ''}
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
                <p className="mt-1 text-xs text-neutral-500">
                  Password must be at least 8 characters with uppercase, lowercase, number, and special character
                </p>
              </FormField>
              
              <FormField 
                label="Confirm Password" 
                htmlFor="confirmPassword" 
                error={formik.touched.confirmPassword ? formik.errors.confirmPassword : ''}
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
              
              <div className="mb-6">
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
                      <button 
                        type="button"
                        className="text-primary-500 hover:text-primary-600"
                        onClick={() => router.push("/terms-of-service")}
                      >
                        Terms of Service
                      </button> {' '}
                      and {' '}
                      <button 
                        type="button"
                        className="text-primary-500 hover:text-primary-600"
                        onClick={() => router.push("/privacy-policy")}
                      >
                        Privacy Policy
                      </button>
                    </label>
                    {formik.touched.acceptTerms && formik.errors.acceptTerms && (
                      <p className="mt-1 text-sm text-error-500">{formik.errors.acceptTerms}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                loading={formik.isSubmitting}
                disabled={formik.isSubmitting}
              >
                Create Account
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-neutral-600">
                Already have an account?{' '}
                <button 
                  type="button"
                  className="font-medium text-primary-500 hover:text-primary-600"
                  onClick={() => router.push("/login")}
                >
                  Sign in
                </button>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-200">
              <p className="text-center text-sm text-neutral-500 mb-4">
                Want to sell on our marketplace?
              </p>
              <Button
                onClick={() => router.push("/seller/signup")}
                variant="outline"
                fullWidth
              >
                Register as Seller
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserSignupPage;