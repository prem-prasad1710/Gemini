'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { OTPVerification } from '@/components/auth/OTPVerification';
import { useAuthStore } from '@/store';
import { simulateOTPSend, simulateOTPVerify } from '@/services/api';
import { PhoneFormData, OTPFormData } from '@/lib/validations';

type AuthStep = 'phone' | 'otp';

export function AuthPage() {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneData, setPhoneData] = useState<PhoneFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  
  const { setUser, setLoading: setAuthLoading } = useAuthStore();
  const router = useRouter();

  const handlePhoneSubmit = async (data: PhoneFormData) => {
    setLoading(true);
    setAuthLoading(true);
    
    try {
      await simulateOTPSend(data.phone, data.countryCode);
      setPhoneData(data);
      setStep('otp');
      toast.success(`OTP sent to ${data.countryCode} ${data.phone}`);
    } catch (error) {
      console.error('Failed to send OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
      setAuthLoading(false);
    }
  };

  const handleOTPSubmit = async (data: OTPFormData) => {
    if (!phoneData) return;
    
    setLoading(true);
    setAuthLoading(true);
    
    try {
      const isValid = await simulateOTPVerify(data.otp);
      
      if (isValid) {
        const user = {
          id: Date.now().toString(),
          phone: phoneData.phone,
          countryCode: phoneData.countryCode,
          isAuthenticated: true,
        };
        
        setUser(user);
        toast.success('Successfully authenticated!');
        router.push('/dashboard');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setLoading(false);
      setAuthLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!phoneData) return;
    
    setResendLoading(true);
    
    try {
      await simulateOTPSend(phoneData.phone, phoneData.countryCode);
      toast.success('OTP resent successfully!');
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleBack = () => {
    setStep('phone');
    setPhoneData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
          {step === 'phone' ? (
            <PhoneInput onSubmit={handlePhoneSubmit} loading={loading} />
          ) : (
            <OTPVerification
              phoneNumber={phoneData?.phone || ''}
              countryCode={phoneData?.countryCode || ''}
              onSubmit={handleOTPSubmit}
              onBack={handleBack}
              loading={loading}
              onResend={handleResendOTP}
              resendLoading={resendLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
