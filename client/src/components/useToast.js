import { useState } from "react";

export default function useToast() {
  const [toast, setToast] = useState({
    message: "",
    type: "info",
  });

  const showToast = (message, type = "info") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast({ message: "", type });
    }, 3000);
  };

  return { toast, showToast };
}
