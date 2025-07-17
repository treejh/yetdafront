import { useState } from "react";

export interface PurchaseOption {
  providingMethod: "DOWNLOAD" | "EMAIL";
  title: string;
  content: string;
  price: number;
  optionStatus: "AVAILABLE" | "UNAVAILABLE";
  fileIdentifier?: string;
}

export interface ProjectFormData {
  projectType: "PURCHASE";
  title: string;
  introduce: string;
  content: string;
  field: string;
  pricingPlanId: number;
  purchaseDetail: {
    gitAddress: string;
    purchaseCategoryId: number;
    getAverageDeliveryTime: string;
    purchaseOptionList: PurchaseOption[];
  };
}

const initialFormData: ProjectFormData = {
  projectType: "PURCHASE",
  title: "",
  introduce: "",
  content: "",
  field: "",
  pricingPlanId: 1,
  purchaseDetail: {
    gitAddress: "",
    purchaseCategoryId: 1,
    getAverageDeliveryTime: "",
    purchaseOptionList: [
      {
        providingMethod: "DOWNLOAD",
        title: "",
        content: "",
        price: 0,
        optionStatus: "AVAILABLE",
      },
    ],
  },
};

export const useProjectForm = () => {
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("purchaseDetail.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        purchaseDetail: {
          ...prev.purchaseDetail,
          [field]: field === "purchaseCategoryId" ? Number(value) : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "pricingPlanId" ? Number(value) : value,
      }));
    }
  };

  const handleOptionChange = (
    index: number,
    field: keyof PurchaseOption,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      purchaseDetail: {
        ...prev.purchaseDetail,
        purchaseOptionList: prev.purchaseDetail.purchaseOptionList.map(
          (option, i) =>
            i === index
              ? {
                  ...option,
                  [field]: field === "price" ? Number(value) : value,
                }
              : option
        ),
      },
    }));
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      purchaseDetail: {
        ...prev.purchaseDetail,
        purchaseOptionList: [
          ...prev.purchaseDetail.purchaseOptionList,
          {
            providingMethod: "DOWNLOAD",
            title: "",
            content: "",
            price: 0,
            optionStatus: "AVAILABLE",
          },
        ],
      },
    }));
  };

  const removeOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      purchaseDetail: {
        ...prev.purchaseDetail,
        purchaseOptionList: prev.purchaseDetail.purchaseOptionList.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const updateFileIdentifiers = (files: File[]) => {
    const updatedOptions = [...formData.purchaseDetail.purchaseOptionList];
    files.forEach((file, index) => {
      if (updatedOptions[index]) {
        updatedOptions[index].fileIdentifier = file.name;
      }
    });

    setFormData((prev) => ({
      ...prev,
      purchaseDetail: {
        ...prev.purchaseDetail,
        purchaseOptionList: updatedOptions,
      },
    }));
  };

  return {
    formData,
    handleInputChange,
    handleOptionChange,
    addOption,
    removeOption,
    updateFileIdentifiers,
  };
};
