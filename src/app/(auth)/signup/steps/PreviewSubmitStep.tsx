import React, { useState } from "react";
import { User, Users, MapPin, FileText, Code, Github, Linkedin, Mail, Phone, Calendar, Shield, Edit } from "lucide-react";
import { SignUpForm, Address } from "@/app/(auth)/signup/page";

interface PreviewSubmitStepProps {
  form: SignUpForm;
  sameAsCurrent: boolean;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
  onPrev: () => void;
  loading: boolean;
}

export default function PreviewSubmitStep({ 
  form, 
  sameAsCurrent, 
  onEditStep, 
  onSubmit, 
  onPrev, 
  loading 
}: PreviewSubmitStepProps) {
  const [isAgreed, setIsAgreed] = useState(false);

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const PreviewField = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100">
      <div className="flex items-center gap-3 text-gray-600">
        {icon}
        <span className="font-medium">{label}:</span>
      </div>
      <span className="text-gray-800 font-semibold text-right">{value || "Not provided"}</span>
    </div>
  );

  const PreviewAddress = ({ label, address, icon }: { label: string; address: Address; icon: React.ReactNode }) => (
    <div className="py-3 border-b border-gray-100">
      <div className="flex items-center gap-3 text-gray-600 mb-2">
        {icon}
        <span className="font-medium">{label}:</span>
      </div>
      <div className="text-gray-800 font-semibold pl-8">
        <div>{address.street || "Not provided"}</div>
        <div>{[address.city, address.state, address.pincode].filter(Boolean).join(", ")}</div>
        <div>{address.country}</div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border border-blue-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          Review Your Information
        </h3>
        <p className="text-gray-600 mb-6">Please review all your details before submitting.</p>
        
        <div className="space-y-4">
          {/* Personal Information */}
          <div className="bg-white rounded-xl p-4 border">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Personal Information
              </h4>
              <button 
                onClick={() => onEditStep(1)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Edit className="w-3 h-3" />
                Edit
              </button>
            </div>
            <PreviewField label="Full Name" value={form.name} icon={<User className="w-4 h-4" />} />
            <PreviewField label="Email" value={form.email} icon={<Mail className="w-4 h-4" />} />
            <PreviewField label="Mobile" value={form.mobile} icon={<Phone className="w-4 h-4" />} />
            <PreviewField label="Date of Birth" value={form.dob ? new Date(form.dob).toLocaleDateString() : ""} icon={<Calendar className="w-4 h-4" />} />
            {form.dob && <PreviewField label="Age" value={`${calculateAge(form.dob)} years`} icon={<Calendar className="w-4 h-4" />} />}
            <PreviewField label="Gender" value={form.gender} icon={<User className="w-4 h-4" />} />
            <PreviewField label="Blood Group" value={form.bloodGroup} icon={<Shield className="w-4 h-4" />} />
          </div>

          {/* Parent Information */}
          <div className="bg-white rounded-xl p-4 border">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Parent Information
              </h4>
              <button 
                onClick={() => onEditStep(2)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Edit className="w-3 h-3" />
                Edit
              </button>
            </div>
            <PreviewField label="Father's Name" value={form.fatherName} icon={<Users className="w-4 h-4" />} />
            <PreviewField label="Mother's Name" value={form.motherName} icon={<Users className="w-4 h-4" />} />
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-xl p-4 border">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address Information
              </h4>
              <button 
                onClick={() => onEditStep(3)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Edit className="w-3 h-3" />
                Edit
              </button>
            </div>
            <PreviewAddress label="Current Address" address={form.currentAddress} icon={<MapPin className="w-4 h-4" />} />
            <PreviewAddress label="Permanent Address" address={form.permanentAddress} icon={<MapPin className="w-4 h-4" />} />
            {sameAsCurrent && (
              <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                ✓ Permanent address is same as current address
              </div>
            )}
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-xl p-4 border">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Additional Details
              </h4>
              <button 
                onClick={() => onEditStep(4)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Edit className="w-3 h-3" />
                Edit
              </button>
            </div>
            <PreviewField label="Bio" value={form.bio} icon={<FileText className="w-4 h-4" />} />
            <PreviewField label="Skills" value={form.skill} icon={<Code className="w-4 h-4" />} />
            <PreviewField label="GitHub" value={form.githubUrl} icon={<Github className="w-4 h-4" />} />
            <PreviewField label="LinkedIn" value={form.linkedinUrl} icon={<Linkedin className="w-4 h-4" />} />
          </div>
        </div>
      </div>

      {/* Agreement Checkbox */}
      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 mb-6">
        <div className="flex items-start gap-3">
          <input 
            type="checkbox" 
            id="agreement"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <div>
            <label htmlFor="agreement" className="text-sm font-medium text-gray-700">
              I agree to the Terms and Conditions and Privacy Policy
            </label>
            <p className="text-xs text-gray-600 mt-1">
              By checking this box, you confirm that all the information provided is accurate and complete. 
              A temporary password will be sent to your email address.
            </p>
          </div>
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
          onClick={onSubmit}
          disabled={loading || !isAgreed}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Account...
            </div>
          ) : (
            "🎉 Create Account & Send Password"
          )}
        </button>
      </div>
    </div>
  );
}