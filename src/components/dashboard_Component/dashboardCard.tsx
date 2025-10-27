"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, UserCheck, Folder, FolderCheck } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  activeProjects: number;
}

export default function DashboardCard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, projectsRes] = await Promise.all([
          axios.get("/api/user"),
          axios.get("/api/project"),
        ]);
        const users = usersRes.data;
        const projects = projectsRes.data;

        setStats({
          totalUsers: users.length,
          activeUsers: users.filter((u: any) => u.isOnline).length,
          totalProjects: projects.length,
          activeProjects: projects.filter((p: any) => p.status === "ACTIVE").length,
        });
      } catch (err) {
        // handle error or show toast
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-3">
      <CardItem
        icon={<Users className="h-8 w-8 text-gray-700" />}
        label="Total Users"
        value={loading ? "..." : stats.totalUsers}
        gradient="from-gray-50 to-gray-100"
        border="border border-gray-200"
      />
      <CardItem
        icon={<UserCheck className="h-8 w-8 text-gray-700" />}
        label="Active Users"
        value={loading ? "..." : stats.activeUsers}
        gradient="from-gray-50 to-gray-100"
        border="border border-gray-200"
      />
      <CardItem
        icon={<Folder className="h-8 w-8 text-gray-700" />}
        label="Total Projects"
        value={loading ? "..." : stats.totalProjects}
        gradient="from-gray-50 to-gray-100"
        border="border border-gray-200"
      />
      <CardItem
        icon={<FolderCheck className="h-8 w-8 text-gray-700" />}
        label="Active Projects"
        value={loading ? "..." : stats.activeProjects}
        gradient="from-gray-50 to-gray-100"
        border="border border-gray-200"
      />
    </div>
  );
}

function CardItem({
  icon,
  label,
  value,
  gradient,
  border,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  gradient: string;
  border: string;
}) {
  return (
    <div
      className={`  items-center justify-center gap-2 p-6 rounded-xl shadow-sm bg-gradient-to-br ${gradient} ${border} hover:shadow-md transition-all duration-200 hover:scale-[1.02]`}
    >
      <div className=" flex gap-2 bg-gray-100 justify-evenly  mb-2 p-3  rounded-full border border-gray-200">
        {icon}
      <div className="text-lg font-semibold text-gray-800">{label}</div>
      </div>
      <div className="flex  justify-evenly text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}