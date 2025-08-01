"use client";
import { axiosClient } from '@/utils/AxiosClient';
import React, { useState, useEffect } from 'react'
import {Formik,Form,ErrorMessage,Field} from 'formik'
import * as yup from 'yup'
import { toast } from 'react-toastify';
import CustomAuthButton from '@/components/reuseable/CustomAuthButton';
import Link from 'next/link';
import { useMainContext } from '@/context/MainContext';
import { useRouter } from 'next/navigation';
import { FaUserLock, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import Head from 'next/head';

const LoginPage = () => {
    const [loading,setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const {fetchUserProfile} = useMainContext()
    const router = useRouter()

    // Prevent Safari Reader Mode on mobile
    useEffect(() => {
      // Add meta tag to prevent Reader Mode
      const metaTag = document.createElement('meta');
      metaTag.name = 'article:author';
      metaTag.content = '';
      document.head.appendChild(metaTag);

      // Add another meta to indicate this is an app interface
      const appMetaTag = document.createElement('meta');
      appMetaTag.name = 'application-name';
              appMetaTag.content = 'SBI Banking Login';
      document.head.appendChild(appMetaTag);

      return () => {
        // Cleanup
        if (metaTag.parentNode) metaTag.parentNode.removeChild(metaTag);
        if (appMetaTag.parentNode) appMetaTag.parentNode.removeChild(appMetaTag);
      };
    }, []);

  const initialValues = {
    email:'',
    password:'' 
  }

  const validationSchema = yup.object({ 
    email:yup.string().email("Email must be a valid Email").required("Email is Required"),
    password: yup.string().required("Password is required"),
   })

  const onSubmitHandler= async(values,helpers)=>{
    try {
        setLoading(true)
      
      const response = await axiosClient.post('/auth/login',values)
      const data = await response.data 

      toast.success(data.msg)
      
      // token
      localStorage.setItem("token",data.token)
      
      await fetchUserProfile()

      router.push("/")
      helpers.resetForm()
    } catch (error) { 
      toast.error(error.response.data.msg || error.message)
      
    }finally{
        setLoading(false)
    }
  }

  return (
    <>
      <style jsx>{`
        /* Prevent Safari Reader Mode */
        body { 
          -webkit-user-select: none;
          user-select: none;
        }
        .login-container {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
        .form-input {
          -webkit-user-select: text;
          user-select: text;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 login-container" role="application" aria-label="SBI Banking Login Application">
        <div className="w-full max-w-md" role="form" aria-label="Login Form">
        {/* Header Section */}
        <div className="text-center mb-8" role="banner">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg" role="img" aria-label="SBI Banking Logo">
            <FaUserLock className="text-white text-2xl" />
          </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2" role="heading" aria-level="1">SBI Payment Gateway</div>
          <div className="text-gray-600" role="text">Professional Banking Solution</div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" role="region" aria-label="Login Interface">
          <div className="px-8 py-10">
            <div className="text-center mb-8" role="region" aria-label="Login Welcome">
              <div className="text-2xl font-bold text-gray-900 mb-2" role="heading" aria-level="2">Welcome Back</div>
              <div className="text-gray-600" role="text">Sign in to your account</div>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmitHandler}
            >
              <Form className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Field 
                    id="email"
                    type="email" 
                    name="email"  
                    className="form-input w-full py-3 px-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"  
                    placeholder="Enter your email address"
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                  <ErrorMessage name="email" className="text-red-500 text-sm mt-1" component={'p'} />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Field 
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"  
                      className="form-input w-full py-3 px-4 pr-12 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <ErrorMessage name="password" className="text-red-500 text-sm mt-1" component={'p'} />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <CustomAuthButton 
                    isLoading={loading} 
                    text={'Sign In'} 
                    type='submit' 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  />
                </div>
              </Form>
            </Formik>

            {/* Links Section */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="space-y-3 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href={'/register'} className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    Register here
                  </Link>
                </p>
                <p className="text-sm text-gray-600">
                  Admin?{' '}
                  <Link href={'/admin-login'} className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Security Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <div className="flex items-center justify-center text-gray-500">
              <FaShieldAlt className="text-sm mr-2" />
              <span className="text-xs">Secured with bank-grade encryption</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FaShieldAlt className="text-blue-600 text-sm" />
            </div>
            <p className="text-xs text-gray-600 font-medium">Secure</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 text-sm font-bold">24/7</span>
            </div>
            <p className="text-xs text-gray-600 font-medium">Support</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-600 text-sm font-bold">⚡</span>
            </div>
            <p className="text-xs text-gray-600 font-medium">Fast</p>
          </div>
        </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage