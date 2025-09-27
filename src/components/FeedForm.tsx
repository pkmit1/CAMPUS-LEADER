"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import RichTextEditor from "./RichTextEditor";

function FeedForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState(""); // will hold JSON from Draft.js
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "/api/feed",
        { title, message }, // send JSON string
        { withCredentials: true }
      );

      if (res.status === 201) {
        setTitle("");
        setMessage("");
        toast.success("Feed created successfully!");
      }
    } catch (err: any) {
      toast.error("Failed to create feed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Create a Feed
      </h2>

      {/* Title */}
      <label className="block text-sm font-medium text-gray-700">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      {/* Draft.js Rich Text Editor */}
      <label className="block text-sm font-medium text-gray-700">Message</label>
      <RichTextEditor value={message} onChange={setMessage} />

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "Posting..." : "Post Feed"}
      </button>
    </form>
  );
}

export default FeedForm;
