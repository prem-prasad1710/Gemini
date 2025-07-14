import axios from 'axios';

export interface Country {
  name: {
    common: string;
    official: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  flags: {
    svg: string;
    png: string;
  };
  cca2: string;
}

export interface CountryOption {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

export const fetchCountries = async (): Promise<CountryOption[]> => {
  // Comprehensive fallback data with major countries
  const fallbackCountries: CountryOption[] = [
    { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
    { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
    { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳' },
    { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪' },
    { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷' },
    { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦' },
    { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺' },
    { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵' },
    { name: 'South Korea', code: 'KR', dialCode: '+82', flag: '🇰🇷' },
    { name: 'China', code: 'CN', dialCode: '+86', flag: '🇨🇳' },
    { name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷' },
    { name: 'Mexico', code: 'MX', dialCode: '+52', flag: '🇲🇽' },
    { name: 'Russia', code: 'RU', dialCode: '+7', flag: '🇷🇺' },
    { name: 'Italy', code: 'IT', dialCode: '+39', flag: '🇮🇹' },
    { name: 'Spain', code: 'ES', dialCode: '+34', flag: '🇪🇸' },
    { name: 'Netherlands', code: 'NL', dialCode: '+31', flag: '🇳🇱' },
    { name: 'Sweden', code: 'SE', dialCode: '+46', flag: '🇸🇪' },
    { name: 'Norway', code: 'NO', dialCode: '+47', flag: '🇳🇴' },
    { name: 'Denmark', code: 'DK', dialCode: '+45', flag: '🇩🇰' },
    { name: 'Finland', code: 'FI', dialCode: '+358', flag: '🇫🇮' },
    { name: 'Switzerland', code: 'CH', dialCode: '+41', flag: '🇨🇭' },
    { name: 'Austria', code: 'AT', dialCode: '+43', flag: '🇦🇹' },
    { name: 'Belgium', code: 'BE', dialCode: '+32', flag: '🇧🇪' },
    { name: 'Poland', code: 'PL', dialCode: '+48', flag: '🇵🇱' },
    { name: 'Turkey', code: 'TR', dialCode: '+90', flag: '🇹🇷' },
    { name: 'South Africa', code: 'ZA', dialCode: '+27', flag: '🇿🇦' },
    { name: 'Egypt', code: 'EG', dialCode: '+20', flag: '🇪🇬' },
    { name: 'Nigeria', code: 'NG', dialCode: '+234', flag: '🇳🇬' },
    { name: 'Kenya', code: 'KE', dialCode: '+254', flag: '🇰🇪' },
    { name: 'UAE', code: 'AE', dialCode: '+971', flag: '🇦🇪' },
    { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦' },
    { name: 'Israel', code: 'IL', dialCode: '+972', flag: '🇮🇱' },
    { name: 'Singapore', code: 'SG', dialCode: '+65', flag: '🇸🇬' },
    { name: 'Thailand', code: 'TH', dialCode: '+66', flag: '🇹🇭' },
    { name: 'Malaysia', code: 'MY', dialCode: '+60', flag: '🇲🇾' },
    { name: 'Indonesia', code: 'ID', dialCode: '+62', flag: '🇮🇩' },
    { name: 'Philippines', code: 'PH', dialCode: '+63', flag: '🇵🇭' },
    { name: 'Vietnam', code: 'VN', dialCode: '+84', flag: '🇻🇳' },
    { name: 'Bangladesh', code: 'BD', dialCode: '+880', flag: '🇧🇩' },
    { name: 'Pakistan', code: 'PK', dialCode: '+92', flag: '🇵🇰' },
    { name: 'Sri Lanka', code: 'LK', dialCode: '+94', flag: '🇱🇰' },
    { name: 'Nepal', code: 'NP', dialCode: '+977', flag: '🇳🇵' },
    { name: 'New Zealand', code: 'NZ', dialCode: '+64', flag: '🇳🇿' },
    { name: 'Argentina', code: 'AR', dialCode: '+54', flag: '🇦🇷' },
    { name: 'Chile', code: 'CL', dialCode: '+56', flag: '🇨🇱' },
    { name: 'Colombia', code: 'CO', dialCode: '+57', flag: '🇨🇴' },
    { name: 'Peru', code: 'PE', dialCode: '+51', flag: '��' },
    { name: 'Venezuela', code: 'VE', dialCode: '+58', flag: '🇻🇪' },
    { name: 'Ukraine', code: 'UA', dialCode: '+380', flag: '🇺🇦' },
    { name: 'Czech Republic', code: 'CZ', dialCode: '+420', flag: '��' },
    { name: 'Hungary', code: 'HU', dialCode: '+36', flag: '🇭🇺' },
    { name: 'Romania', code: 'RO', dialCode: '+40', flag: '��' },
    { name: 'Greece', code: 'GR', dialCode: '+30', flag: '🇬🇷' },
    { name: 'Portugal', code: 'PT', dialCode: '+351', flag: '��' },
    { name: 'Ireland', code: 'IE', dialCode: '+353', flag: '��' },
  ];

  try {
    const response = await axios.get<Country[]>('https://restcountries.com/v3.1/all', {
      timeout: 5000, // 5 second timeout
    });
    
    const apiCountries = response.data
      .filter((country) => country.idd?.root && country.idd?.suffixes)
      .map((country) => ({
        name: country.name.common,
        code: country.cca2,
        dialCode: `${country.idd.root}${country.idd.suffixes[0] || ''}`,
        flag: country.flags.svg,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    return apiCountries.length > 0 ? apiCountries : fallbackCountries;
  } catch (error) {
    console.warn('Failed to fetch countries from API, using fallback data:', error);
    return fallbackCountries;
  }
};

export const simulateOTPSend = (phone: string, dialCode: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`OTP sent to ${dialCode}${phone}`);
      resolve(true);
    }, 2000);
  });
};

export const simulateOTPVerify = (otp: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Accept any 6-digit OTP for demo
      resolve(otp.length === 6 && /^\d+$/.test(otp));
    }, 1500);
  });
};

export const simulateAIResponse = (message: string): Promise<string> => {
  const responses = [
    "That's an interesting question! Let me help you with that.",
    "I understand what you're asking. Here's my perspective on that topic.",
    "Great question! Based on the information you've provided, I think...",
    "I'd be happy to help you with that. Here's what I know about this subject.",
    "That's a thoughtful inquiry. Let me break this down for you.",
    "I can see why you're curious about this. Here's my analysis:",
    "Thank you for bringing this up. I have some insights that might be helpful.",
    "This is definitely worth exploring. From my understanding...",
  ];
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      resolve(`${randomResponse} (This is a simulated AI response to: "${message}")`);
    }, 2000 + Math.random() * 3000); // 2-5 second delay
  });
};
