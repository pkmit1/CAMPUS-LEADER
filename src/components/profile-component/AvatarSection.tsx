"use client";

import { useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit2, Upload } from "lucide-react";
import toast from "react-hot-toast";

interface AvatarSectionProps {
  user: {
    id: number;
    name: string;
    image?: string;
    bio?: string;
  };
  onUserUpdate: (updatedUser: any) => void;
}

export default function AvatarSection({ user, onUserUpdate }: AvatarSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleImageUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post("/api/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      onUserUpdate({ ...user, image: res.data.imageUrl });
      setFile(null);
      setPreview("");
      toast.success("Profile picture updated successfully!");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4 group">
          <Avatar className="h-32 w-32 border-5 border-blue-500 shadow-2xl group-hover:scale-105 transition-transform duration-300">
            <AvatarImage
              src={preview || user.image || "/default-avatar.png"}
              alt="Profile"
            />
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-4xl font-bold">
              {user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <label className="absolute bottom-2 right-2 bg-white text-purple-600 p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform duration-200 border-2 border-purple-100">
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
            <Edit2 size={16} />
          </label>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {user.name}
        </h2>
        <p className="text-gray-600 text-lg mb-4">
          {user.bio || "BCA Student"}
        </p>

        {file && (
          <button
            onClick={handleImageUpload}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            <Upload size={16} />
            {loading ? "Uploading..." : "Save Profile Picture"}
          </button>
        )}
      </div>
    </div>
  );
}