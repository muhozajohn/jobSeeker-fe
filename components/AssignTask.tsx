import React, { useEffect, useState } from "react";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { User, Clock, Calendar, FileText, CheckCircle } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/hooks";
import { createWorkAssignment } from "@/lib/redux/slices/assignments/assignmentSlice";
import { GetMe, selectMyProfile } from "@/lib/redux/slices/auth/auth.slice";
import {
  selectConnectionRequests,
  getConnectionRequests,
} from "@/lib/redux/slices/notoficationSlice";
import { WorkAssignmentStatus } from "@/types/workerAssignment/assignment";
import { ConnectionRequest } from "@/types/notification";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type StatusOption = "ACTIVE" | "PENDING" | "COMPLETED" | "CANCELLED";

interface FormValues {
  startTime: string;
  endTime: string;
  workDate: string;
  status: StatusOption;
  notes: string;
  jobId: number;
  workerId: number | "";
  recruiterId: number;
}

interface CustomFieldProps {
  name: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  type?: string;
  placeholder?: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  touched?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const statusOptions: { value: StatusOption; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING", label: "Pending" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const validationSchema = Yup.object({
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string()
    .required("End time is required")
    .test("is-after-start", "End time must be after start time", function (value) {
      const { startTime } = this.parent;
      return !startTime || !value || value > startTime;
    }),
  workDate: Yup.date()
    .required("Work date is required")
    .min(new Date(new Date().setHours(0, 0, 0, 0)), "Work date cannot be in the past")
    .transform((originalValue) => {
      return originalValue ? new Date(originalValue) : null;
    }),
  status: Yup.string()
    .oneOf(["ACTIVE", "PENDING", "COMPLETED", "CANCELLED"])
    .required("Status is required"),
  notes: Yup.string(),
  workerId: Yup.number()
    .positive("Worker is required")
    .required("Worker is required"),
  jobId: Yup.number().required(),
  recruiterId: Yup.number().required(),
});

const CustomField: React.FC<CustomFieldProps> = ({
  name,
  label,
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  touched,
  children,
  className = "",
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="text-sm font-medium text-gray-900 flex items-center gap-2">
      <Icon className="h-4 w-4" />
      {label}
    </label>
    <div className={`w-full ${touched && error ? "border-red-500" : ""}`}>
      {children ? (
        React.cloneElement(children as React.ReactElement, {
          ...(React.isValidElement(children) && typeof (children as any).type === "string"
            ? {
                id: name,
                value: value,
                onChange: (e: any) => onChange(e.target.value),
                className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  touched && error ? "border-red-500" : "border-gray-300"
                } ${className}`,
              }
            : {}),
        })
      ) : (
        <input
          id={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
            touched && error ? "border-red-500" : "border-gray-300"
          } ${className}`}
        />
      )}
    </div>
    {touched && error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

const AssignTaskModal: React.FC<{ 
  jobId: number; 
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}> = ({ jobId, trigger, open, onOpenChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const myProfile = useAppSelector(selectMyProfile);
  const connections = useAppSelector(selectConnectionRequests) || [];
  const recruiterData = connections.find(conn => conn.recruiter.userId === myProfile?.id);

  useEffect(() => {
    dispatch(GetMe());
    dispatch(getConnectionRequests());
  }, [dispatch]);

  const initialValues: FormValues = {
    startTime: "",
    endTime: "",
    workDate: "",
    status: "ACTIVE",
    notes: "",
    jobId,
    workerId: "",
    recruiterId: recruiterData?.recruiterId || 0,
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    setIsLoading(true);
    try {
      const submissionData = {
        ...values,
        startTime: new Date(`${values.workDate}T${values.startTime}:00Z`).toISOString(),
        endTime: new Date(`${values.workDate}T${values.endTime}:00Z`).toISOString(),
        workDate: new Date(`${values.workDate}T00:00:00Z`).toISOString(),
        workerId: Number(values.workerId),
        status: values.status as WorkAssignmentStatus,
      };

      await dispatch(createWorkAssignment(submissionData));
      resetForm();
      // Close modal after successful submission
      const modalOpen = open !== undefined ? open : isOpen;
      if (onOpenChange) {
        onOpenChange(false);
      } else {
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Error assigning task. Please try again.");
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const modalOpen = open !== undefined ? open : isOpen;
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setIsOpen(newOpen);
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-orange-400 hover:orange-500">
            Assign Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-orange-400" />
            Assign Task to Worker
          </DialogTitle>
          <DialogDescription>
            Fill out the details to assign a task to a worker
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched, isSubmitting, handleSubmit: formikSubmit }) => (
              <div className="space-y-4">
                {/* Worker Selection */}
                <CustomField 
                  name="workerId" 
                  label="Worker" 
                  icon={User}
                  value={values.workerId}
                  onChange={(value) => setFieldValue("workerId", Number(value) || "")}
                  error={errors.workerId}
                  touched={touched.workerId}
                >
                  <select>
                    <option value="">Select a worker</option>
                    {connections.map((connection: ConnectionRequest) => (
                      <option key={connection.id} value={connection.worker.id}>
                        {connection.worker.user.firstName} {connection.worker.user.lastName}
                      </option>
                    ))}
                  </select>
                </CustomField>

                {/* Work Date */}
                <CustomField
                  name="workDate"
                  label="Work Date"
                  icon={Calendar}
                  type="date"
                  value={values.workDate}
                  onChange={(value) => setFieldValue("workDate", value)}
                  error={errors.workDate}
                  touched={touched.workDate}
                  className="min-date"
                >
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </CustomField>
                {values.workDate && (
                  <p className="text-sm text-gray-600">{formatDate(values.workDate)}</p>
                )}

                {/* Time Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <CustomField
                    name="startTime"
                    label="Start Time"
                    icon={Clock}
                    type="time"
                    value={values.startTime}
                    onChange={(value) => setFieldValue("startTime", value)}
                    error={errors.startTime}
                    touched={touched.startTime}
                  />
                  <CustomField
                    name="endTime"
                    label="End Time"
                    icon={Clock}
                    type="time"
                    value={values.endTime}
                    onChange={(value) => setFieldValue("endTime", value)}
                    error={errors.endTime}
                    touched={touched.endTime}
                  />
                </div>

                {/* Status */}
                <CustomField 
                  name="status" 
                  label="Status" 
                  icon={CheckCircle}
                  value={values.status}
                  onChange={(value) => setFieldValue("status", value)}
                  error={errors.status}
                  touched={touched.status}
                >
                  <select>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </CustomField>

                {/* Notes */}
                <CustomField 
                  name="notes" 
                  label="Notes" 
                  icon={FileText}
                  value={values.notes}
                  onChange={(value) => setFieldValue("notes", value)}
                  error={errors.notes}
                  touched={touched.notes}
                >
                  <textarea
                    placeholder="Additional instructions..."
                    rows={4}
                    className="resize-none"
                  />
                </CustomField>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                    disabled={isLoading || isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => formikSubmit()}
                    disabled={isLoading || isSubmitting}
                    className="bg-orange-400 hover:orange-500"
                  >
                    {isLoading || isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Assigning...
                      </span>
                    ) : (
                      "Assign Task"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Formik>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTaskModal;