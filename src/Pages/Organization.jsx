import { useState, useEffect } from "react";
import api from "../api/api";

import {
  Building2,
  Globe,
  Phone,
  MapPin,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  Boxes,
  Loader2,
  Sparkles,
  ExternalLink,
  Plus,
} from "lucide-react";

import AddOrganization from "../Components/AddOrganization.jsx";

const Organizations = () => {
  const [activeTab, setActiveTab] = useState("my-organizations");

  const [view, setView] = useState("list");

  const [selectedOrg, setSelectedOrg] = useState(null);

  const [organizations, setOrganizations] = useState([]);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [productsLoading, setProductsLoading] = useState(false);

  const [error, setError] = useState("");

  // =========================================
  // FETCH ORGANIZATIONS
  // =========================================

  const fetchOrganizations = async () => {
    setLoading(true);

    try {
      const res = await api.get("/organization/show");

      setOrganizations(res.data.data || []);
    } catch (err) {
      if (
        err.response?.status === 400 &&
        err.response?.data?.message === "No Company available"
      ) {
        setOrganizations([]);
      } else {
        setError(
          err.response?.data?.message || "Failed to fetch organizations",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // FETCH PRODUCTS
  // =========================================

  const fetchProducts = async (companyId) => {
    setProductsLoading(true);

    try {
      const res = await api.get(`/product/getbycompany/${companyId}`);

      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  // =========================================
  // HANDLERS
  // =========================================

  const handleAddSuccess = () => {
    setActiveTab("my-organizations");

    fetchOrganizations();
  };

  const handleOrgClick = async (org) => {
    setSelectedOrg(org);

    setProducts([]);

    setView("detail");

    await fetchProducts(org._id);
  };

  // =========================================
  // DETAILS VIEW
  // =========================================

  const OrganizationDetails = ({ org, onBack }) => {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300">
        {/* BG */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />

          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {/* BACK */}
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition mb-8"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
            Back to Organizations
          </button>

          {/* HERO */}
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-2xl p-6 md:p-10 shadow-2xl">
            <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-blue-500/10 blur-[100px]" />

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">
              {/* LEFT */}
              <div className="flex items-start gap-5">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/20 shrink-0">
                  <Building2 className="w-12 h-12 text-white" />
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-sm font-semibold mb-5">
                    <Sparkles className="w-4 h-4" />
                    Enterprise Organization
                  </div>

                  <h1 className="text-3xl md:text-5xl font-black break-words">
                    {org.legalName}
                  </h1>

                  <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg">
                    {org.dbaName}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="w-full xl:w-[350px] rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.03] p-6">
                <div className="space-y-6">
                  {/* WEBSITE */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-blue-500/10">
                      <Globe className="w-5 h-5 text-blue-500" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Website
                      </p>

                      <a
                        href={org.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mt-1 hover:underline break-all"
                      >
                        {org.website}

                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* PHONE */}
                  <div className="flex gap-4">
                    <div className="p-3 rounded-2xl bg-green-500/10">
                      <Phone className="w-5 h-5 text-green-500" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Phone
                      </p>

                      <p className="mt-1 font-medium">{org.phoneNumber}</p>
                    </div>
                  </div>

                  {/* ADDRESS */}
                  <div className="flex gap-4">
                    <div className="p-3 rounded-2xl bg-purple-500/10">
                      <MapPin className="w-5 h-5 text-purple-500" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Address
                      </p>

                      <p className="mt-1 font-medium">
                        {org.address?.street}, {org.address?.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-10">
            {/* COMPLIANCE */}
            <div className="rounded-[30px] border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-green-500/10">
                  <ShieldCheck className="w-6 h-6 text-green-500" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">Compliance IDs</h2>

                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Regulatory Information
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "FDA FEI",
                    value: org.identifier?.fdafei,
                  },

                  {
                    label: "DUNS",
                    value: org.identifier?.dunsNumber,
                  },

                  {
                    label: "CIN",
                    value: org.identifier?.cin,
                  },

                  {
                    label: "GSTIN",
                    value: org.identifier?.gstin,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.03] p-5"
                  >
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {item.label}
                    </p>

                    <h3 className="text-lg font-bold mt-2 break-all">
                      {item.value || "N/A"}
                    </h3>
                  </div>
                ))}
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="xl:col-span-2 rounded-[30px] border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-blue-500/10">
                  <Boxes className="w-6 h-6 text-blue-500" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">Product Portfolio</h2>

                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Registered organization products
                  </p>
                </div>
              </div>

              {productsLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <Boxes className="w-16 h-16 mx-auto text-slate-400 mb-5" />

                  <h3 className="text-2xl font-bold">No Products</h3>

                  <p className="text-slate-500 dark:text-slate-400 mt-3">
                    No products registered yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {products.map((prod) => (
                    <div
                      key={prod._id}
                      className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.03] p-6 hover:scale-[1.01] transition"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                        <div>
                          <h3 className="text-2xl font-bold">
                            {prod.productName}
                          </h3>

                          <p className="text-slate-500 dark:text-slate-400 mt-2">
                            {prod.productCode} • {prod.productType}
                          </p>
                        </div>

                        {/* <div
                          className={`px-5 py-2 rounded-xl text-sm font-semibold border w-fit ${
                            prod.complianceStatus === "compliant"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          }`}
                        >
                          {prod.complianceStatus}
                        </div> */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =========================================
  // DETAIL VIEW
  // =========================================

  if (view === "detail") {
    return (
      <OrganizationDetails org={selectedOrg} onBack={() => setView("list")} />
    );
  }

  // =========================================
  // MAIN PAGE
  // =========================================

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300">
      {/* BG */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Enterprise Workspace
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              Organizations
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-lg mt-4 max-w-2xl">
              Manage enterprise organizations, compliance, and products in one
              centralized workspace.
            </p>
          </div>

          {/* TABS */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab("my-organizations")}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === "my-organizations"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20"
                  : "bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white"
              }`}
            >
              My Organizations
            </button>

            <button
              onClick={() => setActiveTab("add-organization")}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "add-organization"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20"
                  : "bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white"
              }`}
            >
              <Plus className="w-5 h-5" />
              Add Organization
            </button>
          </div>
        </div>

        {/* CONTENT */}
        {activeTab === "my-organizations" ? (
          <>
            {loading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="w-14 h-14 animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-red-500">
                {error}
              </div>
            ) : organizations.length === 0 ? (
              <div className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] p-20 text-center shadow-xl">
                <Building2 className="w-20 h-20 mx-auto text-slate-400 mb-6" />

                <h2 className="text-3xl font-bold">No Organizations Found</h2>

                <p className="text-slate-500 dark:text-slate-400 mt-4">
                  Create your first organization.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {organizations.map((org, index) => (
                  <div
                    key={org._id}
                    onClick={() => handleOrgClick(org)}
                    className="group relative overflow-hidden rounded-[30px] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0B1120]/70 backdrop-blur-2xl hover:border-blue-500/30 transition-all duration-500 cursor-pointer shadow-[0_10px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
                  >
                    {/* LEFT BORDER */}
                    <div
                      className={`absolute top-0 left-0 h-full w-1 ${
                        index % 4 === 0
                          ? "bg-blue-500"
                          : index % 4 === 1
                            ? "bg-purple-500"
                            : index % 4 === 2
                              ? "bg-emerald-500"
                              : "bg-orange-500"
                      }`}
                    />

                    {/* HOVER EFFECT */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
                      <div className="absolute -top-20 right-0 w-72 h-72 bg-blue-500/10 blur-[100px]" />
                    </div>

                    {/* CONTENT */}
                    <div className="relative z-10 p-6 lg:p-8">
                     <div className="flex flex-col gap-8">
                        {/* LEFT */}
                        <div className="flex items-start gap-5 flex-1 min-w-0">
                          {/* ICON */}
                          <div className="relative shrink-0">
                            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />

                            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
                              <Building2 className="w-9 h-9 text-white" />
                            </div>
                          </div>

                          {/* INFO */}
                          <div className="min-w-0 flex-1">
                            {/* BADGES */}
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                              <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-semibold">
                                ENTERPRISE
                              </div>

                              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
                                ACTIVE
                              </div>
                            </div>

                            {/* TITLE */}
                            <h2 className="text-2xl md:text-3xl font-black break-words text-slate-900 dark:text-white">
                              {org.legalName}
                            </h2>

                            {/* DBA */}
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">
                              {org.dbaName || "Global Enterprise Organization"}
                            </p>

                            {/* WEBSITE */}
                            <div className="flex items-start gap-3 mt-5">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0">
                                <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                              </div>

                              <div className="min-w-0">
                                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                                  Website
                                </p>

                                <a
                                  href={org.website}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                                >
                                  {org.website}
                                </a>
                              </div>
                            </div>

                            {/* META */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                              {/* LOCATION */}
                              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.03] p-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4 text-purple-500" />
                                  </div>

                                  <div className="min-w-0">
                                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                                      Location
                                    </p>

                                    <p className="font-semibold text-slate-900 dark:text-white break-words">
                                      {org.address?.street}, {org.address?.city}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* CONTACT */}
                              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.03] p-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                                    <Phone className="w-4 h-4 text-green-500" />
                                  </div>

                                  <div className="min-w-0">
                                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                                      Contact
                                    </p>

                                    <p className="font-semibold text-slate-900 dark:text-white break-all">
                                      {org.phoneNumber || "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* BOTTOM ACTION */}
                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
                          <button className="w-full md:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-4 text-white font-semibold shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                            Open Workspace
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-2xl p-6 shadow-xl">
            <AddOrganization onSuccess={handleAddSuccess} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Organizations;
