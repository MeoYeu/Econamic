import React from 'react';

export default function CheckoutSteps(props) {
  return (
    <div className="row checkout-steps">
      <div className={props.step1 ? 'active' : ''}>Đăng nhập</div>
      <div className={props.step2 ? 'active' : ''}>Vận chuyển</div>
      <div className={props.step3 ? 'active' : ''}>Thanh toán</div>
      <div className={props.step4 ? 'active' : ''}>Đặt hàng</div>
    </div>
  );
}
