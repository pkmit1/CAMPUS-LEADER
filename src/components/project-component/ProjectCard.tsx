import React, { useState, useRef, useEffect } from "react";
import { 
  Calendar, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  description?: string;
  requirements?: string;
  createdById: number;
  deadline?: string;
  status: "ACTIVE" | "PENDING_REVIEW"| "IN_PROGRESS" | "ACCEPTED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  permission: "full" | "readonly";
  applied: "true" | "false";
}

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: (id: number) => void;
  onAccept: (id: number) => void;
  onViewApplicants: (id: number) => void;
}

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
  onAccept,
  onViewApplicants,
}: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 const getStatusConfig = (status: string) => {
  const normalized = status?.toUpperCase();

  const config = {
    ACTIVE: {
      color: "bg-green-50 text-green-700 border-green-200",
      icon: CheckCircle2,
      label: "Active",
    },
    PENDING_REVIEW: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock,
      label: "Pending Review",
    },
    IN_PROGRESS: {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Users,
      label: "In Progress",
    },
    ACCEPTED: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
      label: "Accepted",
    },
    CANCELLED: {
      color: "bg-red-50 text-red-700 border-red-200",
      icon: XCircle,
      label: "Cancelled",
    },
    COMPLETED: {
      color: "bg-purple-50 text-purple-700 border-purple-200",
      icon: CheckCircle2,
      label: "Completed",
    },
    DEFAULT: {
      color: "bg-gray-50 text-gray-600 border-gray-200",
      icon: AlertCircle,
      label: "Unknown",
    },
  };

  return config[normalized as keyof typeof config] || config.DEFAULT;
};


  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDeadlineConfig = (days: number) => {
    if (days < 0) return { 
      color: "text-red-600 bg-red-50 border-red-200", 
      label: "Overdue" 
    };
    if (days === 0) return { 
      color: "text-red-600 bg-red-50 border-red-200", 
      label: "Due today" 
    };
    if (days <= 3) return { 
      color: "text-amber-600 bg-amber-50 border-amber-200", 
      label: `${days} days left` 
    };
    if (days <= 7) return { 
      color: "text-blue-600 bg-blue-50 border-blue-200", 
      label: `${days} days left` 
    };
    return { 
      color: "text-gray-600 bg-gray-50 border-gray-200", 
      label: `${days} days left` 
    };
  };

  const statusConfig = getStatusConfig(project.status);
  const StatusIcon = statusConfig.icon;
  const daysUntilDeadline = project.deadline ? getDaysUntilDeadline(project.deadline) : null;
  const deadlineConfig = daysUntilDeadline !== null ? getDeadlineConfig(daysUntilDeadline) : null;

  const MAX_LENGTH = 120;
  const isLong = project.description && project.description.length > MAX_LENGTH;
  const visibleText = expanded
    ? project.description
    : project.description?.slice(0, MAX_LENGTH) + (isLong ? "..." : "");

  const handleCardClick = () => {
    if (project.permission === "full") {
      onViewApplicants(project.id);
    }
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete(project.id);
  };

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all duration-300 relative group shadow-sm"
      onClick={handleCardClick}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
            {project.title}
          </h3>
          
          {/* Status and Applied Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${statusConfig.color}`}
            >
              <StatusIcon size={12} />
              {statusConfig.label}
            </span>
            
            {project.applied === "true" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium border border-purple-200">
                <CheckCircle2 size={12} />
                Applied
              </span>
            )}
          </div>
        </div>

        {/* Action Menu - Fixed z-index issue */}
        {project.permission === "full" && (
          <div className="relative" ref={menuRef}>
            <button 
              className={`p-2 rounded-lg transition-all duration-200 ${
                menuOpen 
                  ? "bg-blue-50 border border-blue-200 text-blue-600" 
                  : "hover:bg-gray-50 border border-transparent hover:border-gray-200 text-gray-500"
              }`}
              onClick={handleMenuToggle}
            >
              <MoreVertical size={20} />
            </button>
            
            {/* Dropdown Menu with proper z-index */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white shadow-xl rounded-xl border border-gray-200 z-50">
                <button
                  className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-blue-50 text-gray-700 rounded-t-xl transition-colors border-b border-gray-100"
                  onClick={handleEdit}
                >
                  <Edit size={16} className="text-blue-600" />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">Edit Project</span>
                    <span className="text-xs text-gray-500">Modify details</span>
                  </div>
                </button>
                <button
                  className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-red-50 text-red-600 rounded-b-xl transition-colors"
                  onClick={handleDelete}
                >
                  <Trash2 size={16} />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">Delete Project</span>
                    <span className="text-xs text-red-500">Remove permanently</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Description with expandable feature */}
      <p className="text-gray-600 text-sm mb-4 flex-1 leading-relaxed">
        <div className="mb-4 p-3 bg-gray-100 rounded-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium  uppercase tracking-wide">Project Description : </span>
          </div>
        {visibleText}
        {isLong && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="ml-2 inline-flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200"
          >
            {expanded ? (
              <>
                Show less
                <ChevronUp size={14} />
              </>
            ) : (
              <>
                Read more
                <ChevronDown size={14} />
              </>
            )}
          </button>
        )}
        </div>
      </p>

      {/* Requirements Preview */}
      {project.requirements && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="" />
            <span className="text-xs font-medium  uppercase tracking-wide">Requirements</span>
          </div>
          <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">
            {project.requirements}
          </p>
        </div>
      )}

      {/* Footer Section */}
      <div className="space-y-3 pt-4 border-t bg-amber-50 border-gray-100">
        {/* Deadline Information */}
        {project.deadline && deadlineConfig && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm ">
              <Calendar size={16} className="text-gray-400" />
              <span className="font-medium">Deadline:</span>
              <span className="text-gray-700">
                
            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${deadlineConfig.color}`}>
              {deadlineConfig.label}
            </span>
              </span>
            </div>
          </div>
        )}

        {/* Created Date */}
        <div className="flex items-center gap-2 text-sm ">
          <Clock size={14} className="text-gray-400" />
          <span className="font-medium">Created:</span>
          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2 pt-2">
          {/* View Applicants for Full Permission */}
          {project.permission === "full" && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onViewApplicants(project.id);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg  transition-colors w-full justify-center font-medium"
            >
              <Users size={16} />
              View Applicants
            </button>
          )}

          {/* Student Actions */}
          {project.permission === "readonly" && (
            <>
            
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept(project.id);
                }}
                disabled={project.applied === "true"}
                className={`flex-1 px-4 py-2.5 rounded-lg transition-colors font-medium ${
                  project.applied === "true"
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200"
                    : "bg-black text-white"
                }`}
              >
               
                  <span className="flex items-center gap-2 justify-center">
                    <Sparkles size={16} />
                    Accept
                  </span>

                  
                
              </button>
              
            </>
          )}
        </div>
      </div>
    </div>
  );
}