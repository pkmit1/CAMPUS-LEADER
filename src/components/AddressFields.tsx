"use client";
import React, { useState, useEffect, useCallback, memo } from 'react';
import { ICountry, IState, ICity } from 'country-state-city';
import { Country, State, City } from 'country-state-city';
import { MapPin, Globe, Navigation, Building, Mailbox } from 'lucide-react';

interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface AddressFieldsProps {
  address: Address;
  onAddressChange: (field: string, value: string) => void;
  disabled?: boolean;
  prefix: string;
  errors?: Record<string, string>;
}

const AddressFields: React.FC<AddressFieldsProps> = memo(({
  address,
  onAddressChange,
  disabled = false,
  prefix,
  errors = {}
}) => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoized country data loading
  useEffect(() => {
    const loadCountries = () => {
      const allCountries = Country.getAllCountries();
      setCountries(allCountries);
      setIsInitialized(true);
    };
    
    loadCountries();
  }, []);

  // Memoized states loading
  useEffect(() => {
    if (isInitialized && address.country) {
      const countryStates = State.getStatesOfCountry(address.country);
      setStates(countryStates);
      setCities([]);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [address.country, isInitialized]);

  // Memoized cities loading
  useEffect(() => {
    if (isInitialized && address.country && address.state) {
      const stateCities = City.getCitiesOfState(address.country, address.state);
      setCities(stateCities);
    } else if (!address.state) {
      setCities([]);
    }
  }, [address.country, address.state, isInitialized]);

  // Memoized utility functions
  const getCountryName = useCallback((countryCode: string): string => {
    const country = countries.find(c => c.isoCode === countryCode);
    return country ? country.name : countryCode;
  }, [countries]);

  const getStateName = useCallback((stateCode: string): string => {
    const state = states.find(s => s.isoCode === stateCode);
    return state ? state.name : stateCode;
  }, [states]);

  // Memoized change handlers
  const handleCountryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    onAddressChange('country', newCountry);
    
    if (newCountry !== address.country) {
      onAddressChange('state', '');
      onAddressChange('city', '');
    }
  }, [address.country, onAddressChange]);

  const handleStateChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    onAddressChange('state', newState);
    
    if (newState !== address.state) {
      onAddressChange('city', '');
    }
  }, [address.state, onAddressChange]);

  // Memoized field change handlers to prevent unnecessary re-renders
  const handleStreetChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onAddressChange('street', e.target.value);
  }, [onAddressChange]);

  const handleCityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onAddressChange('city', e.target.value);
  }, [onAddressChange]);

  const handlePincodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onAddressChange('pincode', e.target.value);
  }, [onAddressChange]);

  // Memoized InputField component to prevent re-renders
  const InputField = useCallback(({ 
    label, 
    value, 
    onChange, 
    type = "text", 
    placeholder,
    error,
    icon: Icon,
    required = false
  }: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    error?: string;
    icon?: React.ComponentType<any>;
    required?: boolean;
  }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-lg border transition duration-300 ${
            error 
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
              : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          } ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white"}`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  ), [disabled]);

  // Memoized SelectField component to prevent re-renders
  const SelectField = useCallback(({ 
    label, 
    value, 
    onChange, 
    options,
    error,
    icon: Icon,
    required = false,
    disabledOption = false
  }: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: Array<{ value: string; label: string }>;
    error?: string;
    icon?: React.ComponentType<any>;
    required?: boolean;
    disabledOption?: boolean;
  }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
        )}
        <select
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled || disabledOption}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-lg border transition duration-300 ${
            error 
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
              : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          } ${disabled || disabledOption ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white"}`}
        >
          <option value="">Select {label}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  ), [disabled]);

  // Memoized address preview
  const addressPreview = React.useMemo(() => {
    if (!address.street && !address.city && !address.state && !address.country) {
      return null;
    }
    
    return (
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <p className="text-sm font-semibold text-blue-800 mb-2">Address Preview:</p>
        <p className="text-sm text-blue-600">
          {[
            address.street,
            address.city,
            address.state ? getStateName(address.state) : '',
            address.pincode,
            address.country ? getCountryName(address.country) : ''
          ].filter(Boolean).join(', ')}
        </p>
      </div>
    );
  }, [address.street, address.city, address.state, address.pincode, address.country, getStateName, getCountryName]);

  return (
    <div className="space-y-6">
      {/* Street Address */}
      <InputField
        label="Street Address"
        value={address.street}
        onChange={handleStreetChange}
        placeholder="123 Main Street, Apartment 4B"
        error={errors[`${prefix}Street`]}
        icon={MapPin}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Country */}
        <SelectField
          label="Country"
          value={address.country}
          onChange={handleCountryChange}
          options={countries.map(country => ({
            value: country.isoCode,
            label: country.name
          }))}
          error={errors[`${prefix}Country`]}
          icon={Globe}
          required
          disabledOption={disabled}
        />

        {/* State/Province */}
        <SelectField
          label="State/Province"
          value={address.state}
          onChange={handleStateChange}
          options={states.map(state => ({
            value: state.isoCode,
            label: state.name
          }))}
          error={errors[`${prefix}State`]}
          icon={Navigation}
          required
          disabledOption={disabled || !address.country}
        />

        {/* City */}
        <SelectField
          label="City"
          value={address.city}
          onChange={handleCityChange}
          options={cities.map(city => ({
            value: city.name,
            label: city.name
          }))}
          error={errors[`${prefix}City`]}
          icon={Building}
          required
          disabledOption={disabled || !address.state}
        />

        {/* ZIP/Pincode */}
        <InputField
          label="ZIP/Pincode"
          value={address.pincode}
          onChange={handlePincodeChange}
          placeholder="123456"
          error={errors[`${prefix}Pincode`]}
          icon={Mailbox}
          required
        />
      </div>

      {/* Address Summary */}
      {addressPreview}
    </div>
  );
});

AddressFields.displayName = 'AddressFields';

export default AddressFields;