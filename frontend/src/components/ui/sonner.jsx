import { Toaster as Sonner } from "sonner";

/**
 * Toast notification component using Sonner
 * Styled for luxury resort aesthetic
 */
const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-sand-900 group-[.toaster]:border-sand-200 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-sand-600",
          actionButton: "group-[.toast]:bg-sand-900 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-sand-100 group-[.toast]:text-sand-600",
          success:
            "group-[.toaster]:border-green-200 group-[.toaster]:bg-green-50",
          error: "group-[.toaster]:border-red-200 group-[.toaster]:bg-red-50",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
