import { toast, ToastOptions } from "react-toastify";

// Toast configuration for different types with responsive design
export const toastConfig: Record<"success" | "error" | "info", ToastOptions> = {
  success: {
    className:
      "bg-green-500 text-white font-bold text-sm sm:text-base lg:text-lg rounded-lg shadow-md p-4 sm:p-6", // Responsive font size and padding
    closeButton: true,
    hideProgressBar: true,
    autoClose: 3000,
  },
  error: {
    className:
      "bg-red-500 text-white font-bold text-sm sm:text-base lg:text-lg rounded-lg shadow-md p-4 sm:p-6", // Responsive font size and padding
    closeButton: true,
    hideProgressBar: true,
    autoClose: 2000,
  },
  info: {
    className:
      "bg-blue-500 text-white font-bold text-sm sm:text-base lg:text-lg rounded-lg shadow-md p-4 sm:p-6", // Responsive font size and padding
    closeButton: true,
    hideProgressBar: true,
    autoClose: 3000,
  },
};

// Utility function to display toast notifications
export const showToast = (type: "success" | "error" | "info", message: string) => {
  toast[type](message, toastConfig[type]);
};
