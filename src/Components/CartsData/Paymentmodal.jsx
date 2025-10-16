import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './PaymentModal.css'
import { orderAction } from '../../Redux/Slices/orderSlice';
const PaymentModal = ({ iframeUrl, handleClose }) => {

  const dispatch = useDispatch();
  const show = useSelector(state => state.orderreducer.showPaymentModal);



  if (!show) return null;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="custom-modal-header">
          <h2>Complete Your Payment</h2>
          <button className="custom-close-button" onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="custom-modal-body" style={{ height: '600px' }}>
          <iframe
            src={iframeUrl}
            title="Payment"
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
