"use client";

import { useState, useEffect } from "react";
import { User, Edit2, Save, X, Mail, Phone, Calendar, VenusAndMars, FileText } from "lucide-react";

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
  onEditToggle: () => void;
  onSave: (data: any) => void;
}

export default function PersonalInfo({ user, editMode, onEditToggle, onSave }: PersonalInfoProps) {
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
    onSave(form);
    onEditToggle();
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
    onEditToggle();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
              <p className="text-gray-600 text-sm">Manage your personal details</p>
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
            
              <Edit2 className="cursor-pointer"  onClick={onEditToggle} size={16} />
              
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {editMode ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
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
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail size={16} className="text-red-500" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="Enter your email"
                  />
                </div>

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

              {/* Right Column */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone size={16} className="text-green-500" />
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="Enter your mobile number"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <VenusAndMars size={16} className="text-pink-500" />
                    Gender
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText size={16} className="text-purple-500" />
                    Professional Bio
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Read Mode */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Full Name</label>
                    <p className="text-lg font-bold text-gray-800">{user.name}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <Mail size={18} className="text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Email Address</label>
                    <p className="text-lg font-bold text-gray-800">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Calendar size={18} className="text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Date of Birth</label>
                    <p className="text-lg font-bold text-gray-800">
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
              </div>
            </div>

            {/* Right Column - Read Mode */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Phone size={18} className="text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Mobile Number</label>
                    <p className="text-lg font-bold text-gray-800">{user.mobile || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-4 border border-pink-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                    <VenusAndMars size={18} className="text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Gender</label>
                    <p className="text-lg font-bold text-gray-800">{user.gender || "Not specified"}</p>
                  </div>
                </div>
              </div>

              {user.bio && (
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <FileText size={18} className="text-white" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Professional Bio</label>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed bg-white/50 rounded-lg p-3 text-sm">
                    {user.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}