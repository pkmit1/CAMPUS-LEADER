"use client";

import { useState, useEffect } from "react";
import { MapPin, Edit2, Save, X, Home, Navigation } from "lucide-react";

interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

interface AddressInfoProps {
  user: {
    currentAddress?: Address;
    permanentAddress?: Address;
  };
  editMode: boolean;
  onEditToggle: () => void;
  onSave: (data: { currentAddress: Address; permanentAddress: Address }) => void;
}

export default function AddressInfo({ user, editMode, onEditToggle, onSave }: AddressInfoProps) {
  const [form, setForm] = useState({
    currentAddress: user.currentAddress || {
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
    permanentAddress: user.permanentAddress || {
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
  });

  useEffect(() => {
    if (!editMode) {
      setForm({
        currentAddress: user.currentAddress || {
          street: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
        },
        permanentAddress: user.permanentAddress || {
          street: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
        },
      });
    }
  }, [user, editMode]);

  const handleSave = () => {
    onSave(form);
  };

  const handleCancel = () => {
    setForm({
      currentAddress: user.currentAddress || {
        street: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      },
      permanentAddress: user.permanentAddress || {
        street: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      },
    });
    onEditToggle();
  };

  const updateAddress = (type: 'currentAddress' | 'permanentAddress', field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const hasAddressData = (address: Address | undefined) => {
    return address && Object.values(address).some(val => val && val.toString().trim() !== "");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <MapPin size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Address Information</h3>
              <p className="text-gray-600 text-sm">Your current and permanent addresses</p>
            </div>
          </div>
          {editMode ? (
            <div className="flex gap-4">
            <Save
              size={24}
              className="cursor-pointer text-green-600 hover:text-green-700"
              onClick={handleSave}
            />
            <X
              size={24}
              className="cursor-pointer text-red-600 hover:text-red-700"
              onClick={handleCancel}
            />
          </div>
          ) : (
            
              <Edit2 className="cursor-pointer" onClick={onEditToggle} size={16} />
              
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {editMode ? (
          <div className="space-y-8">
            {/* Current Address Section */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Navigation size={16} className="text-white" />
                </div>
                Current Address
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Street Address</label>
                  <input
                    type="text"
                    value={form.currentAddress.street}
                    onChange={(e) => updateAddress('currentAddress', 'street', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    placeholder="Enter street address"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={form.currentAddress.city}
                    onChange={(e) => updateAddress('currentAddress', 'city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    placeholder="Enter city"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    value={form.currentAddress.state}
                    onChange={(e) => updateAddress('currentAddress', 'state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    placeholder="Enter state"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Pincode</label>
                  <input
                    type="text"
                    value={form.currentAddress.pincode}
                    onChange={(e) => updateAddress('currentAddress', 'pincode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    placeholder="Enter pincode"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    value={form.currentAddress.country}
                    onChange={(e) => updateAddress('currentAddress', 'country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>

            {/* Permanent Address Section */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Home size={16} className="text-white" />
                </div>
                Permanent Address
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Street Address</label>
                  <input
                    type="text"
                    value={form.permanentAddress.street}
                    onChange={(e) => updateAddress('permanentAddress', 'street', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="Enter street address"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={form.permanentAddress.city}
                    onChange={(e) => updateAddress('permanentAddress', 'city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="Enter city"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    value={form.permanentAddress.state}
                    onChange={(e) => updateAddress('permanentAddress', 'state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="Enter state"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Pincode</label>
                  <input
                    type="text"
                    value={form.permanentAddress.pincode}
                    onChange={(e) => updateAddress('permanentAddress', 'pincode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="Enter pincode"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    value={form.permanentAddress.country}
                    onChange={(e) => updateAddress('permanentAddress', 'country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Address Display */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-md">
                  <Navigation size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">Current Address</h4>
                  <p className="text-gray-600 text-sm">Your present location</p>
                </div>
              </div>
              
              {hasAddressData(user.currentAddress) ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Street</span>
                    <span className="text-sm font-semibold text-gray-800">{user.currentAddress?.street || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">City</span>
                    <span className="text-sm font-semibold text-gray-800">{user.currentAddress?.city || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">State</span>
                    <span className="text-sm font-semibold text-gray-800">{user.currentAddress?.state || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Pincode</span>
                    <span className="text-sm font-semibold text-gray-800">{user.currentAddress?.pincode || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-600">Country</span>
                    <span className="text-sm font-semibold text-gray-800">{user.currentAddress?.country || "Not provided"}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Navigation size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No current address provided</p>
                </div>
              )}
            </div>

            {/* Permanent Address Display */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                  <Home size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">Permanent Address</h4>
                  <p className="text-gray-600 text-sm">Your permanent residence</p>
                </div>
              </div>
              
              {hasAddressData(user.permanentAddress) ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Street</span>
                    <span className="text-sm font-semibold text-gray-800">{user.permanentAddress?.street || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">City</span>
                    <span className="text-sm font-semibold text-gray-800">{user.permanentAddress?.city || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">State</span>
                    <span className="text-sm font-semibold text-gray-800">{user.permanentAddress?.state || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Pincode</span>
                    <span className="text-sm font-semibold text-gray-800">{user.permanentAddress?.pincode || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-600">Country</span>
                    <span className="text-sm font-semibold text-gray-800">{user.permanentAddress?.country || "Not provided"}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Home size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No permanent address provided</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}