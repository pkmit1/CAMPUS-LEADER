"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import React, { useState, useEffect } from "react";
import FeedForm from "./FeedForm"; // import your form
import LoadingUI from "./loadingUI";

function Feed() {
  const [feeds, setFeeds] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false); // 🔹 control modal

  useEffect(() => {
    async function fetchData() {
      try {
        const resFeeds = await axios.get("/api/feed", { withCredentials: true });
        setFeeds(resFeeds.data);

        const resUser = await axios.get("/api/me", { withCredentials: true });
        setUser(resUser.data);
      } catch (error) {
        setError("⚠️ Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* 🔹 Create Feed Button */}
      {user && (user.role === "ADMIN" || user.role === "LEADER") && (
        <div className="flex justify-end">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition-all"
            onClick={() => setShowForm(true)}
          >
            + Create Feed
          </button>
        </div>
      )}

      {/* 🔹 Popup Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>

            {/* Feed Form */}
            <FeedForm />
          </div>
        </div>
      )}

     {loading && <LoadingUI />}


      {error && <p className="text-red-500">{error}</p>}

      {/* 🔹 Feeds List */}
      {feeds.map((feed) => (
        <div
          key={feed.id}
          className="flex flex-col gap-6 py-6 shadow-sm relative group 
                     hover:shadow-2xl transition-all duration-500 bg-white/90 
                     backdrop-blur-sm hover:bg-white/95 rounded-3xl overflow-hidden 
                     hover:scale-[1.02] hover:-translate-y-1"
        >
          {/* Card Header */}
          <div className="grid items-start gap-1.5 pb-4 pt-6 px-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <span
                  className="relative flex size-8 shrink-0 overflow-hidden rounded-full 
                             h-14 w-14 ring-4 ring-slate-100 shadow-lg group-hover:ring-2 
                             group-hover:ring-blue-200 transition-all duration-300"
                >
                  <Avatar className="h-32 w-32">
                    <AvatarImage
                      src={feed.user?.image || "/default-avatar.png"}
                      alt="Profile"
                    />
                    <AvatarFallback>
                      {feed.user?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </span>
              </div>

              <div className="flex-1">
                <span className="font-bold text-slate-900 text-lg">
                  {feed.user?.name}
                </span>
                <p className="text-sm font-medium text-red-400">
                  {feed.user?.role}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(feed.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="pt-0 px-6 pb-6">
            <p className="text-2xl font-bold">{feed.title}</p>
            <p className="mt-4 text-slate-700 leading-relaxed">{feed.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Feed;
