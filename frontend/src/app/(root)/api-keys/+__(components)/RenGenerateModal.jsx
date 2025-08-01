"use client";
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { toast } from 'react-toastify';
import CustomAuthButton from '@/components/reuseable/CustomAuthButton';
import { axiosClient } from '@/utils/AxiosClient';
import { useMainContext } from '@/context/MainContext'; 
import { FaKey, FaInfoCircle, FaShieldAlt } from 'react-icons/fa';

export default function RenGenerateModal({ onSuccess }) {
  const { fetchUserProfile } = useMainContext()
  let [isOpen, setIsOpen] = useState(false)
  const [loader, setLoader] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const handleGenerateAPIKeys = async() => {
    try {
      setLoader(true)
      
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error('Please login to continue')
        return
      }

      const response = await axiosClient.post('/api-keys/generate', {}, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      
      const data = await response.data 
      toast.success(data.msg)
      
      // Refresh user profile
      if (fetchUserProfile && typeof fetchUserProfile === 'function') {
        await fetchUserProfile()
      }
      
      // Call success callback to refresh API keys
      if (onSuccess && typeof onSuccess === 'function') {
        await onSuccess()
      }
      
      closeModal()

    } catch (error) {
      console.error('Error generating API keys:', error)
      const errorMessage = error?.response?.data?.msg || error?.message || 'Failed to generate API keys'
      toast.error(errorMessage)
    } finally {
      setLoader(false)
    }
  }

  return (
    <>
      <div className="flex justify-center items-center">
        <button
          type="button"
          onClick={openModal}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-white rounded-lg py-3 px-6 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Generate API Keys
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="div"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center mb-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <FaKey className="text-green-600 text-xl" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Generate API Keys</h3>
                    </div>
                    <button 
                      onClick={closeModal}
                      className='text-2xl text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full outline-none p-2 cursor-pointer transition-colors'
                    >
                      <IoMdClose/>
                    </button>
                  </Dialog.Title>
                  
                  <div className="mt-4">
                    <div className="w-full py-3 flex justify-center items-center mb-4">
                      <img src="/logo.svg" alt="SBI Bank Logo" className='w-1/2 mx-auto' />
                    </div> 

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <FaInfoCircle className="text-blue-600 mt-1" />
                        <div>
                          <p className="text-sm text-blue-800 font-medium mb-1">
                            Professional Payment Gateway Integration
                          </p>
                          <p className="text-xs text-blue-700">
                            Generate secure API credentials for payment processing, webhooks, and merchant services.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <FaShieldAlt className="text-amber-600 mt-1" />
                        <div>
                          <p className="text-sm text-amber-800 font-medium mb-1">
                            Security Notice
                          </p>
                          <p className="text-xs text-amber-700">
                            Your API keys will be generated with bank-grade security. Store them securely and never share them publicly.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <h4 className="font-semibold text-gray-800 text-sm">You will receive:</h4>
                      <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>API Secret Key for authentication</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>API Hash for request validation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>Payment Gateway Key for transactions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>Merchant ID for identification</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>Webhook configuration settings</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={closeModal}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <CustomAuthButton 
                        onClick={handleGenerateAPIKeys}
                        isLoading={loader} 
                        text={loader ? 'Generating...' : 'Generate Keys'} 
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      />
                    </div>

                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500">
                        Keys are generated instantly and can be regenerated anytime from your dashboard.
                      </p>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
