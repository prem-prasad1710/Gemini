'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OTPFormData, otpSchema } from '@/lib/validations';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

interface OTPVerificationProps {
  phoneNumber: string;
  countryCode: string;
  onSubmit: (data: OTPFormData) => void;
  onBack: () => void;
  loading: boolean;
  onResend: () => void;
  resendLoading: boolean;
}

export function OTPVerification({
  phoneNumber,
  countryCode,
  onSubmit,
  onBack,
  loading,
  onResend,
  resendLoading,
}: OTPVerificationProps) {
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    const otpString = otp.join('');
    setValue('otp', otpString);
  }, [otp, setValue]);

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const digits = pastedText.replace(/\D/g, '').slice(0, 6);
    
    if (digits.length === 6) {
      const newOTP = digits.split('');
      setOTP(newOTP);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = () => {
    setResendTimer(30);
    onResend();
  };

  const onFormSubmit = (data: OTPFormData) => {
    onSubmit(data);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Verify Phone Number
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          We&apos;ve sent a 6-digit code to
        </p>
        <p className="font-medium text-gray-900 dark:text-white">
          {countryCode} {phoneNumber}
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
            Enter verification code
          </label>
          
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>
          
          {errors.otp && (
            <p className="text-sm text-red-600 dark:text-red-400 text-center">
              {errors.otp.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          disabled={otp.join('').length !== 6}
        >
          Verify OTP
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Didn&apos;t receive the code?{' '}
            {resendTimer > 0 ? (
              <span className="text-gray-500">
                Resend in {resendTimer}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </p>
        </div>
      </form>
    </div>
  );
}
