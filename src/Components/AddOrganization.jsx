import { useState } from "react";
import api from "../api/api.js";
import { toast } from "react-toastify";
import {
  Building2,
  Globe,
  Phone,
  Mail,
  User2,
  MapPinned,
  ShieldCheck,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";

function AddOrganization() {
  const [FormData, setFormData] = useState({
    legalName: "",
    dbaName: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    primaryContact: {
      name: "",
      email: "",
    },
    phoneNumber: "",
    website: "",
    identifier: {
      fdafei: "",
      labellerCode: "",
      dunsNumber: "",
      cin: "",
      gstin: "",
      pan: "",
      cdsco: "",
      others: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/organization/create", FormData);

      console.log(res);

      toast.success("Organization added successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add organization"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-3 pl-11 pr-2 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-black dark:focus:border-white transition-all";

  const sectionTitle =
    "text-lg font-semibold text-gray-900 dark:text-white";

  const sectionDesc =
    "text-sm text-gray-500 dark:text-gray-400";

  return (
    <div className="min-h-screen bg-[#f5f7fb] dark:bg-black px-4 py-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-gray-400 mb-2">
              Enterprise Workspace
            </p>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Create Organization
            </h1>

            <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-2xl">
              Register a new organization with contact details,
              legal identifiers, and official address information.
            </p>
          </div>
          
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Main Container */}
          <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-[32px] overflow-hidden shadow-xl">
            
            <div className="grid lg:grid-cols-[280px_1fr]">
              
              {/* SIDEBAR */}
              <div className="bg-gradient-to-b from-black to-zinc-900 text-white p-8">
                <div className="flex items-center gap-3 mb-14">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Building2 size={24} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Organization Portal
                    </h2>

                    <p className="text-sm text-gray-400">
                      Internal Management
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    "Company Information",
                    "Primary Contact",
                    "Address Details",
                    "Legal Identifiers",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border-b border-white/10 pb-4"
                    >
                      <div>
                        <p className="text-sm text-gray-400">
                          Section 0{i + 1}
                        </p>

                        <h3 className="font-medium mt-1">
                          {item}
                        </h3>
                      </div>

                      <ChevronRight size={18} />
                    </div>
                  ))}
                </div>

                <div className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-sm text-gray-400">
                    Tip
                  </p>

                  <p className="text-sm mt-2 leading-6 text-gray-200">
                    Use accurate organization details for
                    compliance and onboarding verification.
                  </p>
                </div>
              </div>

              {/* FORM AREA */}
              <div className="p-6 md:p-10 space-y-14">
                
                {/* Company */}
                <section>
                  <div className="mb-8">
                    <h2 className={sectionTitle}>
                      Company Information
                    </h2>

                    <p className={sectionDesc}>
                      Official organization details
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="relative">
                      <Building2
                        className="absolute left-0 top-3 text-gray-400"
                        size={18}
                      />

                      <input
                        className={inputStyle}
                        name="legalName"
                        placeholder="Legal Company Name"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="relative">
                      <Building2
                        className="absolute left-0 top-3 text-gray-400"
                        size={18}
                      />

                      <input
                        className={inputStyle}
                        name="dbaName"
                        placeholder="DBA Name"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="relative">
                      <Globe
                        className="absolute left-0 top-3 text-gray-400"
                        size={18}
                      />

                      <input
                        className={inputStyle}
                        name="website"
                        placeholder="Website URL"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="relative">
                      <Phone
                        className="absolute left-0 top-3 text-gray-400"
                        size={18}
                      />

                      <input
                        className={inputStyle}
                        name="phoneNumber"
                        placeholder="Phone Number"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </section>

                {/* Contact */}
                <section>
                  <div className="mb-8">
                    <h2 className={sectionTitle}>
                      Primary Contact
                    </h2>

                    <p className={sectionDesc}>
                      Main communication person
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="relative">
                      <User2
                        className="absolute left-0 top-3 text-gray-400"
                        size={18}
                      />

                      <input
                        className={inputStyle}
                        name="primaryContact.name"
                        placeholder="Contact Person Name"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="relative">
                      <Mail
                        className="absolute left-0 top-3 text-gray-400"
                        size={18}
                      />

                      <input
                        className={inputStyle}
                        name="primaryContact.email"
                        placeholder="Email Address"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </section>

                {/* Address */}
                <section>
                  <div className="mb-8">
                    <h2 className={sectionTitle}>
                      Address Information
                    </h2>

                    <p className={sectionDesc}>
                      Registered office location
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="relative md:col-span-2">
                      <MapPinned
                        className="absolute left-0 top-3 text-gray-400"
                        size={18}
                      />

                      <input
                        className={inputStyle}
                        name="address.street"
                        placeholder="Street Address"
                        onChange={handleChange}
                      />
                    </div>

                    <input
                      className={inputStyle}
                      name="address.city"
                      placeholder="City"
                      onChange={handleChange}
                    />

                    <input
                      className={inputStyle}
                      name="address.state"
                      placeholder="State"
                      onChange={handleChange}
                    />

                    <input
                      className={inputStyle}
                      name="address.zip"
                      placeholder="Zip Code"
                      onChange={handleChange}
                    />

                    <input
                      className={inputStyle}
                      name="address.country"
                      placeholder="Country"
                      onChange={handleChange}
                    />
                  </div>
                </section>

                {/* Identifiers */}
                <section>
                  <div className="mb-8">
                    <h2 className={sectionTitle}>
                      Compliance & Identifiers
                    </h2>

                    <p className={sectionDesc}>
                      Regulatory and legal identifiers
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {Object.keys(FormData.identifier).map((key) => (
                      <div
                        key={key}
                        className="relative"
                      >
                        <ShieldCheck
                          className="absolute left-0 top-3 text-gray-400"
                          size={18}
                        />

                        <input
                          className={inputStyle}
                          name={`identifier.${key}`}
                          placeholder={key.toUpperCase()}
                          onChange={handleChange}
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Submit */}
                <div className="pt-6 border-t border-gray-200 dark:border-zinc-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white px-8 py-4 rounded-2xl font-medium transition-all flex items-center gap-3 shadow-lg"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle
                          className="animate-spin"
                          size={18}
                        />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Organization
                        <ChevronRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddOrganization;