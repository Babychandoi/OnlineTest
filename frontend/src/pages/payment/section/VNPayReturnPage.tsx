// src/pages/PaymentResultPage.tsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { checkPaymentStatus } from '../../../services/service';
import { TransactionStatus } from '../../../types/payment.types';
import './PaymentResultPage.css';
import { formatDateTime } from '../../../util/util';

const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<TransactionStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkPayment = async () => {
      try {
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        if (Object.keys(params).length === 0) {
          setStatus({
            code: '99',
            message: 'Không tìm thấy thông tin giao dịch',
          });
          setLoading(false);
          return;
        }

        const result = await checkPaymentStatus(params);
        setStatus(result);
      } catch (error) {
        console.error('Error checking payment:', error);
        setStatus({
          code: '99',
          message: 'Có lỗi xảy ra khi kiểm tra giao dịch',
        });
      } finally {
        setLoading(false);
      }
    };

    checkPayment();
  }, [searchParams]);

  const formatCurrency = (value?: number): string => {
    if (!value) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="result-container">
        <div className="result-card loading">
          <div className="spinner-large"></div>
          <p>Đang xác thực giao dịch...</p>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="result-container">
        <div className="result-card error">
          <div className="icon">❌</div>
          <h2>Lỗi</h2>
          <p>Không thể xác thực giao dịch</p>
          <button onClick={handleBackToHome}>Quay lại trang chủ</button>
        </div>
      </div>
    );
  }

  const isSuccess = status.code === '00';

  return (
    <div className="result-container">
      <div className={`result-card ${isSuccess ? 'success' : 'failed'}`}>
        <div className="icon">
          {isSuccess ? '✅' : '❌'}
        </div>
        
        <h2>{isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}</h2>
        
        <p className="message">{status.message}</p>

        {status.transactionId && (
          <div className="transaction-details">
            <h3>Thông tin giao dịch</h3>
            
            <div className="detail-row">
              <span className="label">Mã giao dịch:</span>
              <span className="value">{status.transactionId}</span>
            </div>

            {status.amount && (
              <div className="detail-row">
                <span className="label">Số tiền:</span>
                <span className="value amount">{formatCurrency(status.amount)}</span>
              </div>
            )}

            {status.orderInfo && (
              <div className="detail-row">
                <span className="label">Nội dung:</span>
                <span className="value">{status.orderInfo}</span>
              </div>
            )}

            {status.bankCode && (
              <div className="detail-row">
                <span className="label">Ngân hàng:</span>
                <span className="value">{status.bankCode}</span>
              </div>
            )}

            {status.payDate && (
              <div className="detail-row">
                <span className="label">Thời gian:</span>
                <span className="value">{formatDateTime(status.payDate)}</span>
              </div>
            )}
          </div>
        )}

        <div className="action-buttons">
          <button className="primary-button" onClick={handleBackToHome}>
            Quay lại trang chủ
          </button>
          {isSuccess && (
            <button 
              className="secondary-button" 
              onClick={() => window.print()}
            >
              In biên lai
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;