"use client";

interface ProfileSidebarProps {
  user: any;
}

export default function ProfileSidebar({ user }: ProfileSidebarProps) {
  if (!user) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <div className="flex flex-col items-center text-center">
        <img
          src={user.image || "/default-avatar.png"}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
  );
}
