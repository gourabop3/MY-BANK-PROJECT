"use client";
import { useMainContext } from '@/context/MainContext'
import React from 'react'
import { FaUniversity } from 'react-icons/fa'

const HeaderName = () => {
  return (
    <>
      <div className="py-4 border-b border-gray-200 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
            <FaUniversity className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">State Bank of India</h1>
            <p className="text-gray-600 text-sm">Digital Banking Dashboard</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default HeaderName