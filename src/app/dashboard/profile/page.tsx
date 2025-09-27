"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AvatarSection from "@/components/profile-component/AvatarSection";
import SocialAccounts from "@/components/profile-component/SocialAccounts";
import PersonalInfo from "@/components/profile-component/PersonalInfo";
import AddressInfo from "@/components/profile-component/AddressInfo";
import SkillsSection from "@/components/profile-component/Skills";

interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  image?: string;
  dob?: string;
  gender?: string;
  bio?: string;
  skill?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  currentAddress?: Address;
  permanentAddress?: Address;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState({
    personal: false,
    address: false,
    skills: false,
    social: false,
  });
  const [loading, setLoading] = useState(false);

  // Fetch user data
  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await axios.get("/api/me", { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        toast.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleSave = async (section: string, data: any) => {
    setLoading(true);
    try {
      let updatedData: any = {};

      switch (section) {
        case "personal":
          updatedData = {
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            dob: data.dob,
            gender: data.gender,
            bio: data.bio,
          };
          break;

        case "address":
          updatedData = {
            currentAddress: data.currentAddress,
            permanentAddress: data.permanentAddress,
          };
          break;

        case "skills":
          const skillsArray = data.skill
            .split(/[, ]+/)
            .map((s: string) => s.trim())
            .filter((s: string) => s);
          updatedData = {
            skill: skillsArray.join(","),
          };
          break;

        case "social":
          updatedData = {
            githubUrl: data.githubUrl,
            linkedinUrl: data.linkedinUrl,
          };
          break;

        default:
          updatedData = data;
      }

      const res = await axios.put("/api/me", updatedData, { withCredentials: true });
      setUser({ ...user, ...res.data });
      setEditMode({ ...editMode, [section]: false });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = (section: keyof typeof editMode) => {
    setEditMode({ ...editMode, [section]: !editMode[section] });
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No user data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <AvatarSection user={user} onUserUpdate={setUser} />
            <SocialAccounts
              user={user}
              editMode={editMode.social}
              onEditToggle={() => toggleEditMode("social")}
              onSave={(data) => handleSave("social", data)}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <PersonalInfo
              user={user}
              editMode={editMode.personal}
              onEditToggle={() => toggleEditMode("personal")}
              onSave={(data) => handleSave("personal", data)}
            />

            <AddressInfo
              user={user}
              editMode={editMode.address}
              onEditToggle={() => toggleEditMode("address")}
              onSave={(data) => handleSave("address", data)}
            />

            <SkillsSection
              user={user}
              editMode={editMode.skills}
              onEditToggle={() => toggleEditMode("skills")}
              onSave={(data) => handleSave("skills", data)}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .input-field {
          @apply w-full px-4 py-3 border-2 border-black rounded-xl;
        }
      `}</style>
    </div>
  );
}