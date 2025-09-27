import React, { useState } from "react";
import { Users } from "lucide-react";
import { SignUpForm } from "@/app/(auth)/signup/page";

interface ParentInfoStepProps {
  form: SignUpForm;
  setForm: React.Dispatch<React.SetStateAction<SignUpForm>>;
  onNext: () => void;
  onPrev: () => void;
}

export default function ParentInfoStep({ form, setForm, onNext, onPrev }: ParentInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.fatherName.trim()) newErrors.fatherName = "Father's name is required";
    if (!form.motherName.trim()) newErrors.motherName = "Mother's name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Father's Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={form.fatherName}
              onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
              placeholder="Father's Full Name"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-300"
            />
          </div>
          {errors.fatherName && <p className="mt-1 text-sm text-red-600">{errors.fatherName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mother's Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={form.motherName}
              onChange={(e) => setForm({ ...form, motherName: e.target.value })}
              placeholder="Mother's Full Name"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-300"
            />
          </div>
          {errors.motherName && <p className="mt-1 text-sm text-red-600">{errors.motherName}</p>}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Next Step →
        </button>
      </div>
    </div>
  );
}