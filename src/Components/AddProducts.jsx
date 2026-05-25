import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api/api.js";

import {
  Package2,
  ShieldCheck,
  Building2,
  UploadCloud,
  Plus,
  Trash2,
  ChevronRight,
  Loader2,
  Sparkles,
} from "lucide-react";

function AddProducts({ onSuccess }) {
  const [loading, setloading] = useState(false);
  const [organization, setOrganization] = useState([]);
  const [fetchingOrgs, setFetchingOrgs] = useState(false);

  const [formdata, setFormdata] = useState({
    productName: "",
    productcode: "",
    description: "",
    productType: "",
    company: "",
    complianceStatus: "draft",
    complianceScore: 0,
    vectorIndexed: false,
    deviceClass: "",
    riskcategory: "low",
    intendedUse: "",
    market: "",
  });

  const [approvals, setApprovals] = useState([
    {
      authority: "",
      approvalNumber: "",
      approvalDate: "",
    },
  ]);

  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const fetchOrgs = async () => {
      setFetchingOrgs(true);

      try {
        const res = await api.get("/organization/show");
        setOrganization(res.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setFetchingOrgs(false);
      }
    };

    fetchOrgs();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormdata({
      ...formdata,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleapproval = (e, index) => {
    const { name, value } = e.target;

    const newApprovals = [...approvals];

    newApprovals[index][name] = value;

    setApprovals(newApprovals);
  };

  const addApprovals = () => {
    setApprovals([
      ...approvals,
      {
        authority: "",
        approvalNumber: "",
        approvalDate: "",
      },
    ]);
  };

  const removeApprovals = (index) => {
    setApprovals(
      approvals.filter((_, i) => i !== index)
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setSelectedImages((prev) =>
      [...prev, ...files].slice(0, 5)
    );
  };

  const removeImage = (index) => {
    setSelectedImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!formdata.company) {
      toast.error("Please select organization");
      return;
    }

    setloading(true);

    const data = new FormData();

    Object.keys(formdata).forEach((name) => {
      if (name !== "market") {
        data.append(name, formdata[name]);
      }
    });

    const marketArray = formdata.market
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m !== "");

    data.append("market", JSON.stringify(marketArray));

    const validApprovals = approvals.filter(
      (a) => a.authority || a.approvalNumber
    );

    data.append(
      "approvals",
      JSON.stringify(validApprovals)
    );

    selectedImages.forEach((img) => {
      data.append("images", img);
    });

    try {
      await api.post("/product/create", data, {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      });

      toast.success(
        "Product registered successfully!"
      );

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create product"
      );
    } finally {
      setloading(false);
    }
  };

  const inputStyle =
    "w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all";

  const sectionStyle =
    "bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm";

  return (
    <div className="min-h-screen bg-[#f4f7fb] dark:bg-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-full text-sm font-medium mb-5">
              <Sparkles size={16} />
              Compliance Workspace
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Register New Product
            </h1>

            <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-2xl">
              Create and manage regulatory product
              documentation, approvals, compliance,
              and AI indexing.
            </p>
          </div>
        </div>

        <form onSubmit={handlesubmit}>
          
          {/* MAIN */}
          <div className="grid xl:grid-cols-[280px_1fr] gap-6">
            
            {/* SIDEBAR */}
            <div className="bg-gradient-to-b from-black to-zinc-900 text-white rounded-[32px] p-8 h-fit sticky top-6">
              <div className="flex items-center gap-3 mb-12">
                <div className="bg-white/10 p-3 rounded-2xl">
                  <Package2 size={24} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Product Console
                  </h2>

                  <p className="text-sm text-gray-400">
                    Enterprise Workflow
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  "Basic Information",
                  "Regulatory & Risk",
                  "Approvals",
                  "Compliance",
                  "Assets Upload",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b border-white/10 pb-4"
                  >
                    <div>
                      <p className="text-xs text-gray-400">
                        STEP 0{i + 1}
                      </p>

                      <h3 className="mt-1 font-medium">
                        {item}
                      </h3>
                    </div>

                    <ChevronRight size={18} />
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-sm text-gray-400">
                  AI Compliance
                </p>

                <h3 className="font-semibold mt-2">
                  Vector Search Enabled
                </h3>

                <p className="text-sm mt-2 text-gray-300 leading-6">
                  Products can be indexed for semantic
                  AI search and compliance analytics.
                </p>
              </div>
            </div>

            {/* FORM CONTENT */}
            <div className="space-y-6">
              
              {/* BASIC INFO */}
              <div className={sectionStyle}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-black text-white dark:bg-white dark:text-black p-3 rounded-2xl">
                    <Package2 size={20} />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Basic Information
                    </h2>

                    <p className="text-sm text-gray-500">
                      Main product details
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    name="productName"
                    value={formdata.productName}
                    onChange={handleChange}
                    placeholder="Product Name"
                    className={inputStyle}
                  />

                  <input
                    type="text"
                    name="productcode"
                    value={formdata.productcode}
                    onChange={handleChange}
                    placeholder="Product Code"
                    className={inputStyle}
                  />

                  <textarea
                    name="description"
                    value={formdata.description}
                    onChange={handleChange}
                    placeholder="Description"
                    rows="5"
                    className={`${inputStyle} md:col-span-2`}
                  />

                  <select
                    name="productType"
                    value={formdata.productType}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option value="">
                      Product Type
                    </option>

                    <option value="drug">
                      Drug
                    </option>

                    <option value="medical_device">
                      Medical Device
                    </option>

                    <option value="software">
                      Software
                    </option>

                    <option value="ai_system">
                      AI System
                    </option>
                  </select>

                  <select
                    name="company"
                    value={formdata.company}
                    onChange={handleChange}
                    disabled={fetchingOrgs}
                    className={inputStyle}
                  >
                    <option value="">
                      Select Organization
                    </option>

                    {organization.map((org) => (
                      <option
                        key={org._id}
                        value={org._id}
                      >
                        {org.legalName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* REGULATORY */}
              <div className={sectionStyle}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-black text-white dark:bg-white dark:text-black p-3 rounded-2xl">
                    <ShieldCheck size={20} />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Regulatory & Risk
                    </h2>

                    <p className="text-sm text-gray-500">
                      Compliance classification
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    name="deviceClass"
                    value={formdata.deviceClass}
                    onChange={handleChange}
                    placeholder="Device Class"
                    className={inputStyle}
                  />

                  <select
                    name="riskcategory"
                    value={formdata.riskcategory}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option value="low">
                      Low Risk
                    </option>

                    <option value="medium">
                      Medium Risk
                    </option>

                    <option value="high">
                      High Risk
                    </option>

                    <option value="critical">
                      Critical
                    </option>
                  </select>

                  <input
                    type="text"
                    name="intendedUse"
                    value={formdata.intendedUse}
                    onChange={handleChange}
                    placeholder="Intended Use"
                    className={inputStyle}
                  />

                  <input
                    type="text"
                    name="market"
                    value={formdata.market}
                    onChange={handleChange}
                    placeholder="India, USA, EU"
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* APPROVALS */}
              <div className={sectionStyle}>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Regulatory Approvals
                    </h2>

                    <p className="text-sm text-gray-500">
                      Authority approvals & licenses
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addApprovals}
                    className="bg-black text-white dark:bg-white dark:text-black px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Approval
                  </button>
                </div>

                <div className="space-y-5">
                  {approvals.map((approval, index) => (
                    <div
                      key={index}
                      className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 grid md:grid-cols-3 gap-4"
                    >
                      <input
                        type="text"
                        name="authority"
                        value={approval.authority}
                        onChange={(e) =>
                          handleapproval(e, index)
                        }
                        placeholder="Authority"
                        className={inputStyle}
                      />

                      <input
                        type="text"
                        name="approvalNumber"
                        value={
                          approval.approvalNumber
                        }
                        onChange={(e) =>
                          handleapproval(e, index)
                        }
                        placeholder="Approval Number"
                        className={inputStyle}
                      />

                      <input
                        type="date"
                        name="approvalDate"
                        value={approval.approvalDate}
                        onChange={(e) =>
                          handleapproval(e, index)
                        }
                        className={inputStyle}
                      />

                      {approvals.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeApprovals(index)
                          }
                          className="md:col-span-3 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl flex justify-center items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Remove Approval
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* COMPLIANCE */}
              <div className={sectionStyle}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-black text-white dark:bg-white dark:text-black p-3 rounded-2xl">
                    <Building2 size={20} />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Compliance Settings
                    </h2>

                    <p className="text-sm text-gray-500">
                      Compliance status and AI
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <select
                    name="complianceStatus"
                    value={formdata.complianceStatus}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option value="draft">
                      Draft
                    </option>

                    <option value="under_review">
                      Under Review
                    </option>

                    <option value="compliant">
                      Compliant
                    </option>

                    <option value="non_compliant">
                      Non-Compliant
                    </option>
                  </select>

                  <input
                    type="number"
                    name="complianceScore"
                    value={formdata.complianceScore}
                    onChange={handleChange}
                    placeholder="Compliance Score"
                    className={inputStyle}
                  />
                </div>

                <label className="mt-6 flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 cursor-pointer">
                  <input
                    type="checkbox"
                    name="vectorIndexed"
                    checked={formdata.vectorIndexed}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />

                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">
                      Enable AI Vector Indexing
                    </h3>

                    <p className="text-sm text-gray-500">
                      Allow semantic AI search &
                      analytics
                    </p>
                  </div>
                </label>
              </div>

              {/* IMAGES */}
              <div className={sectionStyle}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-black text-white dark:bg-white dark:text-black p-3 rounded-2xl">
                    <UploadCloud size={20} />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Product Assets
                    </h2>

                    <p className="text-sm text-gray-500">
                      Upload product images
                    </p>
                  </div>
                </div>

                <label className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition">
                  <UploadCloud
                    size={40}
                    className="text-gray-400 mb-4"
                  />

                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Upload Product Images
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Drag & drop or browse files
                  </p>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">
                  {selectedImages.map((img, index) => (
                    <div
                      key={index}
                      className="relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="w-full h-44 object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(index)
                        }
                        className="absolute top-3 right-3 bg-black/80 text-white p-2 rounded-full"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white py-5 rounded-3xl font-semibold text-lg transition-all flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2
                      className="animate-spin"
                      size={20}
                    />
                    Registering Product...
                  </>
                ) : (
                  <>
                    Register Product
                    <ChevronRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProducts;