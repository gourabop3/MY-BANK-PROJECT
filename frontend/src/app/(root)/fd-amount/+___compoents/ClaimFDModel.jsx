"use client";
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import moment from 'moment'
import { TbCoins } from "react-icons/tb";
import { axiosClient } from '@/utils/AxiosClient';
import { toast } from 'react-toastify';
import { useMainContext } from '@/context/MainContext';
import { generateAccountNumber, formatAccountNumber } from '@/utils/accountUtils';

const ClaimFDModel = ({ id, methods }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [fetchLoading, setFetchLoading] = useState(false)
    const { fetchUserProfile, user } = useMainContext()

    // Safely destructure methods
    const { isUpdate, setIsUpdate } = methods || {}

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    const fetchFDInformation = async () => {
        if (!id) {
            toast.error('FD ID is required')
            return
        }

        try {
            setFetchLoading(true)
            const token = localStorage.getItem("token")
            
            if (!token) {
                toast.error('Please login to continue')
                return
            }

            const response = await axiosClient.get(`/fd/get/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            const responseData = await response.data 

            setData(responseData)

        } catch (error) {
            console.error('Error fetching FD information:', error)
            const errorMessage = error?.response?.data?.msg || error?.message || 'Failed to fetch FD information'
            toast.error(errorMessage)
        } finally {
            setFetchLoading(false)
        }
    }

    const claimedFD = async () => {
        if (!id) {
            toast.error('FD ID is required')
            return
        }

        try {
            setLoading(true)
            const token = localStorage.getItem("token")
            
            if (!token) {
                toast.error('Please login to continue')
                return
            }

            const response = await axiosClient.get(`/fd/claim/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            const responseData = await response.data 

            toast.success(responseData.msg || 'FD claimed successfully!')
            
            // Update the parent state if methods are available
            if (setIsUpdate && typeof setIsUpdate === 'function') {
                setIsUpdate(prev => !prev)
            }
            
            // Refresh user profile
            if (fetchUserProfile && typeof fetchUserProfile === 'function') {
                await fetchUserProfile()
            }
            
            // Close the modal
            closeModal()

        } catch (error) {
            console.error('Error claiming FD:', error)
            const errorMessage = error?.response?.data?.msg || error?.message || 'Failed to claim FD'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchFDInformation()
        }
    }, [id])

    // Safely compute the formatted account number
    const formattedAccountNumber = (() => {
        try {
            if (!data || !user || !data.account) return 'N/A';
            const accountObj = user?.account_no?.find(acc => acc._id === data.account);
            if (!accountObj) return data.account || 'N/A';
            const accNum = generateAccountNumber(user._id, accountObj._id, accountObj.ac_type);
            return formatAccountNumber(accNum);
        } catch (error) {
            console.error('Error formatting account number:', error)
            return 'N/A'
        }
    })();

    // Show loading state while fetching
    if (fetchLoading) {
        return (
            <button disabled className="px-4 py-2 rounded border text-gray-400 border-gray-400 cursor-not-allowed">
                Loading...
            </button>
        )
    }

    if (!user) {
        return (
            <button disabled className="px-4 py-2 rounded border text-gray-400 border-gray-400 cursor-not-allowed">
                Please login to claim
            </button>
        )
    }

    return (
        <>
            <button 
                onClick={openModal} 
                className="px-4 py-2 rounded border text-rose-600 border-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                disabled={!data}
            >
                Claim
            </button>

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
                        <div className="fixed inset-0 bg-black/25" />
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
                                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="div"
                                        className="text-lg font-medium leading-6 flex items-center justify-between text-gray-900"
                                    >
                                        <h3 className='text-2xl text-rose-500'>
                                            {data?.apply_for || 'Fixed Deposit'}
                                        </h3>
                                        <button 
                                            onClick={closeModal} 
                                            className='text-2xl text-rose-700 cursor-pointer outline-none bg-rose-100 rounded-full p-3 hover:bg-rose-200 transition-colors'
                                        >    
                                            <IoClose/>
                                        </button>
                                    </Dialog.Title>
                                    
                                    <div className="mt-2">
                                        <div className="w-full py-3 flex justify-center items-center">
                                            <img src="/logo.svg" alt="SBI Bank Logo" className='w-1/2 mx-auto' />
                                        </div> 
                                        
                                        {data ? (
                                            <table className='table w-full border-collapse'>
                                                <tbody className='w-full'>
                                                    <tr className='border text-center w-full'>
                                                        <th className='text-center py-3 border bg-gray-50'>Account No</th>
                                                        <td className='text-center py-3 border px-4'>{formattedAccountNumber}</td>
                                                    </tr>
                                                    
                                                    <tr className='border text-center w-full'>
                                                        <th className='text-center py-3 border bg-gray-50'>Principal Amount</th>
                                                        <td className='text-center py-3 border px-4'>₹{data.amount?.toLocaleString() || 0}</td>
                                                    </tr>
                                                    
                                                    <tr className='border text-center py-3 w-full'>
                                                        <th className='text-center py-3 border bg-gray-50'>Daily Interest</th>
                                                        <td className='text-center py-3 border px-4'>₹{data.interest_amount_per_day?.toFixed(2) || 0}</td>
                                                    </tr>
                                                    
                                                    <tr className='border text-center py-3 w-full'>
                                                        <th className='text-center py-3 border bg-gray-50'>Total Interest</th>
                                                        <td className='text-center py-3 border px-4'>₹{data.totalamount?.toFixed(2) || 0}</td>
                                                    </tr>
                                                    
                                                    <tr className='border text-center py-3 w-full'>
                                                        <th className='text-center py-3 border bg-gray-50'>Maturity Amount</th>
                                                        <td className='text-center py-3 border px-4 font-bold text-green-600'>
                                                            ₹{((data.amount || 0) + (data.totalamount || 0)).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                    
                                                    <tr className='border text-center py-3 w-full'>
                                                        <th className='text-center py-3 border bg-gray-50'>Deposit Date</th>
                                                        <td className='text-center py-3 border px-4'>
                                                            {data.date ? moment(data.date).format("MMMM DD, YYYY") : 'N/A'}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500">No FD information available</p>
                                            </div>
                                        )}

                                        {data && (
                                            <div className="py-5">
                                                <button 
                                                    onClick={claimedFD} 
                                                    disabled={loading} 
                                                    className='w-full rounded py-3 flex justify-center items-center gap-x-2 bg-rose-600 disabled:bg-rose-400 text-white capitalize text-xl hover:bg-rose-700 transition-colors disabled:cursor-not-allowed'
                                                >
                                                    <span>{loading ? 'Processing...' : 'Claim Fixed Deposit'}</span>
                                                    <TbCoins className='text-2xl' />
                                                </button>
                                            </div>
                                        )}
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

export default ClaimFDModel