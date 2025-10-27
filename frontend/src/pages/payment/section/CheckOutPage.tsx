// src/pages/CheckoutPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPayment } from '../../../services/service';
import { PaymentRequest } from '../../../types/payment.types';
import './CheckoutPage.css';

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    planId?: string;
    amount?: number;
    orderInfo?: string;
    planTitle?: string;
    planPrice?: string;
    planCurrency?: string;
  } | null;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    console.log('CheckoutPage state:', state);
    // If no state provided, redirect back to pricing
    if (!state?.amount) {
      console.warn('No state provided, redirecting back');
      // navigate(-1);
    }
  }, [state, navigate]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      const request: PaymentRequest = {
        amount: state?.amount || 0,
        orderInfo: state?.orderInfo || 'Thanh toán dịch vụ',
        orderType: 'billpayment',
        language: 'vn',
      };

      const response = await createPayment(request);

      if (response.code === '00' && response.paymentUrl) {
        // Redirect to VNPay payment gateway
        window.location.href = response.paymentUrl;
      } else {
        setError(response.message || 'Không thể tạo thanh toán');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <button
          className="back-button"
          onClick={handleBack}
          disabled={loading}
          title="Quay lại"
        >
          ← Quay lại
        </button>

        <h1 className="checkout-title">Thanh toán VNPAY</h1>

        {/* Plan Info Display */}
        {state?.planTitle && (
          <div className="plan-info-display">
            <div className="info-section">
              <label>Dịch vụ</label>
              <p className="info-value">{state.planTitle}</p>
            </div>

            <div className="info-section">
              <label>Số tiền thanh toán</label>
              <p className="info-value price">
                {state.planPrice} {state.planCurrency}
              </p>
              <small className="helper-text">
                {formatCurrency(state.amount || 0)}
              </small>
            </div>
          </div>
        )}

        {!state?.planTitle && (
          <div className="error-message">
            <span>⚠️</span> Không tìm thấy thông tin gói dịch vụ. Vui lòng quay lại và chọn lại.
          </div>
        )}

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        <button
          className="payment-button"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Đang xử lý...
            </>
          ) : (
            <>
              <span>💳</span>
              Thanh toán ngay
            </>
          )}
        </button>

        <div className="payment-info">
          <p>✅ An toàn và bảo mật</p>
          <p>✅ Hỗ trợ nhiều ngân hàng</p>
          <p>✅ Giao dịch nhanh chóng</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;