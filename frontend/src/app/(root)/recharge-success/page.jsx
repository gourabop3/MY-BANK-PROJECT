'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import HeaderName from '@/components/HeaderName';
import { MdCheckCircle, MdPrint, MdShare, MdHome } from 'react-icons/md';
import { FaDownload } from 'react-icons/fa';
import Link from 'next/link';

const RechargeSuccessPage = () => {
  const searchParams = useSearchParams();
  const txnId = searchParams.get('txnId');
  const mobile = searchParams.get('mobile');
  const amount = searchParams.get('amount');
  const operator = searchParams.get('operator');
  const dateTime = new Date(Number(searchParams.get('ts') || Date.now())).toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SBI Bank - Recharge Successful',
          text: `Mobile recharge of ₹${Number(amount).toLocaleString()} completed successfully. Transaction ID: ${txnId}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container py-8 min-h-screen flex flex-col">
        <HeaderName />
        
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-2xl border border-gray-100">
            
            {/* Header Section with Bank Branding */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
              
              <div className="relative z-10">
                <div className="flex justify-center mb-4">
                  <div className="bg-white bg-opacity-20 p-4 rounded-full">
                    <MdCheckCircle className="text-white" size={48} />
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-2">Recharge Successful!</h1>
                <p className="text-blue-100 text-lg">Your mobile recharge has been processed successfully</p>
                <div className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  ✓ Transaction Completed
                </div>
              </div>
            </div>

            {/* Transaction Details Section */}
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <span className="bg-blue-100 p-2 rounded-lg mr-3">
                    📋
                  </span>
                  Transaction Details
                </h2>
                
                <div className="grid gap-4">
                  <DetailCard 
                    icon="💰" 
                    label="Recharge Amount" 
                    value={`₹${Number(amount).toLocaleString()}`} 
                    highlight 
                    bgColor="bg-green-50"
                    textColor="text-green-700"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailCard 
                      icon="📱" 
                      label="Mobile Number" 
                      value={mobile} 
                      mono 
                    />
                    <DetailCard 
                      icon="📡" 
                      label="Operator" 
                      value={operator} 
                    />
                  </div>
                  
                  <DetailCard 
                    icon="🔢" 
                    label="Transaction ID" 
                    value={txnId} 
                    mono 
                    copyable
                  />
                  
                  <DetailCard 
                    icon="🕒" 
                    label="Date & Time" 
                    value={dateTime} 
                  />
                  
                  <DetailCard 
                    icon="🏦" 
                    label="Bank" 
                    value="State Bank of India" 
                    bgColor="bg-blue-50"
                    textColor="text-blue-700"
                  />
                </div>
              </div>

              {/* Success Message */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-500 p-2 rounded-full">
                    <MdCheckCircle className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800 mb-2">Recharge Completed Successfully</h3>
                    <p className="text-green-700 text-sm">
                      Your mobile number <span className="font-semibold">{mobile}</span> has been recharged with 
                      <span className="font-semibold"> ₹{Number(amount).toLocaleString()}</span> via {operator}. 
                      You will receive SMS confirmation shortly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button 
                  onClick={handlePrint}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  <MdPrint size={20} />
                  <span>Print Receipt</span>
                </button>
                
                <button 
                  onClick={handleShare}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  <MdShare size={20} />
                  <span>Share</span>
                </button>
                
                <Link 
                  href="/recharge"
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  <span>🔄</span>
                  <span>Recharge Again</span>
                </Link>
                
                <Link 
                  href="/"
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  <MdHome size={20} />
                  <span>Home</span>
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Thank you for using <span className="font-semibold text-blue-600">SBI Digital Services</span>
                </p>
                <p className="text-xs text-gray-500">
                  For any queries, contact: <span className="font-semibold">1800-11-2211</span> | 
                  Email: <span className="font-semibold">customer.care@sbi.co.in</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ icon, label, value, highlight, mono, copyable, bgColor = "bg-gray-50", textColor = "text-gray-800" }) => {
  const handleCopy = async () => {
    if (copyable && value) {
      try {
        await navigator.clipboard.writeText(value);
        // Could add a toast notification here
      } catch (error) {
        console.log('Copy failed:', error);
      }
    }
  };

  return (
    <div className={`${bgColor} border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className={`font-semibold ${mono ? 'font-mono text-sm' : ''} ${highlight ? 'text-lg' : ''} ${textColor}`}>
              {value}
            </p>
          </div>
        </div>
        {copyable && (
          <button 
            onClick={handleCopy}
            className="text-gray-400 hover:text-blue-600 transition-colors duration-200 p-2 rounded"
            title="Copy to clipboard"
          >
            📋
          </button>
        )}
      </div>
    </div>
  );
};

export default RechargeSuccessPage;