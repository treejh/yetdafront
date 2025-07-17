import { useState } from "react";

export interface PurchaseOption {
  providingMethod: "DOWNLOAD" | "EMAIL";
  title: string;
  content: string;
  price: number;
  optionStatus: "AVAILABLE" | "UNAVAILABLE";
  fileIdentifier?: string;
}

export const usePurchaseOptions = () => {
  const [purchaseOptions, setPurchaseOptions] = useState<PurchaseOption[]>([
    {
      providingMethod: "DOWNLOAD",
      title: "",
      content: "",
      price: 0,
      optionStatus: "AVAILABLE",
    },
  ]);

  const addOption = () => {
    const newOption: PurchaseOption = {
      providingMethod: "DOWNLOAD",
      title: "",
      content: "",
      price: 0,
      optionStatus: "AVAILABLE",
    };
    setPurchaseOptions((prev) => [...prev, newOption]);
  };

  const removeOption = (index: number) => {
    if (purchaseOptions.length > 1) {
      setPurchaseOptions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateOption = (
    index: number,
    field: keyof PurchaseOption,
    value: string | number
  ) => {
    setPurchaseOptions((prev) =>
      prev.map((option, i) =>
        i === index
          ? {
              ...option,
              [field]: field === "price" ? Number(value) : value,
            }
          : option
      )
    );
  };

  const resetOptions = () => {
    setPurchaseOptions([
      {
        providingMethod: "DOWNLOAD",
        title: "",
        content: "",
        price: 0,
        optionStatus: "AVAILABLE",
      },
    ]);
  };

  return {
    purchaseOptions,
    addOption,
    removeOption,
    updateOption,
    resetOptions,
    setPurchaseOptions,
  };
};
