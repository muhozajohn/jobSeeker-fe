import { FormikProps } from "formik";
import { get } from "lodash";

interface FormErrorProps<T> {
  formik: FormikProps<T>;
  name: string;
}

export const FormError = <T extends Record<string, any>>({
  formik,
  name,
}: FormErrorProps<T>) => {
  const error = get(formik.errors, name);
  const touched = get(formik.touched, name);

  return touched && error ? (
    <p className="text-red-500 text-xs mt-1">{error as string}</p>
  ) : null;
};