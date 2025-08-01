"use client";
import React, { useState, useEffect } from 'react';
import HeaderName from '@/components/HeaderName';
import { MdQrCode, MdSend, MdHistory, MdAccountBalance, MdPayment } from 'react-icons/md';
import { FaDownload, FaShare, FaCopy, FaCheck } from 'react-icons/fa';
import Card from '@/components/ui/Card';
import { useMainContext } from '@/context/MainContext';
import { axiosClient } from '@/utils/AxiosClient';
import { useRouter } from 'next/navigation';

const UPIPage = () => {
  const { user } = useMainContext();
  const router = useRouter();
  // Remove all KYC-related redirect or blocking logic. No early return or router.replace for non-KYC users.

  const [activeTab, setActiveTab] = useState('pay');
  const [upiInfo, setUpiInfo] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Payment form states
  const [paymentForm, setPaymentForm] = useState({
    recipient_upi: '',
    amount: '',
    note: '',
    pin: ''
  });

  // QR generation form states
  const [qrForm, setQrForm] = useState({
    amount: '',
    note: ''
  });

  const [validationResult, setValidationResult] = useState(null);

  const [registrationForm, setRegistrationForm] = useState({
    upi_id: '',
    pin: '',
    confirm_pin: ''
  });

  // Local form validation state
  const [formValidation, setFormValidation] = useState({ upi_id: null, pin: null, confirm_pin: null });

  // Payment confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState({ success: null, error: null });

  // Add state for two-step UPI pay flow
  const [showPinStep, setShowPinStep] = useState(false);

  // Add state for reset PIN flow
  const [showResetPin, setShowResetPin] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: send OTP, 2: verify OTP & set new PIN
  const [resetEmailOtp, setResetEmailOtp] = useState('');
  const [resetNewPin, setResetNewPin] = useState('');
  const [resetConfirmPin, setResetConfirmPin] = useState('');
  const [resetStatus, setResetStatus] = useState({ success: null, error: null });
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    fetchUPIInfo();
    fetchTransactions();
  }, []);

  const fetchUPIInfo = async () => {
    try {
      const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      if (!currentToken) return;
      
      const response = await axiosClient.get('/upi/info', {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });
      const data = response.data;
      if (response.status === 200) {
        setUpiInfo(data.upi_info);
      }
    } catch (error) {
      console.error('Error fetching UPI info:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      if (!currentToken) return;
      
      const response = await axiosClient.get('/upi/transactions?page=1&limit=10', {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });
      const data = response.data;
      if (response.status === 200) {
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const generateQR = async () => {
    setLoading(true);
    try {
      const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      if (!currentToken) return;
      
      const response = await axiosClient.get(`/upi/qr?amount=${qrForm.amount}&note=${qrForm.note}`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });
      const data = response.data;
      if (response.status === 200) {
        setQrCode(data);
      }
    } catch (error) {
      console.error('Error generating QR:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateUPI = async (upi_id) => {
    if (!upi_id) return;
    try {
      const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      if (!currentToken) return;
      
      const response = await axiosClient.get(`/upi/validate/${upi_id}`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });
      const data = response.data;
      setValidationResult(data);
    } catch (error) {
      console.error('Error validating UPI:', error);
    }
  };

  const validateRegistrationInputs = () => {
    // Reset validation
    setFormValidation({ upi_id: null, pin: null, confirm_pin: null });

    const errors = { upi_id: null, pin: null, confirm_pin: null };

    // Check if UPI ID is provided
    if (!registrationForm.upi_id.trim()) {
      errors.upi_id = 'UPI ID is required';
    } else {
      // UPI ID must end with @cbibank and have at least 2 chars before @
              const upiRegex = /^[a-zA-Z0-9._-]{2,}@sbibank$/;
      if (!upiRegex.test(registrationForm.upi_id)) {
        errors.upi_id = 'UPI ID must end with @sbibank (e.g., yourname@sbibank)';
      }
    }

    // Check if PIN is provided
    if (!registrationForm.pin.trim()) {
      errors.pin = 'PIN is required';
    } else {
      // PIN must be 4 or 6 digits
      const pinRegex = /^\d{4}$|^\d{6}$/;
      if (!pinRegex.test(registrationForm.pin)) {
        errors.pin = 'PIN must be exactly 4 or 6 digits';
      }
    }

    // Check if confirm PIN is provided
    if (!registrationForm.confirm_pin.trim()) {
      errors.confirm_pin = 'Please confirm your PIN';
    } else if (registrationForm.pin !== registrationForm.confirm_pin) {
      errors.confirm_pin = 'PINs do not match';
    }

    setFormValidation(errors);
    return !errors.upi_id && !errors.pin && !errors.confirm_pin;
  };

  const registerUPI = async () => {
    setRegistrationSuccess(null);
    setRegistrationError(null);

    if (!validateRegistrationInputs()) {
      return;
    }
    
    const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    if (!currentToken) {
      setRegistrationError('Please log in to create UPI ID');
      return;
    }
    
    console.log('Attempting UPI registration with:', {
      upi_id: registrationForm.upi_id,
      pin: registrationForm.pin.replace(/./g, '*'),
      token: currentToken ? 'Token present' : 'No token'
    });
    
    setLoading(true);
    try {
      const response = await axiosClient.post('/upi/register', { 
        upi_id: registrationForm.upi_id, 
        pin: registrationForm.pin 
      }, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      
      const data = response.data;
      if (data && data.upi_id) {
        setRegistrationSuccess('UPI ID created successfully!');
        setRegistrationError(null);
        setRegistrationForm({ upi_id: '', pin: '', confirm_pin: '' });
        fetchUPIInfo();
      } else {
        setRegistrationError(data.msg || 'Registration failed');
        setRegistrationSuccess(null);
      }
    } catch (error) {
      console.error('Error registering UPI:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        config: error.config
      });
      
      let errorMessage = 'Network error: Unable to register UPI';
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          errorMessage = 'Please log in again to create UPI ID';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.msg || 
                        error.response.data?.message || 
                        'Invalid UPI ID or PIN format';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = error.response.data?.msg || 
                        error.response.data?.message || 
                        `Server error (${error.response.status})`;
        }
      } else if (error.request) {
        // Network error - no response received
        errorMessage = 'Network error: Unable to connect to server. Please check your internet connection.';
      } else {
        // Other error
        errorMessage = error.message || 'An unexpected error occurred';
      }
      
      setRegistrationError(errorMessage);
      setRegistrationSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async () => {
    setLoading(true);
    try {
      const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      if (!currentToken) {
        setPaymentStatus({ success: null, error: 'Please log in to make payment' });
        return;
      }
      
      const { data } = await axiosClient.post('/upi/pay', paymentForm, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      if (data && data.status === 'success') {
        setPaymentStatus({ success: 'Payment successful!', error: null });
        setPaymentForm({ recipient_upi: '', amount: '', note: '', pin: '' });
        
        // Immediately update balance and transactions
        await Promise.all([
          fetchTransactions(),
          fetchUPIInfo()
        ]);
        
        // Show success message for a few seconds before redirecting
        setTimeout(() => {
          const successParams = new URLSearchParams({
            transaction_id: data.transaction_id,
            amount: data.amount.toString(),
            recipient_upi: data.recipient_upi,
            sender_upi: data.sender_upi,
            note: data.note || '',
            timestamp: data.timestamp
          });
          window.location.href = `/upi/payment-success?${successParams.toString()}`;
        }, 2000);
      } else {
        setPaymentStatus({ success: null, error: data.msg || 'Payment failed' });
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      const errorMessage = error.response?.data?.msg || 
                          error.response?.data?.message || 
                          error.message || 
                          'Network error: payment failed';
      setPaymentStatus({ success: null, error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const copyUPIId = () => {
    navigator.clipboard.writeText(upiInfo?.upi_id || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Enhanced polling for balance and transactions updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTransactions();
      fetchUPIInfo(); // Also refresh balance every 15 seconds
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Auto clear success/error msgs after 3 seconds
  useEffect(() => {
    if (registrationSuccess || registrationError) {
      const t = setTimeout(() => {
        setRegistrationSuccess(null);
        setRegistrationError(null);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [registrationSuccess, registrationError]);

  useEffect(() => {
    if (paymentStatus.success || paymentStatus.error) {
      const t = setTimeout(() => setPaymentStatus({ success: null, error: null }), 3000);
      return () => clearTimeout(t);
    }
  }, [paymentStatus]);

  // Send OTP to email
  const handleSendOtp = async () => {
    setResetLoading(true);
    setResetStatus({ success: null, error: null });
    try {
      const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      await axiosClient.post('/upi/send-otp', {}, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      setResetStep(2);
      setResetStatus({ success: 'OTP sent to your email.', error: null });
    } catch (error) {
      setResetStatus({ success: null, error: error.response?.data?.msg || 'Failed to send OTP' });
    } finally {
      setResetLoading(false);
    }
  };

  // Verify OTP and reset PIN
  const handleResetPin = async () => {
    setResetLoading(true);
    setResetStatus({ success: null, error: null });
    if (!resetEmailOtp || !resetNewPin || !resetConfirmPin) {
      setResetStatus({ success: null, error: 'All fields are required.' });
      setResetLoading(false);
      return;
    }
    if (resetNewPin !== resetConfirmPin) {
      setResetStatus({ success: null, error: 'PINs do not match.' });
      setResetLoading(false);
      return;
    }
    try {
      const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      await axiosClient.post('/upi/reset-pin', {
        otp: resetEmailOtp,
        new_pin: resetNewPin
      }, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      setResetStatus({ success: 'PIN reset successful!', error: null });
      setTimeout(() => {
        setShowResetPin(false);
        setResetStep(1);
        setResetEmailOtp('');
        setResetNewPin('');
        setResetConfirmPin('');
        setResetStatus({ success: null, error: null });
      }, 2000);
    } catch (error) {
      setResetStatus({ success: null, error: error.response?.data?.msg || 'Failed to reset PIN' });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      <div className="max-w-4xl mx-auto py-10 px-4">
        {/* Hero Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full p-4 shadow-lg mb-4">
            <MdQrCode className="text-white text-5xl" />
          </div>
                      <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">SBI Bank UPI</h1>
          <p className="text-lg text-gray-600 mb-2">Fast, Secure & Instant Payments</p>
        </div>

        {/* UPI Info Card */}
        {upiInfo && (
          <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between px-8 py-6 mb-8 border border-blue-100">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-gray-500 text-xs mb-1">Your UPI ID</span>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-mono font-semibold text-blue-700">{upiInfo.upi_id}</span>
                <button
                  onClick={copyUPIId}
                  className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                  title="Copy UPI ID"
                >
                  {copied ? <FaCheck className="text-green-500" /> : <FaCopy className="text-blue-700" />}
                </button>
              </div>
            </div>
            <div className="text-center md:text-right mt-4 md:mt-0">
              <span className="text-gray-500 text-xs">Available Balance</span>
              <div className="text-2xl font-bold text-indigo-700">{formatCurrency(upiInfo.balance)}</div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 rounded-full p-1 shadow-md flex gap-2">
            {[
              { id: 'pay', label: 'Pay', icon: MdSend },
              { id: 'receive', label: 'Receive', icon: MdQrCode },
              { id: 'history', label: 'History', icon: MdHistory }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all duration-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:bg-blue-100'
                }`}
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-2xl mx-auto">
          {/* Pay Tab */}
          {activeTab === 'pay' && (
            <div className="bg-white/90 rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-700">
                <MdSend />
                Send Money
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient UPI ID
                  </label>
                  <input
                    type="text"
                    placeholder="example@sbibank"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={paymentForm.recipient_upi}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPaymentForm(prev => ({ ...prev, recipient_upi: value }));
                      if (value.includes('@')) {
                        validateUPI(value);
                      }
                    }}
                    disabled={showPinStep}
                  />
                  {validationResult && (
                    <div className={`mt-2 text-sm ${validationResult.valid ? 'text-green-600' : 'text-red-600'}`}>
                      {validationResult.valid 
                        ? `Valid UPI ID - ${validationResult.user?.name}`
                        : validationResult.message
                      }
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                    disabled={showPinStep}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Payment for..."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={paymentForm.note}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, note: e.target.value }))}
                    disabled={showPinStep}
                  />
                </div>
                {/* Step 1: Proceed button */}
                {!showPinStep && (
                  <button
                    onClick={() => {
                      if (!paymentForm.recipient_upi || !paymentForm.amount) {
                        setPaymentStatus({ success: null, error: 'Enter UPI ID and amount' });
                        return;
                      }
                      setShowPinStep(true);
                    }}
                    disabled={loading || !paymentForm.recipient_upi || !paymentForm.amount}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Proceed
                  </button>
                )}
                {/* Step 2: PIN entry and Send Money button */}
                {showPinStep && (
                  <div className="rounded-xl bg-blue-50 p-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        UPI PIN
                      </label>
                      <input
                        type="password"
                        placeholder="Enter your UPI PIN"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={paymentForm.pin}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, pin: e.target.value }))}
                      />
                      <button
                        type="button"
                        className="text-blue-600 text-xs mt-2 underline"
                        onClick={() => setShowResetPin(true)}
                      >
                        Forgot PIN?
                      </button>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={async () => {
                          await processPayment();
                          setShowPinStep(false);
                        }}
                        disabled={loading || !paymentForm.pin}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Processing...' : 'Send Money'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPinStep(false)}
                        className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}
                {paymentStatus.error && (
                  <p className="text-red-600 text-sm mt-2">{paymentStatus.error}</p>
                )}
                {paymentStatus.success && (
                  <p className="text-green-600 text-sm mt-2">{paymentStatus.success}</p>
                )}
              </div>
            </div>
          )}

          {/* Receive Tab */}
          {activeTab === 'receive' && (
            <div className="bg-white/90 rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-700">
                <MdQrCode />
                Receive Money
              </h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₹) - Optional
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={qrForm.amount}
                    onChange={(e) => setQrForm(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note - Optional
                  </label>
                  <input
                    type="text"
                    placeholder="Payment for..."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={qrForm.note}
                    onChange={(e) => setQrForm(prev => ({ ...prev, note: e.target.value }))}
                  />
                </div>
                <button
                  onClick={generateQR}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate QR Code'}
                </button>
              </div>
              {qrCode && (
                <div className="text-center">
                  <div className="bg-white p-4 rounded-2xl border-2 border-gray-200 inline-block shadow-lg">
                    <img 
                      src={qrCode.qr} 
                      alt="UPI QR Code" 
                      className="w-64 h-64 mx-auto"
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600">
                      Scan with any UPI app to pay {upiInfo?.name}
                    </p>
                    {qrCode.amount && (
                      <p className="text-lg font-semibold text-blue-600">
                        Amount: {formatCurrency(qrCode.amount)}
                      </p>
                    )}
                    <div className="flex justify-center gap-2 mt-4">
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        <FaDownload />
                        Download
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        <FaShare />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="bg-white/90 rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-700">
                <MdHistory />
                Transaction History
              </h2>
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MdPayment className="text-4xl mx-auto mb-2 opacity-50" />
                    <p>No UPI transactions yet</p>
                  </div>
                ) : (
                  transactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.remark}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </p>
                          {transaction.sender_upi && (
                            <p className="text-xs text-gray-400">From: {transaction.sender_upi}</p>
                          )}
                          {transaction.recipient_upi && (
                            <p className="text-xs text-gray-400">To: {transaction.recipient_upi}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          transaction.isSuccess 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.isSuccess ? 'Success' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <MdQrCode className="text-3xl text-blue-600" />,
              title: "QR Payments",
              description: "Generate and scan QR codes for instant payments"
            },
            {
              icon: <MdSend className="text-3xl text-green-600" />,
              title: "Instant Transfers",
              description: "Send money instantly using UPI ID"
            },
            {
              icon: <MdAccountBalance className="text-3xl text-purple-600" />,
              title: "24/7 Available",
              description: "Transfer money anytime, anywhere"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white/90 rounded-2xl shadow-xl p-6 text-center hover:scale-105 transition-transform">
              <div className="mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scaleIn relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowConfirm(false)}>&times;</button>
              <h3 className="text-xl font-bold mb-4">Confirm Payment</h3>
              <p className="mb-2">Recipient: <span className="font-semibold">{paymentForm.recipient_upi}</span></p>
              <p className="mb-2">Amount: <span className="font-semibold">₹{paymentForm.amount}</span></p>
              <p className="mb-4">Note: {paymentForm.note || '—'}</p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowConfirm(false)}
                >Cancel</button>
                <button
                  disabled={loading}
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 hover:shadow-lg disabled:opacity-50"
                  onClick={() => {
                    setShowConfirm(false);
                    processPayment();
                  }}
                >{loading ? 'Processing...' : 'Confirm'}</button>
              </div>
            </div>
          </div>
        )}

        {/* Reset PIN Modal */}
        {showResetPin && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowResetPin(false)}>&times;</button>
              <h2 className="text-xl font-bold mb-4">Reset UPI PIN</h2>
              {resetStep === 1 && (
                <>
                  <p className="mb-4 text-gray-600">Click below to send an OTP to your registered email.</p>
                  <button
                    onClick={handleSendOtp}
                    disabled={resetLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-xl font-semibold hover:scale-105 hover:shadow-lg disabled:opacity-50"
                  >
                    {resetLoading ? 'Sending OTP...' : 'Send OTP to Email'}
                  </button>
                </>
              )}
              {resetStep === 2 && (
                <form onSubmit={e => { e.preventDefault(); handleResetPin(); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">OTP (from email)</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg"
                      value={resetEmailOtp}
                      onChange={e => setResetEmailOtp(e.target.value)}
                      disabled={resetLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New UPI PIN</label>
                    <input
                      type="password"
                      className="w-full p-3 border rounded-lg"
                      value={resetNewPin}
                      onChange={e => setResetNewPin(e.target.value)}
                      maxLength={6}
                      disabled={resetLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New PIN</label>
                    <input
                      type="password"
                      className="w-full p-3 border rounded-lg"
                      value={resetConfirmPin}
                      onChange={e => setResetConfirmPin(e.target.value)}
                      maxLength={6}
                      disabled={resetLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-xl font-semibold hover:scale-105 hover:shadow-lg disabled:opacity-50"
                  >
                    {resetLoading ? 'Resetting PIN...' : 'Reset PIN'}
                  </button>
                </form>
              )}
              {resetStatus.error && <p className="text-red-600 text-sm mt-2">{resetStatus.error}</p>}
              {resetStatus.success && <p className="text-green-600 text-sm mt-2">{resetStatus.success}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UPIPage;