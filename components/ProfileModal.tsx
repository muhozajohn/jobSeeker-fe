import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const ProfileSchema = Yup.object().shape({
  location: Yup.string().required("Location is required"),
  experience: Yup.string().required("Experience is required"),
  skills: Yup.string().required("Skills are required"),
  resume: Yup.string()
    .url("Must be a valid URL")
    .required("Resume link is required"),
  available: Yup.boolean(),
  userId: Yup.number(),
});

import { createWorker } from "@/lib/redux/slices/worker/workerSlice";
import { useAppDispatch } from "@/lib/hooks/hooks";
import { CreateOrUpdateWorkerDto } from "@/types/worker";
interface ProfileModalProps {
  userId: number;
}

export default function ProfileModal({ userId }: ProfileModalProps) {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (values: CreateOrUpdateWorkerDto , { resetForm }: { resetForm: () => void }) => {
    try {
      await dispatch(
        createWorker({
          ...values,
          userId: userId,
        })
      ).unwrap(); 
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating worker:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Complete Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            location: "",
            experience: "",
            skills: "",
            resume: "",
            userId,
            available: true,
          }}
          validationSchema={ProfileSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={values.location}
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="location"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  name="experience"
                  value={values.experience}
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="experience"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  value={values.skills}
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="skills"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="resume">Resume URL</Label>
                <Input
                  id="resume"
                  name="resume"
                  value={values.resume}
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="resume"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="available"
                  checked={values.available}
                  onCheckedChange={(checked) =>
                    setFieldValue("available", checked)
                  }
                />
                <Label htmlFor="available">Available for work</Label>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}