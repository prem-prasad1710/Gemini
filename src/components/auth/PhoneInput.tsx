'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PhoneFormData, phoneSchema } from '@/lib/validations';
import { CountryOption, fetchCountries } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  onSubmit: (data: PhoneFormData) => void;
  loading: boolean;
}

export function PhoneInput({ onSubmit, loading }: PhoneInputProps) {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);
  const [loadingCountries, setLoadingCountries] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  });

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoadingCountries(true);
        const countryData = await fetchCountries();
        setCountries(countryData);
        
        // Set default to US
        const defaultCountry = countryData.find(c => c.code === 'US') || countryData[0];
        if (defaultCountry) {
          setSelectedCountry(defaultCountry);
          setValue('countryCode', defaultCountry.dialCode);
        }
      } catch (error) {
        console.error('Failed to load countries:', error);
        // Even if there's an error, we should have fallback data from the API function
      } finally {
        setLoadingCountries(false);
      }
    };

    loadCountries();
  }, [setValue]);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm)
  );

  const handleCountrySelect = (country: CountryOption) => {
    setSelectedCountry(country);
    setValue('countryCode', country.dialCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to Gemini Clone
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Enter your phone number to get started
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Country & Phone Number
          </label>
          
          <div className="flex gap-2">
            {/* Country Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                disabled={loadingCountries}
                className={cn(
                  'flex items-center gap-2 h-10 px-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700',
                  loadingCountries && 'opacity-50 cursor-not-allowed'
                )}
              >
                {selectedCountry ? (
                  <>
                    <span className="text-lg">{selectedCountry.flag}</span>
                    <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Loading...</span>
                )}
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {isOpen && (
                <div className="absolute top-12 left-0 right-0 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="max-h-44 overflow-y-auto">
                    {filteredCountries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700"
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span className="flex-1 text-sm">{country.name}</span>
                        <span className="text-sm text-gray-500">{country.dialCode}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Phone Input */}
            <div className="flex-1">
              <Input
                type="tel"
                placeholder="Enter phone number"
                {...register('phone')}
                error={errors.phone?.message}
              />
            </div>
          </div>
          {errors.countryCode && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.countryCode.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          disabled={!selectedCountry}
        >
          Send OTP
        </Button>
      </form>
    </div>
  );
}
