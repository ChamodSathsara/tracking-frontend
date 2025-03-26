import { Package } from "lucide-react";

export function CarrierLogo({ carrier, size = "md" }) {
  const getCarrierStyles = () => {
    switch (carrier) {
      case "FedEx":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "DHL":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const sizeClasses = size === "sm" ? "h-6 w-6 text-xs" : "h-8 w-8 text-sm";

  return (
    <div
      className={`flex items-center justify-center rounded-full ${sizeClasses} ${getCarrierStyles()}`}
    >
      {carrier === "FedEx" ? (
        "FX"
      ) : carrier === "DHL" ? (
        "DH"
      ) : (
        <Package className="h-3 w-3" />
      )}
    </div>
  );
}
