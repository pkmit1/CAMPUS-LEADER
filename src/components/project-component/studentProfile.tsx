"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingUI from "@/components/loadingUI";
import AvatarSection from "@/components/profile-component/AvatarSection";
import SocialAccounts from "@/components/profile-component/SocialAccounts";
import PersonalInfo from "@/components/profile-component/PersonalInfo";
import SkillsSection from "@/components/profile-component/Skills";

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
}

interface Props {
  id: number;
  onClose: () => void;
}

export default function StudentProfilePage({ id, onClose }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) fetchStudent(id);
  }, [id]);

  const fetchStudent = async (studentId: number) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/students/${studentId}`);
      setUser(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch student profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) return <LoadingUI />;

  if (!user) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-gray-500">
        No student data found.
      </div>
    );
  }

  return (
    <div className="min-h-[400px]">
      <AvatarSection user={user} onUserUpdate={setUser} />
      <SocialAccounts user={user} editMode={false} readOnly={true} />
      <PersonalInfo user={user} editMode={false} readOnly={true} />
      <SkillsSection user={user} editMode={false} readOnly={true} />
    </div>
  );
}
