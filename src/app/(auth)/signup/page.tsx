"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PersonalInfoStep from "@/app/(auth)/signup/steps/PersonalInfoStep";
import ParentInfoStep from "@/app/(auth)/signup/steps/ParentInfoStep";
import ContactAddressStep from "@/app/(auth)/signup/steps/ContactAddressStep";
import AdditionalDetailsStep from "@/app/(auth)/signup/steps/AdditionalDetailsStep";
import PreviewSubmitStep from "@/app/(auth)/signup/steps/PreviewSubmitStep";
import { Check } from "lucide-react";

// Types
export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface SignUpForm {
  name: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  fatherName: string;
  motherName: string;
  currentAddress: Address;
  permanentAddress: Address;
  bio: string;
  skills: string;
  githubUrl: string;
  linkedinUrl: string;
}

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  const [form, setForm] = useState<SignUpForm>({
    name: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    fatherName: "",
    motherName: "",
    currentAddress: { street: "", city: "", state: "", pincode: "", country: "IN" },
    permanentAddress: { street: "", city: "", state: "", pincode: "", country: "IN" },
    bio: "",
    skills: "",
    githubUrl: "",
    linkedinUrl: "",
  });

  const steps = [
    "Personal Information",
    "Parent Information", 
    "Contact & Address",
    "Additional Details",
    "Preview & Submit"
  ];

  const handleNext = () => {
    if (step < 5) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleEditStep = (stepNumber: number) => {
    setStep(stepNumber);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully! Check your email for temporary password.");
        setTimeout(() => router.push("/signin"), 3000);
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        {/* Progress Bar */}
        <div className="bg-gray-100/50 h-3 relative">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
          <div className="absolute inset-0 flex justify-between px-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-6 h-6 rounded-full border-2 -mt-1.5 transition-all duration-300 ${
                  step > index + 1
                    ? "bg-blue-500 border-blue-500"
                    : step === index + 1
                    ? "bg-white border-blue-500 shadow-lg"
                    : "bg-white border-gray-300"
                }`}
              >
                {step > index + 1 && (
                  <Check className="w-4 h-4 text-white mx-auto" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Your Account
            </h1>
            <p className="text-gray-600 mt-2">Step {step} of {steps.length}: {steps[step - 1]}</p>
          </div>

          {/* Step Components */}
          <div className="space-y-6">
            {step === 1 && (
              <PersonalInfoStep 
                form={form} 
                setForm={setForm} 
                onNext={handleNext}
              />
            )}

            {step === 2 && (
              <ParentInfoStep 
                form={form} 
                setForm={setForm} 
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}

            {step === 3 && (
              <ContactAddressStep 
                form={form} 
                setForm={setForm} 
                sameAsCurrent={sameAsCurrent}
                setSameAsCurrent={setSameAsCurrent}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}

            {step === 4 && (
              <AdditionalDetailsStep 
                form={form} 
                setForm={setForm} 
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}

            {step === 5 && (
              <PreviewSubmitStep 
                form={form}
                sameAsCurrent={sameAsCurrent}
                onEditStep={handleEditStep}
                onSubmit={handleSubmit}
                onPrev={handlePrev}
                loading={loading}
              />
            )}
          </div>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-600 font-medium hover:text-blue-500 transition-colors">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}