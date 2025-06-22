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
import { CreateUserDto, UpdateUserDto, UserRole } from "@/types/users";
import Toast from "./Toasty";

interface UserFormModalProps {
  user?: UpdateUserDto & { id?: number };
  onSubmit: (values: CreateUserDto | UpdateUserDto, avatar?: File) => Promise<void>;
  children?: React.ReactNode;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export function UserFormModal({
  user,
  onSubmit,
  children,
  isLoading: externalLoading = false,
  mode = user ? "edit" : "create",
}: UserFormModalProps) {
  const [open, setOpen] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLoading = externalLoading || internalLoading;

  const formik = useFormik({
    initialValues: {
      email: user?.email || "",
      password: "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      avatar: user?.avatar || "",
      role: (user && "role" in user ? (user.role as UserRole) : "WORKER") || "WORKER",
    },
    validationSchema: userSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setInternalLoading(true);
      try {
        // Prepare the user data
        const baseUserData = {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          role: values.role,
        };

        let userData: CreateUserDto | UpdateUserDto;

        if (mode === "edit" && user?.id) {
          userData = {
            ...baseUserData,
            ...(values.password && { password: values.password }),
            avatar: avatarRemoved && !avatarFile ? "" : values.avatar
          } as UpdateUserDto;
        } else {
          userData = {
            ...baseUserData,
            password: values.password, 
            avatar: values.avatar,
          } as CreateUserDto;
        }

        await onSubmit(userData, avatarFile || undefined);
        
        // Only close and reset if successful
        setOpen(false);
        resetFormState();
      } catch (error) {
        console.error("Error submitting form:", error);
        Toast({
          message: "Failed to submit form. Please try again.",
          type: "error",
        });
      } finally {
        setInternalLoading(false);
      }
    },
  });

  const resetFormState = () => {
    formik.resetForm();
    setAvatarFile(null);
    setAvatarPreview("");
    setAvatarRemoved(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!open) {
      resetFormState();
      if (user) {
        formik.setValues({
          email: user.email || "",
          password: "", 
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phone: user.phone || "",
          avatar: user.avatar || "",
          role: (user && "role" in user ? (user.role as UserRole) : "WORKER") || "WORKER",
        });
        setAvatarPreview(user.avatar || "");
      }
    }
  }, [open, user]);

  const validateFile = (file: File): boolean => {
    if (file.size > 5 * 1024 * 1024) {
      Toast({ message: "File size must be less than 5MB", type: "error" });
      return false;
    }
    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      setAvatarFile(file);
      setAvatarRemoved(false);

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        formik.setFieldValue("avatar", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    setAvatarRemoved(true);
    formik.setFieldValue("avatar", "");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getAvatarFallback = () => {
    const firstInitial = formik.values.firstName?.[0]?.toUpperCase() || "";
    const lastInitial = formik.values.lastName?.[0]?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}`;
  };

  const getAvatarSource = () => {
    if (avatarPreview && !avatarRemoved) return avatarPreview;
    if (formik.values.avatar && !avatarRemoved) return formik.values.avatar;
    return "";
  };

  const hasAvatarContent = () => {
    return avatarFile || (avatarPreview && !avatarRemoved) || (formik.values.avatar && !avatarRemoved);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" variant={mode === "edit" ? "outline" : "default"}>
            {mode === "edit" ? (
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit User" : "Create New User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={getAvatarSource()} alt="User avatar" />
                <AvatarFallback className="text-lg">
                  {getAvatarFallback() || <UserIcon className="h-12 w-12" />}
                </AvatarFallback>
              </Avatar>
              {hasAvatarContent() && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={handleRemoveAvatar}
                  disabled={isLoading}
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
                  disabled={isLoading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {avatarFile ? "Change Image" : "Upload Image"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
              {avatarFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {avatarFile.name} ({(avatarFile.size / 1024 / 1024).toFixed(2)}MB)
                </p>
              )}
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.firstName}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="user@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading || mode === "edit"}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password Field - Only required for create, optional for edit */}
          <div>
            <Label htmlFor="password">
              {mode === "create" ? "Password *" : "New Password"}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={mode === "create" ? "Enter password" : "Leave blank to keep current"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="+1234567890"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.phone}</p>
            )}
          </div>

          {/* Role and Status Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formik.values.role}
                onValueChange={(value) =>
                  formik.setFieldValue("role", value as UserRole)
                }
                disabled={isLoading || mode === "edit"}
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

            {/* <div className="flex items-center justify-between pt-2">
              <Label htmlFor="isActive">Account Status</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {formik.values.isActive ? "Active" : "Inactive"}
                </span>
                <Switch
                  id="isActive"
                  checked={Boolean(formik.values.isActive)}
                  onCheckedChange={(checked) =>
                    formik.setFieldValue("isActive", Boolean(checked))
                  }
                  disabled={isLoading}
                />
              </div>
            </div> */}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === "edit" ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}