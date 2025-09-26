"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Edit2, User, School } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  collegeName: string;
  image?: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", collegeName: "" });

  // Fetch user
  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        setUser(res.data);
        setForm({
          name: res.data.name,
          email: res.data.email,
          collegeName: res.data.collegeName,
        });
      } catch (error) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // Image change preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Upload profile image
  const handleImageUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("/api/auth/me/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (user) setUser({ ...user, image: res.data.imageUrl });
      setFile(null);
      setPreview("");
    } catch (error) {
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  // Save profile
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        "/api/auth/me",
        { ...form, image: user?.image },
        { withCredentials: true }
      );
      setUser(res.data);
      setEditMode(false);
    } catch (error) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  if (!user) return <div>No user data found</div>;

  return (
    <div className="p-8 md:p-12 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT PROFILE CARD */}
        <div className="w-full md:w-1/3 bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center">
          <div className="relative w-32 h-32">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={preview || user.image || "/default-avatar.png"}
                alt="Profile"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer shadow">
              <input type="file" className="hidden" onChange={handleFileChange} />
              <Edit2 size={16} />
            </label>
          </div>

          {file && (
            <button
              onClick={handleImageUpload}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Save Image"}
            </button>
          )}

          <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h2>
        </div>

        {/* RIGHT INFO SECTION */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-purple-700">
                Contact & Profile
              </h3>
              <button
                onClick={() => setEditMode(!editMode)}
                className="text-gray-500 hover:text-purple-600"
              >
                <Edit2 size={18} />
              </button>
            </div>

            {/* Show Form if Editing */}
            {editMode ? (
              <div className="flex flex-col gap-4 mt-4">
                <input
                  type="text"
                  className="border p-2 rounded-lg"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  type="email"
                  className="border p-2 rounded-lg"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                  type="text"
                  className="border p-2 rounded-lg"
                  placeholder="College"
                  value={form.collegeName}
                  onChange={(e) =>
                    setForm({ ...form, collegeName: e.target.value })
                  }
                />
                <button
                  onClick={handleSave}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            ) : (
              // Normal Display
              <div className="grid md:grid-cols-2 gap-4 mt-4">

                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                  <User className="text-purple-600" size={20} />
                  <span>{user.name}</span>
                </div>
                
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                  <Mail className="text-purple-600" size={20} />
                  <span>{user.email}</span>
                </div>
                
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                  <School className="text-purple-600" size={20} />
                  <span>{user.collegeName}</span>
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
