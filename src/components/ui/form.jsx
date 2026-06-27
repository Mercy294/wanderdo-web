import { forwardRef, createContext, useContext, useId } from "react";
import { Slot } from "@radix-ui/react-slot";
import { Controller, FormProvider, useFormContext } from "react-hook-form";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ── Contexts ──────────────────────────────────────────────────────────────────

const FormFieldContext = createContext({});
const FormItemContext = createContext({});

// ── Form (root) ───────────────────────────────────────────────────────────────

const Form = FormProvider;

// ── FormField ─────────────────────────────────────────────────────────────────

function FormField(props) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

// ── useFormField ──────────────────────────────────────────────────────────────

function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext.name) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

// ── FormItem ──────────────────────────────────────────────────────────────────

const FormItem = forwardRef(({ className, ...props }, ref) => {
  const id = useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2 mb-4", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

// ── FormLabel ─────────────────────────────────────────────────────────────────

const FormLabel = forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return (
    <label
      ref={ref}
      htmlFor={formItemId}
      className={cn(
        "text-sm font-medium mb-1",
        error && "text-red-500",
        className,
      )}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

// ── FormControl ───────────────────────────────────────────────────────────────
// Slot is kept: it merges refs and props onto the child input without adding
// a DOM wrapper, which is necessary for aria-describedby / aria-invalid to
// land on the actual input element.

const FormControl = forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();
  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

// ── FormDescription ───────────────────────────────────────────────────────────

const FormDescription = forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-gray-400 mt-1", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

// ── FormMessage ───────────────────────────────────────────────────────────────

const FormMessage = forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) return null;

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-red-500 mt-1", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
