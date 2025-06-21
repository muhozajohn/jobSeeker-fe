import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { userValidation as userSchema } from "@/utils/validation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Plus, User as UserIcon, Edit, Upload, X } from "lucide-react";
import { CreateUserDto,  UserRole } from "@/types/users";
import Toast from "./Toasty";

interface UserFormModalProps {
  user?: CreateUserDto;
  onSubmit: (values: CreateUserDto) => void;
  children?: React.ReactNode;
}

export function UserFormModal({
  user,
  onSubmit,
  children,
}: UserFormModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      email: user?.email || "",
      password: user?.password || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      avatar: user?.avatar || "",
      role: user?.role || "WORKER",
      isActive: user?.isActive ?? true,
    },
    validationSchema: userSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log("submitted Value", values);
      setIsLoading(true);
      try {
  
        await onSubmit(values);

        // Close modal on success
        setOpen(false);
      } catch (error) {
        console.error("Error submitting form:", error);
        Toast({
          message: "Failed to submit form. Please try again.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
      setAvatarFile(null);
      setAvatarPreview("");
      if (user) {
        formik.setValues({
          email: user.email,
          password: user?.password || "",
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone || "",
          avatar: user.avatar || "",
          role: user.role || "",
          isActive: user.isActive ?? true,
        });
        setAvatarPreview(user.avatar || "");
      }
    }
  }, [open, user]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Toast({ message: "File size must be less than 5MB", type: "error" });
        return;
      }

      setAvatarFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(user?.avatar || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getAvatarFallback = () => {
    return `${formik.values.firstName?.[0] || ""}${
      formik.values.lastName?.[0] || ""
    }`;
  };

  const getAvatarSource = () => {
    if (avatarPreview) return avatarPreview;
    if (formik.values.avatar) return formik.values.avatar;
    return "";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" variant={user ? "outline" : "default"}>
            {user ? (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Create New User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={getAvatarSource()} />
                <AvatarFallback>
                  {getAvatarFallback() || <UserIcon className="h-12 w-12" />}
                </AvatarFallback>
              </Avatar>
              {(avatarFile || avatarPreview) && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={handleRemoveAvatar}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="w-full space-y-2">
              <Label>Avatar</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {avatarFile ? "Change Image" : "Upload Image"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                //   accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              {avatarFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {avatarFile.name}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.firstName}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="user@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="+1234567890"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.phone}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={formik.values.role}
                onValueChange={(value) =>
                  formik.setFieldValue("role", value as UserRole)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WORKER">Worker</SelectItem>
                  <SelectItem value="RECRUITER">Recruiter</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.role && formik.errors.role && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.role}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="isActive">Account Status</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {formik.values.isActive ? "Active" : "Inactive"}
                </span>
                <Switch
                  id="isActive"
                  checked={formik.values.isActive}
                  onCheckedChange={(checked) =>
                    formik.setFieldValue("isActive", checked)
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {user ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
