"use client";
import React, { useState } from "react";
import { MapPin, Copy, Home, ArrowLeft, ArrowRight } from "lucide-react";
import { SignUpForm } from "@/app/(auth)/signup/page";
import AddressFields from "@/components/AddressFields";

// Define Address interface locally if not exported
interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface ContactAddressStepProps {
  form: SignUpForm;
  setForm: React.Dispatch<React.SetStateAction<SignUpForm>>;
  sameAsCurrent: boolean;
  setSameAsCurrent: React.Dispatch<React.SetStateAction<boolean>>;
  onNext: () => void;
  onPrev: () => void;
}

export default function ContactAddressStep({
  form,
  setForm,
  sameAsCurrent,
  setSameAsCurrent,
  onNext,
  onPrev,
}: ContactAddressStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAddress = (address: Address, prefix: string) => {
    const newErrors: Record<string, string> = {};
    if (!address.street.trim()) newErrors[`${prefix}Street`] = "Street address is required";
    if (!address.city.trim()) newErrors[`${prefix}City`] = "City is required";
    if (!address.state.trim()) newErrors[`${prefix}State`] = "State/Province is required";
    if (!address.country.trim()) newErrors[`${prefix}Country`] = "Country is required";
    if (!address.pincode.trim()) newErrors[`${prefix}Pincode`] = "ZIP/Pincode is required";
    return newErrors;
  };

  const validateForm = () => {
    let newErrors = validateAddress(form.currentAddress, "current");

    if (!sameAsCurrent) {
      newErrors = { ...newErrors, ...validateAddress(form.permanentAddress, "permanent") };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) onNext();
  };

  const copyCurrentToPermanent = () => {
    setForm({ ...form, permanentAddress: { ...form.currentAddress } });
    setSameAsCurrent(true);
  };

  const handleSameAddressChange = (checked: boolean) => {
    setSameAsCurrent(checked);
    if (checked) {
      setForm({ ...form, permanentAddress: { ...form.currentAddress } });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Home size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Address Information</h2>
            <p className="text-gray-600 text-sm">Enter your current and permanent addresses</p>
          </div>
        </div>
      </div>

      {/* Current Address Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Home size={20} className="text-blue-600" />
            Current Address
          </h3>
          <p className="text-gray-600 text-sm">Your present residential address</p>
        </div>
        <div className="p-6">
          <AddressFields
            address={form.currentAddress}
            onAddressChange={(field, value) =>
              setForm({
                ...form,
                currentAddress: { ...form.currentAddress, [field]: value },
              })
            }
            prefix="current"
            errors={errors}
          />
        </div>
      </div>

      {/* Permanent Address Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <MapPin size={20} className="text-purple-600" />
                Permanent Address
              </h3>
              <p className="text-gray-600 text-sm">Your permanent residential address</p>
            </div>
            {!sameAsCurrent && (
              <button
                onClick={copyCurrentToPermanent}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Copy size={14} />
                Copy from Current
              </button>
            )}
          </div>
        </div>
        <div className="p-6">
          {/* Same Address Checkbox */}
          <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              id="sameAddress"
              checked={sameAsCurrent}
              onChange={(e) => handleSameAddressChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="sameAddress" className="ml-3 text-sm text-gray-700">
              Permanent address is same as current address
            </label>
          </div>

          <AddressFields
            address={form.permanentAddress}
            onAddressChange={(field, value) =>
              setForm({
                ...form,
                permanentAddress: { ...form.permanentAddress, [field]: value },
              })
            }
            disabled={sameAsCurrent}
            prefix="permanent"
            errors={errors}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <ArrowLeft size={16} />
          Previous Step
        </button>
        
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Step 3 of 4</div>
          <div className="flex gap-1">
            <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-8 h-1 bg-blue-500 rounded-full"></div>
            <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Next Step
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}