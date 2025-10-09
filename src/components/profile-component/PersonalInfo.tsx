"use client";

import { useState, useEffect } from "react";
import {
  User,
  Edit2,
  Save,
  X,
  Mail,
  Phone,
  Calendar,
  VenusAndMars,
  FileText,
} from "lucide-react";

interface PersonalInfoProps {
  user: {
    name: string;
    email: string;
    mobile?: string;
    dob?: string;
    gender?: string;
    bio?: string;
  };
  editMode: boolean;
  readOnly?: boolean; // ✅ used properly now
  onEditToggle?: () => void;
  onSave?: (data: any) => void;
}

export default function PersonalInfo({
  user,
  editMode,
  readOnly = false,
  onEditToggle,
  onSave,
}: PersonalInfoProps) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    mobile: user.mobile?.toString() || "",
    dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
    gender: user.gender || "",
    bio: user.bio || "",
  });

  useEffect(() => {
    if (!editMode) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile?.toString() || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        gender: user.gender || "",
        bio: user.bio || "",
      });
    }
  }, [user, editMode]);

  const handleSave = () => {
    if (onSave) {
      const filteredForm: any = {};
      Object.keys(form).forEach((key) => {
        if (
          form[key as keyof typeof form] !== "" &&
          form[key as keyof typeof form] !== undefined
        ) {
          filteredForm[key] = form[key as keyof typeof form];
        }
      });
      onSave(filteredForm);
    }
    if (onEditToggle) onEditToggle();
  };

  const handleCancel = () => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      mobile: user.mobile?.toString() || "",
      dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      gender: user.gender || "",
      bio: user.bio || "",
    });
    if (onEditToggle) onEditToggle();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Personal Information
              </h3>
              <p className="text-gray-600 text-sm">
                Manage your personal details
              </p>
            </div>
          </div>
          {!readOnly &&
            (editMode ? (
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
              <Edit2
                className="cursor-pointer"
                onClick={onEditToggle}
                size={16}
              />
            ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Edit Mode */}
        {!readOnly && editMode ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left */}
              <div className="space-y-4">
                {/* Full Name */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <User size={16} className="text-blue-600" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>

                {/* Email */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail size={16} className="text-red-500" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>

                {/* DOB */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-green-600" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>
              </div>

              {/* Right */}
              <div className="space-y-4">
                {/* Mobile */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone size={16} className="text-green-500" />
                    Mobile
                  </label>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) =>
                      setForm({ ...form, mobile: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>

                {/* Gender */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <VenusAndMars size={16} className="text-pink-500" />
                    Gender
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Bio */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText size={16} className="text-purple-500" />
                    Bio
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // ✅ Read-only Mode
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <label className="block text-xs font-medium text-gray-600 uppercase">
                  Full Name
                </label>
                <p className="font-bold text-gray-800">{user.name}</p>
              </div>

              <div className="bg-red-50 rounded-xl p-4">
                <label className="block text-xs font-medium text-gray-600 uppercase">
                  Email
                </label>
                <p className="font-bold text-gray-800">{user.email}</p>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <label className="block text-xs font-medium text-gray-600 uppercase">
                  DOB
                </label>
                <p className="font-bold text-gray-800">
                  {user.dob
                    ? new Date(user.dob).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not provided"}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="bg-emerald-50 rounded-xl p-4">
                <label className="block text-xs font-medium text-gray-600 uppercase">
                  Mobile
                </label>
                <p className="font-bold text-gray-800">
                  {user.mobile || "Not provided"}
                </p>
              </div>

              <div className="bg-pink-50 rounded-xl p-4">
                <label className="block text-xs font-medium text-gray-600 uppercase">
                  Gender
                </label>
                <p className="font-bold text-gray-800">
                  {user.gender || "Not specified"}
                </p>
              </div>

              {user.bio && (
                <div className="bg-purple-50 rounded-xl p-4">
                  <label className="block text-xs font-medium text-gray-600 uppercase">
                    Bio
                  </label>
                  <p className="text-gray-700">{user.bio}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
