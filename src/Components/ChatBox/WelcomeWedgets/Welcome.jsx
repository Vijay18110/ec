
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaArrowRightLong } from 'react-icons/fa6';

const WelcomeChatWidget = ({setIsForm,handleShowForm}) => {
   
   
  return (
    <div className="position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1000, width: '400px', maxWidth: '100%' }}>
      <div className="border rounded shadow" style={{ background: 'rgb(250, 250, 242)' }}>
        
        {/* Header */}
        <div className="p-3 d-flex  align-items-center " style={{ height:"200px",backgroundColor: '#fff', color: 'white', borderTopLeftRadius: '6px', borderTopRightRadius: '6px' }}>
          <h1 className="mb-0 " style={{textAlign:"center"}}>Welcome to RAV ORGANICS!!</h1>
        </div>

        {/* Agent avatars */}
        <div className="d-flex justify-content-center align-items-center p-5 pb-4  " style={{maxHeight:"370px",overflowY:"hidden",scrollbarWidth:"thin"}}>
          
          <div className="position-relative" style={{ marginLeft: '-10px', zIndex: 1 }}>
            <div
              className="d-flex justify-content-center align-items-center rounded-circle"
              style={{
                width: '40px',
                height: '40px',
                border: '1.5px solid rgb(107, 172, 27)',
                backgroundColor: '#fff',
                color: 'rgb(107, 172, 27)',
                fontWeight: 'bold',
              }}
            >
              KR
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="px-5 pb-5">
          <h6 className="mb-1 fw-semibold" style={{textAlign:"center"}}>Chat with us!</h6>
          <p className="mb-2 text-muted mb-4" style={{ fontSize: '0.9rem',textAlign:"center" }}>Typically replies in a few minutes</p>

          {/* Start Conversation button */}
          <button onClick={handleShowForm}
            className="btn w-100 text-white d-flex justify-content-center gap-3 align-items-center"
            style={{
              backgroundColor: '#5A5328',
              border: '1px solid #5A5328',
              boxShadow: '0 2px 6px #5A532860',
            }}
          >
            <span>Start Conversation</span>
           <i><FaArrowRightLong /></i>
          </button>
        </div>

        {/* Branding */}
        <div className="text-center p-2 border-top bg-white">
          <a
            href="https://limechat.ai?utm_source=widget_branding"
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none text-muted small d-flex align-items-center justify-content-center gap-1"
          >
            Powered by LimeChat
           
          </a>
        </div>
      </div>
    </div>
  );
};

export default WelcomeChatWidget;
