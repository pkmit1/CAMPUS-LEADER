"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import {
  Edit,
  Trash,
  X,
  Plus,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";

import RichTextEditor from "../RichTextEditor";
import LoadingUI from "../loadingUI";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Feed {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    role: string;
    image?: string;
  };
}

interface FeedFormProps {
  initialFeeds?: Feed[];
}

export default function FeedForm({ initialFeeds = [] }: FeedFormProps) {
  const [feeds, setFeeds] = useState<Feed[]>(initialFeeds);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(!initialFeeds.length);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", message: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [editingFeedId, setEditingFeedId] = useState<string | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>(
    {}
  );

  // fetch feeds + user
  const fetchFeeds = useCallback(async () => {
    try {
      setLoading(true);
      const [resFeeds, resUser] = await Promise.all([
        axios.get("/api/feed", { withCredentials: true }),
        axios.get("/api/me", { withCredentials: true }),
      ]);
      setFeeds(resFeeds.data);
      setUser(resUser.data);
      setError("");
    } catch (err) {
      setError("Failed to load feeds. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialFeeds.length) fetchFeeds();
  }, [initialFeeds.length, fetchFeeds]);

  // save post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) return toast.error("Enter a title");
    if (!formData.message.trim()) return toast.error("Enter content");

    setFormLoading(true);
    try {
      if (editingFeedId) {
        await axios.put(`/api/feed/${editingFeedId}`, formData, {
          withCredentials: true,
        });
        toast.success("Post updated!");
      } else {
        await axios.post("/api/feed", formData, { withCredentials: true });
        toast.success("Post published!");
      }
      setFormData({ title: "", message: "" });
      setShowForm(false);
      setEditingFeedId(null);
      fetchFeeds();
    } catch {
      toast.error(editingFeedId ? "Update failed" : "Publish failed");
    } finally {
      setFormLoading(false);
    }
  };

  // delete post
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    try {
      await axios.delete(`/api/feed/${id}`, { withCredentials: true });
      toast.success("Post deleted!");
      setFeeds((prev) => prev.filter((f) => f.id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  // render post content with show more/less
  const renderMessage = (feed: Feed) => {
    const { message, id } = feed;
    const isExpanded = expandedPosts[id] || false;

    try {
      const contentState = convertFromRaw(JSON.parse(message));
      const html = stateToHTML(contentState);

      if (!isExpanded && html.length > 500) {
        return (
          <div>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: html.slice(0, 500) + "..." }}
            />
            <button
              onClick={() =>
                setExpandedPosts((prev) => ({ ...prev, [id]: true }))
              }
              className="text-blue-600 text-sm font-medium mt-2"
            >
              Show more
            </button>
          </div>
        );
      }

      return (
        <div>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          {html.length > 500 && (
            <button
              onClick={() =>
                setExpandedPosts((prev) => ({ ...prev, [id]: false }))
              }
              className="text-blue-600 text-sm font-medium mt-2"
            >
              Show less
            </button>
          )}
        </div>
      );
    } catch {
      if (!isExpanded && message.length > 500) {
        return (
          <div>
            <p className="whitespace-pre-wrap text-gray-700">
              {message.slice(0, 500)}...
            </p>
            <button
              onClick={() =>
                setExpandedPosts((prev) => ({ ...prev, [id]: true }))
              }
              className="text-blue-600 text-sm font-medium mt-2"
            >
              Show more
            </button>
          </div>
        );
      }

      return (
        <div>
          <p className="whitespace-pre-wrap text-gray-700">{message}</p>
          {message.length > 500 && (
            <button
              onClick={() =>
                setExpandedPosts((prev) => ({ ...prev, [id]: false }))
              }
              className="text-blue-600 text-sm font-medium mt-2"
            >
              Show less
            </button>
          )}
        </div>
      );
    }
  };

  // utils
  const canEditDelete = (feed: Feed) =>
    user &&
    (user.role === "ADMIN" ||
      user.role === "LEADER" ||
      user.id === feed.user?.id);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "LEADER":
        return "default";
      default:
        return "secondary";
    }
  };

  const formatDate = (d: string) =>
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(d));

  // UI
  if (loading) {
    return <LoadingUI />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 px-2 py-4 sm:px-4 sm:py-6">
      {/* Header */}
      <div className="border-2 rounded-xl bg-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          Campus Community Feed
        </h1>
        {user && ["ADMIN", "LEADER"].includes(user.role) && !showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        )}
      </div>

      {/* Error */}
      {error && (
        <Card className="p-4 flex items-center gap-3 text-red-700 bg-red-50 border border-red-200">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
          <Button
            onClick={fetchFeeds}
            variant="outline"
            size="sm"
            className="ml-auto"
          >
            Retry
          </Button>
        </Card>
      )}

      {/* Feed List */}
      <div className="mx-2 w-full sm:w-3/4 md:w-2/4 ">
        {feeds.length === 0 ? (
          <Card className="py-12 text-center">
            <div className="text-5xl">📝</div>
            <p className="mt-2 text-gray-600">No posts yet</p>
          </Card>
        ) : (
          feeds.map((feed) => (
            <Card
              key={feed.id}
              className="p-3 sm:p-6 rounded-xl shadow-md border border-gray-200 bg-white hover:shadow-lg transition-shadow"
            >
              {/* Post header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-3">
                <div className="flex gap-2 sm:gap-4 items-center w-full "> 
                  <Avatar className="h-11 w-11 sm:h-14 sm:w-14 border-2 border-blue-400 shadow">
                    <AvatarImage src={feed.user?.image} alt="Profile" />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-bold">
                      {(feed.user?.name?.[0])}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center w-full">
                      <span className="font-semibold text-base sm:text-lg  truncate">
                        {feed.user?.name.toUpperCase()}
                      </span>
                      {/* Divider line */}
                      <span className="flex-1  border-dashed border-gray-300 mx-2"></span>
                      {/* Edit/Delete icons */}
                      {canEditDelete(feed) && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setFormData({
                                title: feed.title,
                                message: feed.message,
                              });
                              setEditingFeedId(feed.id);
                              setShowForm(true);
                            }}
                            aria-label="Edit"
                            className="p-2"
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(feed.id)}
                            aria-label="Delete"
                            className="p-2"
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        className="rounded-full px-2 py-1 text-xs"
                        variant={getRoleBadge(feed.user?.role || "")}
                      >
                        {feed.user?.role}
                      </Badge>
                    </div>
                      <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(feed.createdAt)}
                      </div>
                  </div>
                </div>
              </div>

              {/* Post body */}
              <h3 className="text-base sm:text-xl font-bold break-words text-gray-800 mb-2">
                {feed.title}
              </h3>
              <div className="mt-2">{renderMessage(feed)}</div>
            </Card>
          ))
        )}
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-2 sm:p-4">
          <Card className="w-full max-w-lg sm:max-w-3xl max-h-[90vh] flex flex-col bg-gray-50 overflow-hidden shadow-lg">
            <div className="flex justify-between p-4 border-b">
              <h2 className="text-lg sm:text-xl font-bold">
                {editingFeedId ? "Edit Post" : "Create Post"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowForm(false);
                  setEditingFeedId(null);
                  setFormData({ title: "", message: "" });
                }}
                aria-label="Close"
              >
                <X />
              </Button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                <input
                  type="text"
                  placeholder="Post title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full border rounded-lg px-3 py-2 text-base"
                  maxLength={100}
                  required
                />

                <RichTextEditor
                  value={formData.message}
                  onChange={(message) =>
                    setFormData((p) => ({ ...p, message }))
                  }
                  placeholder="Write your content..."
                  minHeight={150}
                  maxHeight={300}
                />
              </div>

              <div className="p-4 border-t flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={formLoading}>
                  {formLoading && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingFeedId ? "Update" : "Publish"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
