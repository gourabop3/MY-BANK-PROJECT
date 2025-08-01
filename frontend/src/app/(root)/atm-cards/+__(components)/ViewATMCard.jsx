"use client";
import React, { useState } from 'react'
// Using Tailwind CSS for styling; removed external CSS import
import { useMainContext } from '@/context/MainContext'
import { FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import UseCardModel from './UseCard';
const ViewATMCard = () => {

  const {atm,user} = useMainContext()
  const [isShowCVV, setIsShowCVV] = useState(false)
  const [isShowNumber, setIsShowNumber] = useState(false)

  if(!atm || !atm.card_no){
    return <>
          <div className=" w-[96%] rounded py-10 px-10 lg:w-1/2  shadow text-xl">
             <img src="/noData.png" className='w-full h-full'  alt="no ATM" />
          </div>
    </>
  }

  // Circle color variables no longer needed as design switched to shared CSS classes.

  return (
        <> 
<div className="flex flex-col items-center">
  {/* Professional Single Card UI */}
  <div
    className={`atm-card atm-card-${atm.card_type.toLowerCase()} card-entrance relative w-full max-w-md rounded-2xl p-6 mb-6 overflow-hidden text-white min-h-[200px] shadow-lg`}
  >
    {/* Card Background Pattern */}
    <div className="card-pattern">
      <div className="card-pattern-circle-1"></div>
      <div className="card-pattern-circle-2"></div>
    </div>

    <div className="relative flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💳</span>
          <div className="text-left leading-tight">
                          <div className="text-xs font-semibold tracking-widest uppercase">SBI BANK</div>
            <div className="card-title mt-0.5">DEBIT CARD</div>
          </div>
        </div>
        <div className="text-right">
          <div className="card-label">Card Type</div>
          <div className="card-type-badge capitalize">{atm.card_type}</div>
        </div>
      </div>

      {/* Chip and contactless */}
      <div className="flex items-center justify-between mb-6">
        <div className="card-chip"></div>
        <span className="text-3xl text-white/90">📶</span>
      </div>

      {/* Card Number */}
      <div className="mb-6">
        <div className="card-label">Card Number</div>
        <div className="flex items-center gap-3">
          <div className="card-number text-xl">
            {isShowNumber ? (
              <>
                {atm.card_no.slice(0, 4)} {atm.card_no.slice(4, 8)} {atm.card_no.slice(8, 12)} {atm.card_no.slice(12, 16)}
              </>
            ) : (
              <>**** **** **** {atm.card_no.slice(12, 16)}</>
            )}
          </div>
          <button
            onClick={() => setIsShowNumber(!isShowNumber)}
            aria-label="Toggle card number visibility"
            className="card-toggle-btn text-white/80 hover:text-white"
          >
            {isShowNumber ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
          </button>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          <div className="card-label">Cardholder</div>
          <div className="card-value">{user?.name || 'CARDHOLDER'}</div>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <div className="card-label">CVV</div>
            <div className="flex items-center gap-2">
              <span className="card-value font-mono bg-white/10 px-2 py-1 rounded">{isShowCVV ? atm.cvv : '***'}</span>
              <button
                onClick={() => setIsShowCVV(!isShowCVV)}
                aria-label="Toggle CVV visibility"
                className="card-toggle-btn text-white/80 hover:text-white"
              >
                {isShowCVV ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <div className="card-label">Expires</div>
            <div className="card-value font-mono bg-white/10 px-2 py-1 rounded">
              {new Date(atm.expiry).getMonth() + 1}/{new Date(atm.expiry).getUTCFullYear().toString().slice(-2)}
            </div>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="card-security-badge">
        <FaShieldAlt className="text-lg" />
      </div>
    </div>
  </div>

  <div className="mb-3 flex justify-center py-3">
    <UseCardModel type={atm.card_type} />
  </div>

</div>
 
    </>
  )
}

export default ViewATMCard

/**
 * account
: 
"680b6bdd386bd07fb5901f82"
card_no
: 
"2759611527357498"
card_type
: 
"classic"
createdAt
: 
"2025-05-03T11:33:26.146Z"
cvv
: 
289
date
: 
"2025-05-03T11:33:26.143Z"
expiry
: 
"2025-08-03T11:33:26.141Z"
updatedAt
: 
"2025-05-03T11:33:26.146Z"
user
: 
"67f9e9d30279b55f3b94d700"
__v
: 
0
_id
: 
"6815ff06b829182eaa9cbf58"
 */