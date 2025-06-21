import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JobCategory } from "@/types/JobCategories";

interface JobCategoryFormValues {
  name: string;
  description: string;
}

interface JobCategoryModalProps {
  onSuccess: (values: JobCategoryFormValues, id?: number) => void;
  children?: React.ReactNode;
  category?: JobCategory | null;
  mode?: "create" | "edit";
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
});

export const JobCategoryModal: React.FC<JobCategoryModalProps> = ({ 
  onSuccess, 
  children, 
  category,
  mode = "create"
}) => {
  const [open, setOpen] = React.useState(false);

  const formik = useFormik<JobCategoryFormValues>({
    initialValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (mode === "edit" && category) {
        onSuccess(values, category.id);
      } else {
        onSuccess(values);
      }
      setOpen(false);
    },
    enableReinitialize: true,
  });

  React.useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? children : (
          <Button variant="outline">
            {mode === "edit" ? "Edit Category" : "Create Job Category"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Job Category" : "Create Job Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-sm text-red-500">{formik.errors.name}</div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
            />
            {formik.touched.description && formik.errors.description ? (
              <div className="text-sm text-red-500">{formik.errors.description}</div>
            ) : null}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === "edit" ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};