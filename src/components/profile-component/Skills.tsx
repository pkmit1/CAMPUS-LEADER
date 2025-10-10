"use client";

import { useState, useEffect } from "react";
import { Award, Edit2, Save, X, Plus, Trash2 } from "lucide-react";

interface SkillsSectionProps {
  user: {
    skills?: string[]; // Array of skills
  };
  editMode: boolean;
  readOnly?: boolean;
  onEditToggle?: () => void;
  onSave?: (data: { skills: string[] }) => void;
}

export default function SkillsSection({
  user,
  editMode,
  readOnly = false,
  onEditToggle,
  onSave,
}: SkillsSectionProps) {
  const [skills, setSkills] = useState<string[]>(user.skills || []);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (!editMode) {
      setSkills(user.skills || []);
    }
  }, [user.skills, editMode]);

  const handleSave = () => {
    if (onSave) onSave({ skills });
    if (onEditToggle) onEditToggle();
  };

  const handleCancel = () => {
    setSkills(user.skills || []);
    setNewSkill("");
    if (onEditToggle) onEditToggle();
  };

  const addSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
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
            <h3 className="text-xl font-bold text-gray-800">Skills & Expertise</h3>
            <p className="text-gray-600 text-sm">Your professional skills and abilities</p>
          </div>
        </div>

        {/* Edit/Save/Cancel Controls */}
        {!readOnly && (
          <div className="flex gap-4">
            {editMode ? (
              <>
               
                  <Save 
                  className="cursor-pointer text-green-600 hover:text-green-700"
                  onClick={handleSave} 
                  size={24} />
            
                  <X  
                  className="cursor-pointer text-red-600 hover:text-red-700"
                  onClick={handleCancel} 
                  size={24} />
                  
              </>
            ) : (
             
              
                <Edit2 onClick={onEditToggle} size={18} />
                
              
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {editMode ? (
        // Edit Mode
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a skill (e.g., React, Node.js)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={addSkill}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus onClick={addSkill} size={18} />
              Add
            </button>
          </div>
          
          {/* Skills List in Edit Mode */}
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-full"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No skills added yet</p>
          )}
        </div>
      ) : (
        // Read Mode
        <div>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-medium shadow-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No skills added yet</p>
              {!readOnly && (
                <p className="text-gray-400 text-sm mt-2">
                  Click "Edit Skills" to add your skills
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}