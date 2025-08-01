"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import HeaderName from '@/components/HeaderName';
import { axiosClient } from '@/utils/AxiosClient';
import { useMainContext } from '@/context/MainContext';
import { generateAccountNumber, formatAccountNumber } from '@/utils/accountUtils';
import { 
  MdPhoneAndroid, 
  MdElectricBolt, 
  MdWater, 
  MdLocalGasStation,
  MdCreditCard,
  MdWifi,
  MdTv,
  MdCheckCircle,
  MdSecurity,
  MdSpeed,
  MdVerified,
  MdAccountBalance,
  MdPayment,
  MdReceipt
} from 'react-icons/md';
import { 
  FaCheckCircle, 
  FaSpinner, 
  FaShieldAlt, 
  FaBolt,
  FaWifi,
  FaCreditCard,
  FaTv,
  FaWater,
  FaFire,
  FaMobile,
  FaMoneyBillWave,
  FaGift,
  FaStar,
  FaCrown,
  FaGem
} from 'react-icons/fa';
import { BiMoney, BiTransfer } from 'react-icons/bi';
import { IoShieldCheckmark } from 'react-icons/io5';

const RechargePage = () => {
  const [activeTab, setActiveTab] = useState('mobile');
  // Remove real mode recharge feature and related logic
  // Only allow demo mode
  const [rechargeMode, setRechargeMode] = useState('demo'); // 'demo' only
  const [rechargeData, setRechargeData] = useState({
    mobileNumber: '',
    operator: '',
    amount: '',
    billType: '',
    consumerNumber: '',
    billAmount: ''
  });
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [operatorDetails, setOperatorDetails] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [balanceAnimation, setBalanceAnimation] = useState(false);
  const { user, fetchUserProfile } = useMainContext();
  const router = useRouter();

  // Get user's account information
  const primaryAccount = user?.account_no?.[0];
  const userAccountNumber = (primaryAccount && user?._id) ? generateAccountNumber(user._id, primaryAccount._id, primaryAccount.ac_type) : '';
  const userBalance = primaryAccount?.amount || 0;

  // Real-time balance updates with animation
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUserProfile();
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchUserProfile]);

  // Enhanced mobile operators with real details
  const mobileOperators = [
    { 
      id: 'jio', 
      name: 'Jio', 
      logo: '🔵', 
      color: '#0066cc',
      plans: [
        { amount: 149, validity: '24 days', data: '1GB/day', description: 'Unlimited calls + SMS', cashback: '₹10' },
        { amount: 299, validity: '28 days', data: '2GB/day', description: 'Unlimited calls + SMS', cashback: '₹25' },
        { amount: 349, validity: '56 days', data: '1.5GB/day', description: 'Unlimited calls + SMS', cashback: '₹40' },
        { amount: 599, validity: '84 days', data: '1.5GB/day', description: 'Unlimited calls + SMS', cashback: '₹75' },
        { amount: 1499, validity: '200 days', data: '2.5GB/day', description: 'Unlimited calls + SMS', cashback: '₹120' }
      ]
    },
    { 
      id: 'airtel', 
      name: 'Airtel', 
      logo: '🔴', 
      color: '#dc2626',
      plans: [
        { amount: 155, validity: '24 days', data: '1GB/day', description: 'Unlimited calls + 100 SMS', cashback: '₹12' },
        { amount: 319, validity: '30 days', data: '2GB/day', description: 'Unlimited calls + 100 SMS', cashback: '₹30' },
        { amount: 479, validity: '56 days', data: '1.5GB/day', description: 'Unlimited calls + 100 SMS', cashback: '₹50' },
        { amount: 719, validity: '84 days', data: '1.5GB/day', description: 'Unlimited calls + 100 SMS', cashback: '₹80' },
        { amount: 1199, validity: '84 days', data: '3GB/day', description: 'Unlimited calls + 100 SMS', cashback: '₹150' }
      ]
    },
    { 
      id: 'vi', 
      name: 'Vi (Vodafone Idea)', 
      logo: '🟣', 
      color: '#7c3aed',
      plans: [
        { amount: 157, validity: '28 days', data: '1GB/day', description: 'Unlimited calls + 100 SMS', cashback: '₹15' },
        { amount: 327, validity: '28 days', data: '2GB/day', description: 'Unlimited calls + 100 SMS', cashback: '₹35' },
        { amount: 497, validity: '56 days', data: '1.5GB/day', description: 'Unlimited calls + 100 SMS', cashback: '₹60' },
        { amount: 747, validity: '84 days', data: '1.5GB/day', description: 'Unlimited calls + 100 SMS', cashback: '₹90' },
        { amount: 1247, validity: '84 days', data: '3GB/day', description: 'Unlimited calls + 100 SMS', cashback: '₹180' }
      ]
    },
    { 
      id: 'bsnl', 
      name: 'BSNL', 
      logo: '🟡', 
      color: '#f59e0b',
      plans: [
        { amount: 107, validity: '35 days', data: '2GB/day', description: 'Unlimited calls + 100 SMS', cashback: '₹8' },
        { amount: 187, validity: '28 days', data: '2GB/day', description: 'Unlimited calls + 100 SMS', cashback: '₹20' },
        { amount: 397, validity: '80 days', data: '2GB/day', description: 'Unlimited calls + 100 SMS', cashback: '₹45' },
        { amount: 797, validity: '160 days', data: '2GB/day', description: 'Unlimited calls + 100 SMS', cashback: '₹100' }
      ]
    }
  ];

  // Enhanced bill payment types
  const billTypes = [
    { id: 'electricity', name: 'Electricity Bill', icon: MdElectricBolt, color: '#eab308', description: 'Pay electricity bills instantly' },
    { id: 'water', name: 'Water Bill', icon: MdWater, color: '#0ea5e9', description: 'Settle water utility bills' },
    { id: 'gas', name: 'Gas Bill', icon: MdLocalGasStation, color: '#f97316', description: 'Pay gas connection bills' },
    { id: 'credit_card', name: 'Credit Card', icon: MdCreditCard, color: '#dc2626', description: 'Credit card bill payments' },
    { id: 'broadband', name: 'Broadband/Internet', icon: MdWifi, color: '#059669', description: 'Internet service bills' },
    { id: 'dth', name: 'DTH/Cable TV', icon: MdTv, color: '#7c3aed', description: 'Cable TV and DTH bills' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRechargeData(prev => ({
      ...prev,
      [name]: value
    }));

    // Load plans when operator is selected
    if (name === 'operator' && value) {
      const operator = mobileOperators.find(op => op.id === value);
      if (operator) {
        setPlans(operator.plans);
        setOperatorDetails(operator);
      }
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setRechargeData(prev => ({
      ...prev,
      amount: plan.amount.toString()
    }));
  };

  const validateMobileNumber = (number) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(number);
  };

  const handleRecharge = async (e) => {
    e.preventDefault();
    
    if (activeTab === 'mobile') {
      if (!validateMobileNumber(rechargeData.mobileNumber)) {
        toast.error('Please enter a valid 10-digit mobile number');
        return;
      }
      
      if (!rechargeData.operator) {
        toast.error('Please select an operator');
        return;
      }
    } else {
      if (!rechargeData.billType) {
        toast.error('Please select bill type');
        return;
      }
      
      if (!rechargeData.consumerNumber) {
        toast.error('Please enter consumer/account number');
        return;
      }
    }

    const amount = parseFloat(activeTab === 'mobile' ? rechargeData.amount : rechargeData.billAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > userBalance) {
      toast.error('Insufficient balance');
      return;
    }

    if (amount < 10) {
      toast.error('Minimum amount is ₹10');
      return;
    }

    setShowConfirmation(true);
  };

  const confirmRecharge = async () => {
    setLoading(true);
    try {
      const endpoint = rechargeMode === 'real' ? '/recharge/real' : '/recharge/demo';
      const payload = activeTab === 'mobile' ? {
        mobileNumber: rechargeData.mobileNumber,
        operator: rechargeData.operator,
        amount: parseFloat(rechargeData.amount),
        rechargeType: 'mobile',
        mode: rechargeMode,
        planDetails: selectedPlan
      } : {
        billType: rechargeData.billType,
        consumerNumber: rechargeData.consumerNumber,
        amount: parseFloat(rechargeData.billAmount),
        rechargeType: 'bill',
        mode: rechargeMode
      };

      const response = await axiosClient.post(endpoint, payload, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });

      if (response.data.success) {
        await fetchUserProfile();
        
        // Animate balance update
        setBalanceAnimation(true);
        setTimeout(() => setBalanceAnimation(false), 2000);
        
        toast.success(`${activeTab === 'mobile' ? 'Recharge' : 'Bill payment'} successful! Balance updated.`);
        
        setTimeout(() => {
          const { transactionId, details } = response.data;
          const params = new URLSearchParams({
            txnId: transactionId,
            amount: activeTab === 'mobile' ? rechargeData.amount : rechargeData.billAmount,
            operator: activeTab === 'mobile' ? rechargeData.operator : rechargeData.billType,
            mobile: activeTab === 'mobile' ? rechargeData.mobileNumber : '',
            mode: rechargeMode,
            type: activeTab,
            ts: Date.now()
          });
          
          router.push(`/recharge-success?${params.toString()}`);
        }, 1500);
      }
    } catch (error) {
      toast.error(error?.response?.data?.msg || `${activeTab === 'mobile' ? 'Recharge' : 'Bill payment'} failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container py-6 md:py-10 px-4 md:px-6">
        <HeaderName />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-xl p-6 md:p-8 text-white mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <FaMobile className="text-3xl" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Quick Recharge & Bill Payments</h1>
                <p className="text-blue-100">Instant mobile recharge and utility bill payments</p>
              </div>
            </div>
            
            {/* Mode Toggle */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Mode:</span>
                <div className="flex bg-white/20 rounded-lg p-1">
                  <button
                    onClick={() => setRechargeMode('demo')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      rechargeMode === 'demo' 
                        ? 'bg-white text-blue-600 shadow-lg' 
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Demo Mode
                  </button>
                </div>
              </div>
              <div className="mt-2 text-xs text-blue-200">
                {rechargeMode === 'demo' ? 'Test transactions without real money' : 'Real money transactions'}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Account Info Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <MdAccountBalance className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Number</p>
                  <p className="font-mono font-semibold text-gray-800">{formatAccountNumber(userAccountNumber)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-xl">
                  <MdVerified className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Holder</p>
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <BiMoney className="text-purple-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available Balance</p>
                  <p className={`font-semibold text-lg transition-all duration-500 ${
                    balanceAnimation ? 'text-green-600 scale-110' : 'text-green-600'
                  }`}>
                    ₹{userBalance.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <MdSecurity className="text-orange-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transaction Mode</p>
                  <p className="font-semibold text-gray-800 capitalize">{rechargeMode}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('mobile')}
                className={`flex-1 px-6 py-4 text-center font-semibold flex items-center justify-center gap-3 transition-all ${
                  activeTab === 'mobile' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaMobile className="text-xl" />
                Mobile Recharge
              </button>
              <button
                onClick={() => setActiveTab('bills')}
                className={`flex-1 px-6 py-4 text-center font-semibold flex items-center justify-center gap-3 transition-all ${
                  activeTab === 'bills' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MdElectricBolt className="text-xl" />
                Bill Payments
              </button>
            </div>

            <div className="p-6 md:p-8">
              {activeTab === 'mobile' ? (
                /* Enhanced Mobile Recharge Form */
                <form onSubmit={handleRecharge} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="mobileNumber"
                          value={rechargeData.mobileNumber}
                          onChange={handleInputChange}
                          placeholder="Enter 10-digit mobile number"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          maxLength="10"
                          pattern="[6-9][0-9]{9}"
                          required
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <FaMobile className="text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Select Operator
                      </label>
                      <div className="relative">
                        <select
                          name="operator"
                          value={rechargeData.operator}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                          required
                        >
                          <option value="">Choose Operator</option>
                          {mobileOperators.map(op => (
                            <option key={op.id} value={op.id} className="py-2">
                              {op.logo} {op.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <FaShieldAlt className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Popular Plans */}
                  {plans.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <FaStar className="text-yellow-500 text-xl" />
                        <h3 className="text-xl font-bold text-gray-800">Popular Plans</h3>
                        {operatorDetails && (
                          <span className="text-sm text-gray-600">({operatorDetails.name})</span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {plans.map((plan, index) => (
                          <div
                            key={index}
                            onClick={() => handlePlanSelect(plan)}
                            className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                              rechargeData.amount === plan.amount.toString()
                                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="text-2xl font-bold text-blue-600">₹{plan.amount}</div>
                              {rechargeData.amount === plan.amount.toString() && (
                                <FaCheckCircle className="text-blue-500 text-xl" />
                              )}
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <FaBolt className="text-yellow-500" />
                                <span className="font-medium">Validity: {plan.validity}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaWifi className="text-green-500" />
                                <span className="font-medium">Data: {plan.data}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaMobile className="text-blue-500" />
                                <span className="text-gray-600">{plan.description}</span>
                              </div>
                              {plan.cashback && (
                                <div className="flex items-center gap-2 bg-green-100 p-2 rounded-lg">
                                  <FaGift className="text-green-600" />
                                  <span className="text-green-700 font-medium">Cashback: {plan.cashback}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Recharge Amount (₹)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="amount"
                        value={rechargeData.amount}
                        onChange={handleInputChange}
                        placeholder="Enter amount"
                        min="10"
                        max={userBalance}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <BiMoney className="text-gray-400 text-xl" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-400 flex items-center justify-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <FaMobile className="text-xl" />
                    {loading ? 'Processing...' : 'Recharge Now'}
                  </button>
                </form>
              ) : (
                /* Enhanced Bill Payment Form */
                <form onSubmit={handleRecharge} className="space-y-8">
                  <div className="space-y-4">
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                      Select Bill Type
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {billTypes.map(bill => {
                        const IconComponent = bill.icon;
                        return (
                          <div
                            key={bill.id}
                            onClick={() => setRechargeData(prev => ({ ...prev, billType: bill.id }))}
                            className={`border-2 rounded-xl p-6 cursor-pointer text-center transition-all duration-300 hover:shadow-lg ${
                              rechargeData.billType === bill.id
                                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }`}
                          >
                            <IconComponent 
                              className="text-4xl mx-auto mb-3" 
                              style={{ color: bill.color }} 
                            />
                            <p className="font-semibold text-gray-800 mb-1">{bill.name}</p>
                            <p className="text-xs text-gray-600">{bill.description}</p>
                            {rechargeData.billType === bill.id && (
                              <FaCheckCircle className="text-blue-500 mx-auto mt-3 text-xl" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Consumer/Account Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="consumerNumber"
                          value={rechargeData.consumerNumber}
                          onChange={handleInputChange}
                          placeholder="Enter consumer number"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          required
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <MdReceipt className="text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Bill Amount (₹)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="billAmount"
                          value={rechargeData.billAmount}
                          onChange={handleInputChange}
                          placeholder="Enter bill amount"
                          min="10"
                          max={userBalance}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          required
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <BiMoney className="text-gray-400 text-xl" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:bg-gray-400 flex items-center justify-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <BiMoney className="text-xl" />
                    {loading ? 'Processing...' : 'Pay Bill'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl text-white">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <IoShieldCheckmark className="text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      Confirm {activeTab === 'mobile' ? 'Recharge' : 'Bill Payment'}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      {rechargeMode === 'demo' ? 'Demo transaction' : 'Real money transaction'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {activeTab === 'mobile' ? (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Mobile Number:</span>
                      <span className="font-semibold text-gray-800">{rechargeData.mobileNumber}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Operator:</span>
                      <span className="font-semibold text-gray-800">
                        {mobileOperators.find(op => op.id === rechargeData.operator)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-lg text-green-600">₹{parseFloat(rechargeData.amount).toLocaleString()}</span>
                    </div>
                    {selectedPlan && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Plan:</strong> {selectedPlan.data} for {selectedPlan.validity}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Bill Type:</span>
                      <span className="font-semibold text-gray-800">
                        {billTypes.find(bill => bill.id === rechargeData.billType)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Consumer Number:</span>
                      <span className="font-semibold text-gray-800">{rechargeData.consumerNumber}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-lg text-green-600">₹{parseFloat(rechargeData.billAmount).toLocaleString()}</span>
                    </div>
                  </>
                )}
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmRecharge}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-400 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : <MdCheckCircle />}
                    {loading ? 'Processing...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RechargePage;