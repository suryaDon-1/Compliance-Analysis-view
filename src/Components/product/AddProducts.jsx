

import {useState, useEffect, useRef} from "react";
import {toast} from "react-toastify";
import api from "../../api/api.js";

import {
  UploadCloud,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const EMPTY_FORM = {
  productName: "",
  productcode: "",
  description: "",
  productType: "",
  company: "",
  complianceStatus: "draft",
  complianceScore: 0,
  vectorIndexed: false,

  // Regulatory
  deviceClass: "",
  riskCategory: "",
  intendedUse: "",
  market: "",

  // Common compliance
  riskAssessmentPerformed: false,
  riskAssessmentMethodology: "",
  riskMitigationSummary: "",
  encryptionAtRest: false,
  encryptionInTransit: false,
  hipaaCompliant: false,
  gdprCompliant: false,
  dataRetentionPolicy: "",
  auditLoggingEnabled: false,
  logRetentionDays: "",
  isoStandard: "",
  technicalNotes: "",

  // Medical Device
  clinicalValidationDone: false,
  sterilizationMethod: "",
  biocompatibilityTested: false,
  postMarketSurveillance: false,
  udiAssigned: false,

  // Drug
  clinicalTrialPhase: "",
  gmpCertified: false,
  formulationType: "",
  activeIngredient: "",
  shelfLifeMonths: "",
  coldChainRequired: false,

  // Software
  softwareVersion: "",
  sdlcMethodology: "",
  penetrationTestingDone: false,
  lastPenTestDate: "",
  uptimeSlaPercent: "",
  disasterRecoveryPlan: false,
  changeManagementProcess: false,

  // AI System
  aiModelValidated: false,
  modelVersion: "",
  trainingDataDocumented: false,
  biasTestingDone: false,
  explainabilityMethod: "",
  humanOversightEnabled: false,
  modelDriftMonitoring: false,
  euAiActRiskLevel: "",

  // Diagnostic
  sensitivityPercent: "",
  specificityPercent: "",
  labAccredited: false,
  accreditationBody: "",
  specimenType: "",
  turnaroundTimeHours: "",
};

const EMPTY_APPROVALS = {
  authority: "",
  approvalNumber: "",
  approvalDate: "",
};

// ─────────────────────────────────────────────
// TYPE CONFIG
// ─────────────────────────────────────────────

const TYPE_FIELDS = {
  medical_device: {
    title: "Medical Device",
    fields: [
      {
        type: "checkbox",
        key: "clinicalValidationDone",
        label: "Clinical Validation Done",
      },
      {
        type: "text",
        key: "sterilizationMethod",
        placeholder: "Sterilization Method",
      },
      {
        type: "checkbox",
        key: "biocompatibilityTested",
        label: "Biocompatibility Tested",
      },
      {
        type: "checkbox",
        key: "postMarketSurveillance",
        label: "Post Market Surveillance",
      },
      {
        type: "checkbox",
        key: "udiAssigned",
        label: "UDI Assigned",
      },
    ],
  },

  drug: {
    title: "Drug",
    fields: [
      {
        type: "text",
        key: "clinicalTrialPhase",
        placeholder: "Clinical Trial Phase",
      },
      {
        type: "checkbox",
        key: "gmpCertified",
        label: "GMP Certified",
      },
      {
        type: "text",
        key: "formulationType",
        placeholder: "Formulation Type",
      },
      {
        type: "text",
        key: "activeIngredient",
        placeholder: "Active Ingredient",
      },
      {
        type: "number",
        key: "shelfLifeMonths",
        placeholder: "Shelf Life Months",
      },
      {
        type: "checkbox",
        key: "coldChainRequired",
        label: "Cold Chain Required",
      },
    ],
  },

  software: {
    title: "Software",
    fields: [
      {
        type: "text",
        key: "softwareVersion",
        placeholder: "Software Version",
      },
      {
        type: "text",
        key: "sdlcMethodology",
        placeholder: "SDLC Methodology",
      },
      {
        type: "checkbox",
        key: "penetrationTestingDone",
        label: "Penetration Testing Done",
      },
      {
        type: "date",
        key: "lastPenTestDate",
      },
      {
        type: "number",
        key: "uptimeSlaPercent",
        placeholder: "Uptime SLA %",
      },
      {
        type: "checkbox",
        key: "disasterRecoveryPlan",
        label: "Disaster Recovery Plan",
      },
      {
        type: "checkbox",
        key: "changeManagementProcess",
        label: "Change Management Process",
      },
    ],
  },

  ai_system: {
    title: "AI System",
    fields: [
      {
        type: "checkbox",
        key: "aiModelValidated",
        label: "AI Model Validated",
      },
      {
        type: "text",
        key: "modelVersion",
        placeholder: "Model Version",
      },
      {
        type: "checkbox",
        key: "trainingDataDocumented",
        label: "Training Data Documented",
      },
      {
        type: "checkbox",
        key: "biasTestingDone",
        label: "Bias Testing Done",
      },
      {
        type: "text",
        key: "explainabilityMethod",
        placeholder: "Explainability Method",
      },
      {
        type: "checkbox",
        key: "humanOversightEnabled",
        label: "Human Oversight Enabled",
      },
      {
        type: "checkbox",
        key: "modelDriftMonitoring",
        label: "Model Drift Monitoring",
      },
      {
        type: "text",
        key: "euAiActRiskLevel",
        placeholder: "EU AI Act Risk Level",
      },
    ],
  },
};

// ─────────────────────────────────────────────
// UI
// ─────────────────────────────────────────────

const INPUT =
  "w-full border border-zinc-300 rounded-xl px-4 py-3 outline-none";

const Card = ({title, children}) => (
  <div className="bg-white border border-zinc-200 rounded-3xl p-6">
    <h2 className="text-xl font-semibold mb-5">{title}</h2>
    {children}
  </div>
);

const CheckboxField = ({label, checked, onChange}) => (
  <label className="flex items-center gap-3">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span>{label}</span>
  </label>
);

// ─────────────────────────────────────────────
// TYPE SPECIFIC FIELDS
// ─────────────────────────────────────────────

const TypeSpecificFields = ({productType, form, handleChange}) => {
  const config = TYPE_FIELDS[productType];

  if (!config) return null;

  return (
    <Card title={config.title}>
      <div className="grid md:grid-cols-2 gap-4">
        {config.fields.map((field) => {
          if (field.type === "checkbox") {
            return (
              <CheckboxField
                key={field.key}
                label={field.label}
                checked={form[field.key]}
                onChange={(e) =>
                  handleChange(field.key, e.target.checked)
                }
              />
            );
          }

          return (
            <input
              key={field.key}
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.key]}
              onChange={(e) =>
                handleChange(field.key, e.target.value)
              }
              className={INPUT}
            />
          );
        })}
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────
// CUSTOM HOOK
// ─────────────────────────────────────────────

const useCreateProductForm = (onSuccess) => {
  const [form, setForm] = useState(EMPTY_FORM);

  const [approvals, setApprovals] = useState([EMPTY_APPROVALS]);

  const [organization, setOrganization] = useState([]);

  const [fetchingOrgs, setFetchingOrgs] = useState(false);

  const [selectedImages, setSelectedImages] = useState([]);

  const [previewImages, setPreviewImages] = useState([]);

  const [Loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const fileRef = useRef();

  // Fetch organizations
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        setFetchingOrgs(true);

        const res = await api.get("/organization/show");

        setOrganization(res.data.data || []);
      } catch (error) {
        toast.error("Failed to fetch organizations");
      } finally {
        setFetchingOrgs(false);
      }
    };

    fetchOrgs();
  }, []);

  // Image previews
  useEffect(() => {
    const urls = selectedImages.map((img) =>
      URL.createObjectURL(img),
    );

    setPreviewImages(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedImages]);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApproval = (index, key, value) => {
    setApprovals((prev) =>
      prev.map((a, i) =>
        i === index ? {...a, [key]: value} : a,
      ),
    );
  };

  const addApprovals = () => {
    setApprovals((prev) => [...prev, {...EMPTY_APPROVALS}]);
  };

  const removeApprovals = (index) => {
    setApprovals((prev) =>
      prev.filter((_, i) => i !== index),
    );
  };

  const handleImageChange = (files) => {
    const next = [...selectedImages, ...Array.from(files)].slice(
      0,
      5,
    );

    setSelectedImages(next);
  };

  const removeImage = (index) => {
    setSelectedImages((prev) =>
      prev.filter((_, i) => i !== index),
    );
  };

  // Build FormData
  const buildFormData = () => {
    const data = new FormData();

    Object.keys(form).forEach((key) => {
      if (key !== "market") {
        data.append(key, form[key]);
      }
    });

    const marketArray = form.market
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    data.append("market", JSON.stringify(marketArray));

    data.append(
      "approvals",
      JSON.stringify(
        approvals.filter(
          (a) => a.authority || a.approvalNumber,
        ),
      ),
    );

    selectedImages.forEach((img) => {
      data.append("images", img);
    });

    return data;
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!form.company) {
      toast.error("Please select organization");
      return;
    }

    try {
      setLoading(true);

      await api.post("/product/create", buildFormData(), {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product registered successfully");

      setSuccess(true);

      setTimeout(() => {
        onSuccess?.();
      }, 1000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create product",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    approvals,
    organization,
    fetchingOrgs,
    selectedImages,
    previewImages,
    Loading,
    success,
    fileRef,
    handleChange,
    handleApproval,
    addApprovals,
    removeApprovals,
    handleImageChange,
    removeImage,
    handlesubmit,
  };
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

function AddProducts({onSuccess, onBack}) {
  const {
    form,
    approvals,
    organization,
    fetchingOrgs,
    previewImages,
    Loading,
    success,
    fileRef,
    handleChange,
    handleApproval,
    addApprovals,
    removeApprovals,
    handleImageChange,
    removeImage,
    handlesubmit,
  } = useCreateProductForm(onSuccess);

  if (success) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <CheckCircle2
            size={50}
            className="mx-auto text-green-500 mb-4"
          />

          <h2 className="text-2xl font-semibold">
            Product Created
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-zinc-50 min-h-screen">
      {/* BASIC */}
      <Card title="Basic Information">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={form.productName}
            onChange={(e) =>
              handleChange("productName", e.target.value)
            }
            className={INPUT}
          />

          <input
            type="text"
            placeholder="Product Code"
            value={form.productcode}
            onChange={(e) =>
              handleChange("productcode", e.target.value)
            }
            className={INPUT}
          />

          <select
            value={form.company}
            onChange={(e) =>
              handleChange("company", e.target.value)
            }
            disabled={fetchingOrgs}
            className={INPUT}
          >
            <option value="">Select Organization</option>

            {organization.map((org) => (
              <option key={org._id} value={org._id}>
                {org.legalName}
              </option>
            ))}
          </select>

          <select
            value={form.productType}
            onChange={(e) =>
              handleChange("productType", e.target.value)
            }
            className={INPUT}
          >
            <option value="">Select Type</option>
            <option value="drug">Drug</option>
            <option value="medical_device">
              Medical Device
            </option>
            <option value="software">Software</option>
            <option value="ai_system">AI System</option>
          </select>

          <textarea
            rows={4}
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              handleChange("description", e.target.value)
            }
            className={`md:col-span-2 ${INPUT}`}
          />
        </div>
      </Card>

      {/* REGULATORY */}
      <Card title="Regulatory">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Device Class"
            value={form.deviceClass}
            onChange={(e) =>
              handleChange("deviceClass", e.target.value)
            }
            className={INPUT}
          />

          <select
            value={form.riskCategory}
            onChange={(e) =>
              handleChange("riskCategory", e.target.value)
            }
            className={INPUT}
          >
            <option value="" >riskCategory</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <textarea
            rows={3}
            placeholder="Intended Use"
            value={form.intendedUse}
            onChange={(e) =>
              handleChange("intendedUse", e.target.value)
            }
            className={`md:col-span-2 ${INPUT}`}
          />

          <input
            type="text"
            placeholder="India, USA, EU"
            value={form.market}
            onChange={(e) =>
              handleChange("market", e.target.value)
            }
            className={`md:col-span-2 ${INPUT}`}
          />
        </div>
      </Card>

      {/* APPROVALS */}
      <Card title="Approvals">
        <div className="space-y-4">
          {approvals.map((approval, index) => (
            <div
              key={index}
              className="grid md:grid-cols-3 gap-4"
            >
              <input
                type="text"
                placeholder="Authority"
                value={approval.authority}
                onChange={(e) =>
                  handleApproval(
                    index,
                    "authority",
                    e.target.value,
                  )
                }
                className={INPUT}
              />

              <input
                type="text"
                placeholder="Approval Number"
                value={approval.approvalNumber}
                onChange={(e) =>
                  handleApproval(
                    index,
                    "approvalNumber",
                    e.target.value,
                  )
                }
                className={INPUT}
              />

              <div className="flex gap-2">
                <input
                  type="date"
                  value={approval.approvalDate}
                  onChange={(e) =>
                    handleApproval(
                      index,
                      "approvalDate",
                      e.target.value,
                    )
                  }
                  className={INPUT}
                />

                {approvals.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeApprovals(index)}
                    className="w-12 bg-red-500 text-white rounded-xl flex items-center justify-center"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addApprovals}
            className="border border-dashed border-zinc-300 rounded-xl py-3 flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add Approval
          </button>
        </div>
      </Card>

      {/* TYPE SPECIFIC */}
      <TypeSpecificFields
        productType={form.productType}
        form={form}
        handleChange={handleChange}
      />

      {/* IMAGES */}
      <Card title="Images">
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            handleImageChange(e.target.files)
          }
        />

        <button
          type="button"
          onClick={() => fileRef.current.click()}
          className="w-full border-2 border-dashed border-zinc-300 rounded-2xl py-10 flex flex-col items-center gap-3"
        >
          <UploadCloud size={30} />
          Upload Images
        </button>

        <div className="flex flex-wrap gap-4 mt-5">
          {previewImages.map((img, index) => (
            <div
              key={index}
              className="relative w-24 h-24 rounded-xl overflow-hidden"
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover"
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* ACTIONS */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 border rounded-xl"
        >
          Cancel
        </button>

        <button
          onClick={handlesubmit}
          disabled={Loading}
          className="px-5 py-3 bg-black text-white rounded-xl flex items-center gap-2"
        >
          {Loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creating...
            </>
          ) : (
            "Create Product"
          )}
        </button>
      </div>
    </div>
  );
}

export default AddProducts;