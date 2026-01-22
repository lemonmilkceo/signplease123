import { useState, useCallback, useMemo } from "react";

type ValidationRule<T> = {
  validate: (value: T) => boolean;
  message: string;
};

type FieldConfig<T> = {
  initialValue: T;
  rules?: ValidationRule<T>[];
};

type FormConfig = {
  [key: string]: FieldConfig<unknown>;
};

type FormState<T extends FormConfig> = {
  [K in keyof T]: T[K]["initialValue"];
};

type FormErrors<T extends FormConfig> = {
  [K in keyof T]?: string;
};

type FormTouched<T extends FormConfig> = {
  [K in keyof T]?: boolean;
};

interface UseFormValidationReturn<T extends FormConfig> {
  values: FormState<T>;
  errors: FormErrors<T>;
  touched: FormTouched<T>;
  isValid: boolean;
  isDirty: boolean;
  setValue: <K extends keyof T>(field: K, value: T[K]["initialValue"]) => void;
  setTouched: <K extends keyof T>(field: K) => void;
  validateField: <K extends keyof T>(field: K) => string | undefined;
  validateAll: () => boolean;
  reset: () => void;
  getFieldProps: <K extends keyof T>(field: K) => {
    value: T[K]["initialValue"];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onBlur: () => void;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
  };
}

/**
 * 폼 검증 및 상태 관리를 위한 커스텀 훅
 * 
 * @example
 * const form = useFormValidation({
 *   email: {
 *     initialValue: "",
 *     rules: [
 *       { validate: (v) => v.length > 0, message: "이메일을 입력해주세요" },
 *       { validate: (v) => /\S+@\S+\.\S+/.test(v), message: "올바른 이메일 형식이 아닙니다" },
 *     ],
 *   },
 *   password: {
 *     initialValue: "",
 *     rules: [
 *       { validate: (v) => v.length >= 6, message: "비밀번호는 6자 이상이어야 합니다" },
 *     ],
 *   },
 * });
 */
export function useFormValidation<T extends FormConfig>(
  config: T
): UseFormValidationReturn<T> {
  // 초기값 계산
  const initialValues = useMemo(() => {
    const values = {} as FormState<T>;
    for (const key in config) {
      values[key as keyof T] = config[key].initialValue as FormState<T>[keyof T];
    }
    return values;
  }, [config]);

  const [values, setValues] = useState<FormState<T>>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouchedState] = useState<FormTouched<T>>({});

  // 필드 검증
  const validateField = useCallback(
    <K extends keyof T>(field: K): string | undefined => {
      const fieldConfig = config[field as string];
      const value = values[field];

      if (fieldConfig.rules) {
        for (const rule of fieldConfig.rules) {
          if (!rule.validate(value as unknown)) {
            return rule.message;
          }
        }
      }
      return undefined;
    },
    [config, values]
  );

  // 값 설정
  const setValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]["initialValue"]) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      // 실시간 검증 (터치된 필드만)
      if (touched[field]) {
        const fieldConfig = config[field as string];
        if (fieldConfig.rules) {
          for (const rule of fieldConfig.rules) {
            if (!rule.validate(value as unknown)) {
              setErrors((prev) => ({ ...prev, [field]: rule.message }));
              return;
            }
          }
        }
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [config, touched]
  );

  // 터치 설정
  const setTouched = useCallback(
    <K extends keyof T>(field: K) => {
      setTouchedState((prev) => ({ ...prev, [field]: true }));

      // 터치 시 검증
      const error = validateField(field);
      if (error) {
        setErrors((prev) => ({ ...prev, [field]: error }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [validateField]
  );

  // 전체 검증
  const validateAll = useCallback((): boolean => {
    const newErrors: FormErrors<T> = {};
    const newTouched: FormTouched<T> = {};
    let isValid = true;

    for (const key in config) {
      newTouched[key as keyof T] = true;
      const error = validateField(key as keyof T);
      if (error) {
        newErrors[key as keyof T] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    setTouchedState(newTouched);
    return isValid;
  }, [config, validateField]);

  // 폼 리셋
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouchedState({});
  }, [initialValues]);

  // 유효성 상태
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // 변경 여부
  const isDirty = useMemo(() => {
    for (const key in config) {
      if (values[key as keyof T] !== initialValues[key as keyof T]) {
        return true;
      }
    }
    return false;
  }, [config, values, initialValues]);

  // 필드 props 헬퍼
  const getFieldProps = useCallback(
    <K extends keyof T>(field: K) => {
      const hasError = touched[field] && errors[field];
      return {
        value: values[field],
        onChange: (
          e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
        ) => {
          setValue(field, e.target.value as T[K]["initialValue"]);
        },
        onBlur: () => setTouched(field),
        ...(hasError && {
          "aria-invalid": true,
          "aria-describedby": `${String(field)}-error`,
        }),
      };
    },
    [values, errors, touched, setValue, setTouched]
  );

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    setValue,
    setTouched,
    validateField,
    validateAll,
    reset,
    getFieldProps,
  };
}

// 자주 사용되는 검증 규칙들
export const validationRules = {
  required: (message = "필수 입력 항목입니다"): ValidationRule<string> => ({
    validate: (v) => v.trim().length > 0,
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validate: (v) => v.length >= min,
    message: message || `최소 ${min}자 이상 입력해주세요`,
  }),

  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validate: (v) => v.length <= max,
    message: message || `최대 ${max}자까지 입력 가능합니다`,
  }),

  email: (message = "올바른 이메일 형식이 아닙니다"): ValidationRule<string> => ({
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message,
  }),

  phone: (message = "올바른 전화번호 형식이 아닙니다"): ValidationRule<string> => ({
    validate: (v) => /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/.test(v.replace(/-/g, "")),
    message,
  }),

  minNumber: (min: number, message?: string): ValidationRule<number> => ({
    validate: (v) => v >= min,
    message: message || `${min.toLocaleString()} 이상이어야 합니다`,
  }),

  maxNumber: (max: number, message?: string): ValidationRule<number> => ({
    validate: (v) => v <= max,
    message: message || `${max.toLocaleString()} 이하여야 합니다`,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule<string> => ({
    validate: (v) => regex.test(v),
    message,
  }),
};
