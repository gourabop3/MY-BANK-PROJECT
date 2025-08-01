"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MdCheckCircle, MdDownload, MdHome, MdReceipt, MdShare } from 'react-icons/md';
import { FaWhatsapp, FaTwitter, FaFacebook, FaCopy, FaCheck } from 'react-icons/fa';
import Card from '@/components/ui/Card';
import { useMainContext } from '@/context/MainContext';
import { axiosClient } from '@/utils/AxiosClient';
import { toast } from 'react-toastify';

const PaymentSuccessPage = () => {
  const { user } = useMainContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [copied, setCopied] = useState(false);

  // Extract payment details from URL params
  const transactionId = searchParams.get('transaction_id');
  const amount = searchParams.get('amount');
  const recipientUpi = searchParams.get('recipient_upi');
  const senderUpi = searchParams.get('sender_upi');
  const note = searchParams.get('note');
  const timestamp = searchParams.get('timestamp');

  useEffect(() => {
    if (!transactionId || !amount) {
      router.push('/upi');
      return;
    }

    setPaymentDetails({
      transactionId,
      amount: parseFloat(amount),
      recipientUpi,
      senderUpi,
      note,
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });
    setLoading(false);
  }, [transactionId, amount, recipientUpi, senderUpi, note, timestamp, router]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const copyTransactionId = () => {
    navigator.clipboard.writeText(paymentDetails.transactionId);
    setCopied(true);
    toast.success('Transaction ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReceipt = () => {
    const receiptContent = `
PAYMENT RECEIPT
================
Transaction ID: ${paymentDetails.transactionId}
Amount: ${formatCurrency(paymentDetails.amount)}
From: ${paymentDetails.senderUpi}
To: ${paymentDetails.recipientUpi}
Date: ${formatDate(paymentDetails.timestamp)}
Note: ${paymentDetails.note || 'No note provided'}
Status: SUCCESS
================
              SBI Bank UPI Payment
Thank you for using our services!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UPI_Receipt_${paymentDetails.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Receipt downloaded successfully!');
  };

  const sharePayment = (platform) => {
    const shareText = `✅ Payment Successful!\n💰 Amount: ${formatCurrency(paymentDetails.amount)}\n📱 UPI ID: ${paymentDetails.recipientUpi}\n🔢 Transaction ID: ${paymentDetails.transactionId}\n\nPowered by SBI Bank UPI`;
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <Card className="p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Details Not Found</h2>
          <p className="text-gray-600 mb-6">Unable to load payment information.</p>
          <button
            onClick={() => router.push('/upi')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back to UPI
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container py-6 px-4 max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
            <MdCheckCircle className="text-5xl text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600">Your UPI payment has been processed successfully</p>
        </div>

        {/* Payment Details Card */}
        <Card className="mb-6 p-6 bg-white shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Payment Details</h2>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              SUCCESS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-600">Amount Paid</label>
                <div className="text-3xl font-bold text-green-600 mt-1">
                  {formatCurrency(paymentDetails.amount)}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-600">Transaction ID</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-sm text-gray-800">{paymentDetails.transactionId}</span>
                  <button
                    onClick={copyTransactionId}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {copied ? <FaCheck className="text-green-600" /> : <FaCopy className="text-gray-500" />}
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-600">Date & Time</label>
                <div className="text-gray-800 mt-1">{formatDate(paymentDetails.timestamp)}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-600">From (Your UPI)</label>
                <div className="font-mono text-sm text-blue-600 mt-1">{paymentDetails.senderUpi}</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-600">To (Recipient UPI)</label>
                <div className="font-mono text-sm text-blue-600 mt-1">{paymentDetails.recipientUpi}</div>
              </div>

              {paymentDetails.note && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Note</label>
                  <div className="text-gray-800 mt-1">{paymentDetails.note}</div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 hover:shadow-md transition-shadow">
            <button
              onClick={downloadReceipt}
              className="w-full flex items-center justify-center gap-3 text-blue-600 hover:text-blue-700"
            >
              <MdDownload className="text-xl" />
              <span className="font-medium">Download Receipt</span>
            </button>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow">
            <button
              onClick={() => router.push('/upi')}
              className="w-full flex items-center justify-center gap-3 text-green-600 hover:text-green-700"
            >
              <MdHome className="text-xl" />
              <span className="font-medium">Back to UPI</span>
            </button>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow">
            <button
              onClick={() => router.push('/transactions')}
              className="w-full flex items-center justify-center gap-3 text-purple-600 hover:text-purple-700"
            >
              <MdReceipt className="text-xl" />
              <span className="font-medium">View All Transactions</span>
            </button>
          </Card>
        </div>

        {/* Share Options */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Share Payment Success</h3>
            <MdShare className="text-gray-500" />
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => sharePayment('whatsapp')}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <FaWhatsapp />
              WhatsApp
            </button>
            
            <button
              onClick={() => sharePayment('twitter')}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaTwitter />
              Twitter
            </button>
            
            <button
              onClick={() => sharePayment('facebook')}
              className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <FaFacebook />
              Facebook
            </button>
          </div>
        </Card>

        {/* Security Note */}
        <Card className="mt-6 p-4 bg-yellow-50 border border-yellow-200">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 text-xl">🔒</div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Security Note</h4>
              <p className="text-sm text-yellow-700">
                Keep this transaction ID safe for your records. Never share your UPI PIN or personal banking details with anyone.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;