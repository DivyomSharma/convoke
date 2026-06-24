import { useState } from "react";

export type FieldError = {
  field: string;
  message: string;
};

export function useFormValidation() {
  const [errors, setErrors] = useState<FieldError[]>([]);

  const validate = (fields: { field: string; value: unknown; message: string; condition?: boolean }[]) => {
    const newErrors: FieldError[] = [];
    
    for (const f of fields) {
      if (f.condition !== undefined ? !f.condition : !f.value) {
        newErrors.push({ field: f.field, message: f.message });
      }
    }

    setErrors(newErrors);

    if (newErrors.length > 0) {
      // Focus and scroll to first invalid field
      const firstErrorField = document.getElementById(newErrors[0].field);
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        firstErrorField.focus();
      }
      return false;
    }

    return true;
  };

  const getError = (field: string) => {
    return errors.find((e) => e.field === field)?.message;
  };

  return { errors, setErrors, validate, getError };
}
