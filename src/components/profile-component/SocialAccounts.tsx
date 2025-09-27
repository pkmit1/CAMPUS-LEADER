"use client";

import { useState, useEffect } from "react";
import { Edit2, Save, X, Github, Linkedin, Globe } from "lucide-react";

interface SocialAccountsProps {
  user: {
    githubUrl?: string;
    linkedinUrl?: string;
  };
  editMode: boolean;
  onEditToggle: () => void;
  onSave: (data: { githubUrl: string; linkedinUrl: string }) => void;
}

export default function SocialAccounts({ user, editMode, onEditToggle, onSave }: SocialAccountsProps) {
  const [form, setForm] = useState({
    githubUrl: user.githubUrl || "",
    linkedinUrl: user.linkedinUrl || "",
  });

  useEffect(() => {
    if (!editMode) {
      setForm({
        githubUrl: user.githubUrl || "",
        linkedinUrl: user.linkedinUrl || "",
      });
    }
  }, [user, editMode]);

  const handleSave = () => {
    onSave(form);
  };

  const handleCancel = () => {
    setForm({
      githubUrl: user.githubUrl || "",
      linkedinUrl: user.linkedinUrl || "",
    });
    onEditToggle();
  };

  const formatUrl = (url: string) => {
    if (!url) return "";
    // Remove protocol and www for display
    return url.replace(/^(https?:\/\/)?(www\.)?/, "");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-50 to-pink-50 px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Globe size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Social Accounts</h3>
              <p className="text-gray-600 text-sm">Your professional social profiles</p>
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
          <div className="space-y-4">
            {/* GitHub Input */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Github size={16} className="text-white" />
                </div>
                GitHub Profile
              </label>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 font-medium">github.com/</span>
                <input
                  type="text"
                  value={form.githubUrl.replace(/^(https?:\/\/)?(www\.)?github\.com\//, "")}
                  onChange={(e) => setForm({ ...form, githubUrl: `https://github.com/${e.target.value}` })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
                  placeholder="username"
                />
              </div>
            </div>

            {/* LinkedIn Input */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Linkedin size={16} className="text-white" />
                </div>
                LinkedIn Profile
              </label>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 font-medium">linkedin.com/in/</span>
                <input
                  type="text"
                  value={form.linkedinUrl.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, "")}
                  onChange={(e) => setForm({ ...form, linkedinUrl: `https://linkedin.com/in/${e.target.value}` })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="your-profile"
                />
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-xs text-blue-600 text-center">
                💡 Your profiles will be visible to employers and connections
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* GitHub Display */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center shadow-md">
                    <Github size={20} className="text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">GitHub</label>
                    {user.githubUrl ? (
                      <a
                        href={user.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-gray-800 hover:text-gray-600 transition-colors block"
                      >
                        {formatUrl(user.githubUrl)}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500">Not provided</p>
                    )}
                  </div>
                </div>
                {user.githubUrl && (
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-gray-800 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Visit
                  </a>
                )}
              </div>
            </div>

            {/* LinkedIn Display */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <Linkedin size={20} className="text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">LinkedIn</label>
                    {user.linkedinUrl ? (
                      <a
                        href={user.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-gray-800 hover:text-gray-600 transition-colors block"
                      >
                        {formatUrl(user.linkedinUrl)}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500">Not provided</p>
                    )}
                  </div>
                </div>
                {user.linkedinUrl && (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Visit
                  </a>
                )}
              </div>
            </div>

            {/* Empty State */}
            {!user.githubUrl && !user.linkedinUrl && (
              <div className="text-center py-6">
                <Globe size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No social accounts added yet</p>
                <p className="text-gray-400 text-xs mt-1">Add your profiles to increase visibility</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}