import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Clock,
  Code,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import { Worker } from "@/types/worker";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { createConnectionRequest } from "@/lib/redux/slices/notoficationSlice";
import { useFormik } from "formik";
import { GetMe, selectMyProfile } from "@/lib/redux/slices/auth/auth.slice";

interface WorkerCardProps {
  worker: Worker;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: { firstName?: string; lastName?: string }) => {
    return `${name.firstName?.charAt(0) || ""} ${
      name.lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const skillsArray = worker?.skills ? worker.skills.split(", ") : [];
  const dispatch = useAppDispatch();
  const recruiterProfile = useAppSelector(selectMyProfile);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    dispatch(GetMe());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      recruiterId: recruiterProfile?.id || 0,
      workerId: worker.id,
      message:
        "Hello Admin, I would like to express interest in this candidate. Kindly facilitate the next steps of communication. Thank you.",
    },
    onSubmit: async (values) => {
      if (!values.recruiterId) return;
      
      setIsLoading(true);
      try {
        await dispatch(
          createConnectionRequest({
            ...values,
            recruiterId: Number(values.recruiterId),
          })
        );
      } catch (error) {
        console.error("Connection request error:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-orange-300">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="h-20 w-20 mr-4">
            <AvatarImage src={worker.user.avatar || undefined} />
            <AvatarFallback>
              {getInitials(worker.user)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 truncate">
              {worker.user?.firstName} {worker.user?.lastName}
            </CardTitle>
            <p className="text-sm text-gray-600 truncate">
              {worker.user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {worker.available ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">
                  Available
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600 font-medium">
                  Unavailable
                </span>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="text-sm text-gray-700">{worker.location}</span>
        </div>

        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-gray-700">{worker.experience}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Skills</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {skillsArray.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        {worker.resume && (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <a
              href={worker.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 underline truncate"
            >
              View Resume
            </a>
          </div>
        )}

        <div className="pt-2 border-t border-gray-100 space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Joined: {formatDate(worker.createdAt)}</span>
            </div>
          </div>
          {worker.updatedAt !== worker.createdAt && (
            <div className="text-xs text-gray-500">
              Updated: {formatDate(worker.updatedAt)}
            </div>
          )}
        </div>

        <button
          onClick={() => formik.handleSubmit()}
          disabled={isLoading}
          className="w-full mt-4 bg-orange-300 hover:bg-orange-400 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : "Contact Agency"}
        </button>
      </CardContent>
    </Card>
  );
};

export default WorkerCard;