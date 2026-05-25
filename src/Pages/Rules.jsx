import { useState, useEffect, useMemo } from "react";
import api from "../api/api";

import {
  GppGood as Shield,
  Search,
  ChevronRight,
  ArrowBack,
  Language,
  Public,
  VerifiedUser,
  Rule,
  Security,
  InfoOutlined,
  CheckCircle,
  WarningAmber,
  ErrorOutlineOutlined,
  AccountBalance,
  Hub,
} from "@mui/icons-material";

const Rules = () => {
  const [frameworks, setFrameworks] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchFrameworks = async () => {
    setLoading(true);

    try {
      const res = await api.get("/framework/get");
      setFrameworks(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch frameworks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFrameworks();
  }, []);

  const filteredFrameworks = useMemo(() => {
    return frameworks.filter(
      (f) =>
        f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.shortcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.authority?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.country?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [frameworks, searchQuery]);

  const totalControls = frameworks.reduce(
    (acc, curr) => acc + (curr.controls?.length || 0),
    0
  );

  const getRiskConfig = (risk) => {
    switch (risk?.toLowerCase()) {
      case "high":
        return {
          color:
            "bg-red-500/10 text-red-600 border border-red-500/20 dark:text-red-400",
          icon: <ErrorOutlineOutlined sx={{ fontSize: 16 }} />,
        };

      case "medium":
        return {
          color:
            "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 dark:text-yellow-400",
          icon: <WarningAmber sx={{ fontSize: 16 }} />,
        };

      default:
        return {
          color:
            "bg-green-500/10 text-green-600 border border-green-500/20 dark:text-green-400",
          icon: <CheckCircle sx={{ fontSize: 16 }} />,
        };
    }
  };

  const FrameworkDetail = ({ framework, onBack }) => {
    return (
      <div className="space-y-8 animate-fadeIn">
        {/* BACK */}
        <button
          onClick={onBack}
          className="sticky top-4 z-40 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg transition-all hover:scale-[1.02] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <ArrowBack fontSize="small" />
          Back to Frameworks
        </button>

        {/* HERO */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-indigo-700 via-violet-700 to-blue-700 p-6 shadow-2xl md:p-10">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 gap-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-white backdrop-blur">
                <Shield sx={{ fontSize: 46 }} />
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white">
                    Version {framework.version}
                  </span>

                  <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white">
                    {framework.industry}
                  </span>

                  <span className="rounded-full border border-emerald-300/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-100">
                    Active
                  </span>
                </div>

                <div>
                  <h1 className="text-3xl font-black text-white md:text-5xl">
                    {framework.name}
                  </h1>

                  <p className="mt-2 text-lg font-medium text-blue-100">
                    {framework.shortcode}
                  </p>
                </div>

                <div className="flex flex-wrap gap-5 text-sm text-blue-100">
                  <div className="flex items-center gap-2">
                    <Public sx={{ fontSize: 18 }} />
                    {framework.country}
                  </div>

                  <div className="flex items-center gap-2">
                    <AccountBalance sx={{ fontSize: 18 }} />
                    {framework.authority}
                  </div>

                  <div className="flex items-center gap-2">
                    <Hub sx={{ fontSize: 18 }} />
                    {framework.controls?.length || 0} Controls
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT STATS */}
            <div className="grid grid-cols-2 gap-4 xl:w-[360px]">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-blue-100">Controls</p>

                <h2 className="mt-2 text-4xl font-black text-white">
                  {framework.controls?.length || 0}
                </h2>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-blue-100">Industry</p>

                <h2 className="mt-2 text-xl font-bold text-white">
                  {framework.industry}
                </h2>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-blue-100">Applies To</p>

                <h2 className="mt-2 text-lg font-bold text-white">
                  {framework.appliedTo || "Organizations"}
                </h2>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-blue-100">Status</p>

                <h2 className="mt-2 text-lg font-bold text-emerald-300">
                  Compliant
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* OVERVIEW */}
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">
                <InfoOutlined />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Framework Overview
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Compliance information and governance details
                </p>
              </div>
            </div>

            <p className="leading-8 text-slate-600 dark:text-slate-300">
              {framework.description}
            </p>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-green-500/10 p-3 text-green-600 dark:text-green-400">
                  <VerifiedUser />
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Compliance Details
                </h3>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Authority
                  </p>

                  <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                    {framework.authority}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Country
                  </p>

                  <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                    {framework.country}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Industry
                  </p>

                  <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                    {framework.industry}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Applies To
                  </p>

                  <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                    {framework.appliedTo}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-6 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">
                  <Security />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Security Governance
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Enterprise-grade regulatory compliance and operational
                    governance management system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                Regulatory Controls
              </h2>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Detailed compliance rules and requirements
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {framework.controls?.length || 0} Controls
              </span>
            </div>
          </div>

          <div className="grid gap-6">
            {framework.controls?.map((control, idx) => {
              const risk = getRiskConfig(control.risklevel);

              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />

                  <div className="p-7">
                    <div className="mb-5 flex flex-wrap items-center gap-3">
                      <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {control.controlledId}
                      </span>

                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${risk.color}`}
                      >
                        {risk.icon}
                        {control.risklevel} Risk
                      </span>

                      {control.maindatory && (
                        <span className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400">
                          Mandatory
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      {control.title}
                    </h3>

                    <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">
                      {control.description}
                    </p>

                    {/* REQUIREMENT */}
                    <div className="mt-6 rounded-2xl border border-indigo-500/10 bg-gradient-to-r from-indigo-500/5 to-violet-500/5 p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <Rule className="text-indigo-600 dark:text-indigo-400" />

                        <h4 className="font-bold text-slate-900 dark:text-white">
                          Compliance Requirement
                        </h4>
                      </div>

                      <p className="leading-7 text-slate-600 dark:text-slate-300">
                        {control.requimentText}
                      </p>
                    </div>

                    {/* TAGS */}
                    {control.tags?.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-3">
                        {control.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[#f4f7fb] dark:bg-[#020617]">
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 xl:px-8">
        {selectedFramework ? (
          <FrameworkDetail
            framework={selectedFramework}
            onBack={() => setSelectedFramework(null)}
          />
        ) : (
          <div className="space-y-10">
            {/* HERO */}
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-6 shadow-2xl md:p-10">
              <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

              <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

              <div className="relative z-10 flex flex-col gap-10 xl:flex-row xl:items-center xl:justify-between">
                {/* LEFT */}
                <div className="max-w-3xl">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                    <Shield sx={{ fontSize: 18 }} />
                    Enterprise Compliance Platform
                  </div>

                  <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
                    Regulatory Rules &
                    <span className="bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                      {" "}
                      Compliance
                    </span>
                  </h1>

                  <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                    Explore global regulations, governance standards,
                    enterprise-level compliance controls, and risk management
                    frameworks.
                  </p>

                  {/* SEARCH */}
                  <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
                    <Search className="text-slate-300" />

                    <input
                      type="text"
                      placeholder="Search frameworks, authority, country..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-white outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 gap-5 xl:w-[420px]">
                  <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                    <p className="text-sm text-slate-300">
                      Total Frameworks
                    </p>

                    <h2 className="mt-3 text-4xl font-black text-white">
                      {frameworks.length}
                    </h2>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                    <p className="text-sm text-slate-300">Controls</p>

                    <h2 className="mt-3 text-4xl font-black text-white">
                      {totalControls}
                    </h2>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                    <p className="text-sm text-slate-300">Countries</p>

                    <h2 className="mt-3 text-4xl font-black text-white">
                      {
                        [...new Set(frameworks.map((f) => f.country))].length
                      }
                    </h2>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                    <p className="text-sm text-slate-300">Industries</p>

                    <h2 className="mt-3 text-4xl font-black text-white">
                      {
                        [...new Set(frameworks.map((f) => f.industry))].length
                      }
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="flex h-[300px] flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />

                <p className="mt-6 text-lg font-medium text-slate-600 dark:text-slate-300">
                  Loading frameworks...
                </p>
              </div>
            ) : filteredFrameworks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-300 bg-white py-24 text-center dark:border-slate-700 dark:bg-slate-900">
                <div className="rounded-full bg-slate-100 p-5 dark:bg-slate-800">
                  <InfoOutlined sx={{ fontSize: 48 }} />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
                  No Frameworks Found
                </h3>

                <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">
                  Try another search keyword or compliance standard.
                </p>
              </div>
            ) : (
              <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
                {filteredFrameworks.map((framework) => (
                  <div
                    key={framework._id}
                    onClick={() => setSelectedFramework(framework)}
                    className="group cursor-pointer overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900"
                  >
                    {/* TOP */}
                    <div className="flex items-start justify-between">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg">
                        <Shield sx={{ fontSize: 34 }} />
                      </div>

                      <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        v{framework.version}
                      </span>
                    </div>

                    {/* BODY */}
                    <div className="mt-7">
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                        {framework.name}
                      </h2>

                      <p className="mt-2 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {framework.shortcode}
                      </p>

                      <p className="mt-5 line-clamp-3 leading-7 text-slate-600 dark:text-slate-300">
                        {framework.description}
                      </p>
                    </div>

                    {/* TAGS */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {framework.industry}
                      </span>

                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-600 dark:text-green-400">
                        {framework.country}
                      </span>
                    </div>

                    {/* FOOTER */}
                    <div className="mt-7 flex items-center justify-between border-t border-slate-200 pt-5 dark:border-slate-800">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Language sx={{ fontSize: 16 }} />
                          {framework.authority}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Rule sx={{ fontSize: 16 }} />
                          {framework.controls?.length || 0} Controls
                        </div>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 transition-all group-hover:bg-indigo-500 group-hover:text-white dark:bg-slate-800">
                        <ChevronRight />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rules;