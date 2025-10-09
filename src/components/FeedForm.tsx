"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { Edit, Ellipsis, Trash } from "lucide-react";

import RichTextEditor from "./RichTextEditor";
import LoadingUI from "./loadingUI";

interface Feed {
  id: string;
  title: string;
  message: string; // Draft.js JSON
  createdAt: string;
  user?: {
    id: string;
    name: string;
    role: string;
    image?: string;
  };
}

function FeedForm() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", message: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [editingFeedId, setEditingFeedId] = useState<string | null>(null);

  // Fetch feeds & user
  const fetchFeeds = async () => {
    try {
      const [resFeeds, resUser] = await Promise.all([
        axios.get("/api/feed", { withCredentials: true }),
        axios.get("/api/me", { withCredentials: true }),
      ]);
      setFeeds(resFeeds.data);
      setUser(resUser.data);
    } catch {
      setError("⚠️ Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  // Create / Edit feed
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingFeedId) {
        await axios.put(`/api/feed/${editingFeedId}`, formData, {
          withCredentials: true,
        });
        toast.success("Feed updated successfully!");
      } else {
        await axios.post("/api/feed", formData, { withCredentials: true });
        toast.success("Feed created successfully!");
      }
      setFormData({ title: "", message: "" });
      setShowForm(false);
      setEditingFeedId(null);
      fetchFeeds();
    } catch {
      toast.error("Failed to save feed");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (feed: Feed) => {
    setFormData({ title: feed.title, message: feed.message });
    setEditingFeedId(feed.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feed?")) return;
    try {
      await axios.delete(`/api/feed/${id}`, { withCredentials: true });
      toast.success("Feed deleted successfully!");
      setFeeds((prev) => prev.filter((f) => f.id !== id));
    } catch {
      toast.error("Failed to delete feed");
    }
  };

  const renderMessage = (message: string) => {
    if (!message) return null;
    try {
      const contentState = convertFromRaw(JSON.parse(message));
      return (
        <div
          className="max-h-96 overflow-y-auto prose max-w-none"
          dangerouslySetInnerHTML={{ __html: stateToHTML(contentState) }}
        />
      );
    } catch {
      return <p className="text-gray-600">{message}</p>;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 px-4 py-6">
      {/* Header */}
      <div className="bg-gray-500 rounded-2xl shadow-sm p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Campus Community Feed
        </h1>

        <div className="flex gap-3 items-center">
          {user && ["ADMIN", "LEADER"].includes(user.role) && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:scale-105 transition-transform"
            >
              + Create Feed
            </button>
          )}
        </div>
      </div>

      {/* Feed List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {loading && <LoadingUI />}
          {error && (
            <p className="text-red-500 text-center bg-red-50 p-4 rounded-xl">
              {error}
            </p>
          )}

          <div className="space-y-4">
            {feeds.map((feed) => {
              const canEditDelete =
                user &&
                (user.role === "ADMIN" ||
                  user.role === "LEADER" ||
                  user.id === feed.user?.id);

              return (
                <div
                  key={feed.id}
                  className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 relative"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-32 w-32 rounded-full border-4 border-blue-500 shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        <AvatarImage
                          src={feed?.user?.image || "/default-avatar.png"}
                          className="object-cover"
                        />
                        
                        <AvatarFallback className="bg-blue-100 object-cover text-blue-700 flex items-center justify-center text-3xl font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {feed.user?.name || "Anonymous"}
                        </h4>
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                          {feed.user?.role}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(feed.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Dropdown */}
                    {canEditDelete && (
                      <div className="relative group">
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                          <Ellipsis size={20} />
                        </button>
                        <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-xl border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button
                            className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                            onClick={() => handleEdit(feed)}
                          >
                            <Edit size={16} /> Edit
                          </button>
                          <button
                            className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 text-red-500"
                            onClick={() => handleDelete(feed.id)}
                          >
                            <Trash size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <h5 className="text-xl font-bold text-gray-900 mb-3">
                      {feed.title}
                    </h5>
                    {renderMessage(feed.message)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[80vh] relative mx-4 flex flex-col">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingFeedId(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg font-bold"
            >
              ✖
            </button>

            <h3 className="text-2xl font-bold mb-4 text-center mt-4">
              {editingFeedId ? "Edit Post" : "Create New Post"}
            </h3>

            <form
              className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="Post Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <div className="h-100 overflow-y-auto">
                <RichTextEditor
                  value={formData.message}
                  onChange={(msg) =>
                    setFormData((prev) => ({ ...prev, message: msg }))
                  }
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingFeedId(null);
                  }}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {formLoading
                    ? "Saving..."
                    : editingFeedId
                    ? "Update Post"
                    : "Create Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedForm;
