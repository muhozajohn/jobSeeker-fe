import * as Yup from "yup";

// Helper validation constants
const PASSWORD_MIN_LENGTH = 6;
const NAME_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{3,6}$/im;
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

// User validations
export const userValidation = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`),
  firstName: Yup.string()
    .required("First name is required")
    .max(NAME_MAX_LENGTH, `First name must be ${NAME_MAX_LENGTH} characters or less`),
  lastName: Yup.string()
    .required("Last name is required")
    .max(NAME_MAX_LENGTH, `Last name must be ${NAME_MAX_LENGTH} characters or less`),
  phone: Yup.string()
    .matches(PHONE_REGEX, "Invalid phone number")
    .nullable(),
  avatar: Yup.string()
    .matches(URL_REGEX, "Invalid URL format")
    .nullable(),
  role: Yup.string()
    .required("Role is required")
    .oneOf(['ADMIN', 'RECRUITER', 'WORKER'], "Invalid role"),
  isActive: Yup.boolean()
});

// Recruiter validations
export const recruiterValidation = Yup.object().shape({
  companyName: Yup.string(),
  type: Yup.string()
    .required("Recruiter type is required")
    .oneOf(['COMPANY', 'GROUP', 'INDIVIDUAL'], "Invalid recruiter type"),
  description: Yup.string()
    .max(DESCRIPTION_MAX_LENGTH, `Description must be ${DESCRIPTION_MAX_LENGTH} characters or less`)
    .nullable(),
  location: Yup.string().nullable(),
  website: Yup.string()
    .matches(URL_REGEX, "Invalid URL format")
    .nullable(),
  verified: Yup.boolean()
});

// Worker validations
export const workerValidation = Yup.object().shape({
  location: Yup.string().nullable(),
  experience: Yup.string().nullable(),
  skills: Yup.string().nullable(),
  resume: Yup.string()
    .matches(URL_REGEX, "Invalid URL format")
    .nullable(),
  available: Yup.boolean()
});

// Job Category validations
export const jobCategoryValidation = Yup.object().shape({
  name: Yup.string()
    .required("Category name is required")
    .max(NAME_MAX_LENGTH, `Name must be ${NAME_MAX_LENGTH} characters or less`),
  description: Yup.string()
    .max(DESCRIPTION_MAX_LENGTH, `Description must be ${DESCRIPTION_MAX_LENGTH} characters or less`)
    .nullable()
});

// Job validations
export const jobValidation = Yup.object().shape({
  title: Yup.string()
    .required("Job title is required")
    .max(NAME_MAX_LENGTH, `Title must be ${NAME_MAX_LENGTH} characters or less`),
  description: Yup.string()
    .required("Job description is required"),
  location: Yup.string().nullable(),
  salary: Yup.number()
    .positive("Salary must be positive")
    .integer("Salary must be an integer")
    .nullable(),
  salaryType: Yup.string()
    .oneOf(['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'], "Invalid salary type")
    .nullable(),
  requirements: Yup.string().nullable(),
  workingHours: Yup.string().nullable(),
  isActive: Yup.boolean(),
  allowMultiple: Yup.boolean(),
  categoryId: Yup.number()
    .required("Category is required")
    .positive("Invalid category")
    .integer("Invalid category")
});

// Application validations
export const applicationValidation = Yup.object().shape({
  message: Yup.string().nullable(),
  status: Yup.string()
    .oneOf(['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'], "Invalid application status"),
  jobId: Yup.number()
    .required("Job is required")
    .positive("Invalid job")
    .integer("Invalid job"),
  workerId: Yup.number()
    .required("Worker is required")
    .positive("Invalid worker")
    .integer("Invalid worker")
});

// Work Assignment validations
export const workAssignmentValidation = Yup.object().shape({
  startTime: Yup.date().nullable(),
  endTime: Yup.date()
    .nullable()
    .when('startTime', (startTime, schema) => {
      return startTime 
        ? schema.min(startTime, "End time must be after start time")
        : schema;
    }),
  workDate: Yup.date()
    .required("Work date is required"),
  status: Yup.string()
    .required("Status is required")
    .oneOf(['ACTIVE', 'COMPLETED', 'CANCELLED', 'PAUSED'], "Invalid assignment status"),
  notes: Yup.string().nullable(),
  jobId: Yup.number()
    .required("Job is required")
    .positive("Invalid job")
    .integer("Invalid job"),
  workerId: Yup.number()
    .required("Worker is required")
    .positive("Invalid worker")
    .integer("Invalid worker"),
  recruiterId: Yup.number()
    .required("Recruiter is required")
    .positive("Invalid recruiter")
    .integer("Invalid recruiter")
});

// Login validation (updated to match User model)
export const loginValidation = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
});