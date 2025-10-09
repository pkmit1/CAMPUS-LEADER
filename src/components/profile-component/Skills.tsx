"use client";

import { useState, useEffect } from "react";
import { Award, Edit2, Save, X } from "lucide-react";

interface SkillsSectionProps {
  user: {
    skill?: string;
  };
  editMode: boolean;
  readOnly?: boolean; // ✅ same as PersonalInfo
  onEditToggle?: () => void;
  onSave?: (data: { skill: string }) => void;
}

export default function Skills({
  user,
  editMode,
  readOnly = false,
  onEditToggle,
  onSave,
}: SkillsSectionProps) {
  const [form, setForm] = useState({
    skill: user.skill || "",
  });

  useEffect(() => {
    if (!editMode) {
      setForm({ skill: user.skill || "" });
    }
  }, [user, editMode]);

  const handleSave = () => {
    if (onSave) onSave(form);
    if (onEditToggle) onEditToggle();
  };

  const handleCancel = () => {
    setForm({ skill: user.skill || "" });
    if (onEditToggle) onEditToggle();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <Award size={30} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Skills & Expertise
            </h3>
            <p className="text-gray-600 text-sm">
              Your professional skills and abilities
            </p>
          </div>
        </div>

        {/* ✅ Only show edit/save/cancel if NOT readOnly */}
        {!readOnly &&
          (editMode ? (
            <div className="flex gap-4">
              <Save
                className="cursor-pointer text-green-600 hover:text-green-700"
                onClick={handleSave}
                size={22}
              />
              <X
                className="cursor-pointer text-red-600 hover:text-red-700"
                onClick={handleCancel}
                size={22}
              />
            </div>
          ) : (
            <Edit2
              className="cursor-pointer text-gray-600 hover:text-purple-600"
              onClick={onEditToggle}
              size={18}
            />
          ))}
      </div>

      {/* Content */}
      {!readOnly && editMode ? (
        // Edit Mode
        <div>
          <textarea
            value={form.skill}
            onChange={(e) => setForm({ ...form, skill: e.target.value })}
            placeholder="Enter your skills (e.g., Node, React, C++)"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-gray-500 text-sm mt-2">
            Separate skills with commas or spaces
          </p>
        </div>
      ) : user.skill ? (
        // Read Mode
        <div className="flex flex-wrap gap-3">
          {user.skill
            .split(/[, ]+/)
            .filter((skill) => skill.trim())
            .map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                {skill.trim()}
              </span>
            ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Award size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No skills added yet</p>
        </div>
      )}
    </div>
  );
}
