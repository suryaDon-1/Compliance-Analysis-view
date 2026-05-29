import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/context.jsx";

import {
  ShieldCheck,
  ClipboardCheck,
  Database,
  Loader2,
  Activity,
  Sparkles,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Clock3,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState({
    complianceScore: 0,
    frameworksCount: 0,
    productsCount: 0,
    reportsCount: 0,
    latestReports: [],
    loading: true,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        reportsRes,
        frameworksRes,
        productsRes,
      ] = await Promise.all([
        axios.get(
          "https://compliance-analysis-api.onrender.com/api/complince/get-reports",
          { withCredentials: true }
        ),

        axios.get(
          "https://compliance-analysis-api.onrender.com/api/framework/get",
          { withCredentials: true }
        ),

        axios.get(
          "https://compliance-analysis-api.onrender.com/api/product/getAllproducts",
          { withCredentials: true }
        ),
      ]);

      const reports = reportsRes.data?.data || [];
      const frameworks =
        frameworksRes.data?.data || [];
      const products =
        productsRes.data?.data || [];

      const avgScore =
        reports.length > 0
          ? Math.round(
              reports.reduce(
                (acc, report) =>
                  acc + report.complianceScore,
                0
              ) / reports.length
            )
          : 0;

      const latestReports = reports
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .slice(0, 5);

      setDashboard({
        complianceScore: avgScore,
        frameworksCount: frameworks.length,
        productsCount: products.length,
        reportsCount: reports.length,
        latestReports,
        loading: false,
      });
    } catch (error) {
      console.error(
        "Failed to fetch dashboard:",
        error
      );

      setDashboard((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const statCards = [
    {
      title: "Compliance Score",
      value:
        dashboard.complianceScore > 0
          ? `${dashboard.complianceScore}%`
          : "N/A",
      icon: ShieldCheck,
      color:
        "from-blue-600 to-indigo-600",
      iconColor:
        "text-blue-600 dark:text-blue-400",
      bg:
        "bg-blue-100 dark:bg-blue-500/10",
    },

    {
      title: "Frameworks",
      value: dashboard.frameworksCount,
      icon: ClipboardCheck,
      color:
        "from-emerald-600 to-green-600",
      iconColor:
        "text-emerald-600 dark:text-emerald-400",
      bg:
        "bg-emerald-100 dark:bg-emerald-500/10",
    },

    {
      title: "Products",
      value: dashboard.productsCount,
      icon: Database,
      color:
        "from-purple-600 to-pink-600",
      iconColor:
        "text-purple-600 dark:text-purple-400",
      bg:
        "bg-purple-100 dark:bg-purple-500/10",
    },
  ];

  const getComplianceStatus = () => {
    if (dashboard.complianceScore >= 90) {
      return {
        text: "Excellent",
        color:
          "text-green-600 dark:text-green-400",
        icon: CheckCircle2,
      };
    }

    if (dashboard.complianceScore >= 70) {
      return {
        text: "Moderate",
        color:
          "text-yellow-600 dark:text-yellow-400",
        icon: Clock3,
      };
    }

    return {
      text: "Needs Attention",
      color:
        "text-red-600 dark:text-red-400",
      icon: AlertTriangle,
    };
  };

  const status = getComplianceStatus();
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-[#f5f7fb] dark:bg-[#070b17] text-gray-900 dark:text-white transition-all duration-300">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-3xl rounded-full" />

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 p-4 md:p-8 lg:p-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>

              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Dashboard
                </h1>

                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Real-time compliance monitoring
                </p>
              </div>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              Welcome back,{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {user?.name ||
                  user?.username ||
                  "User"}
              </span>
              . Here's your live compliance
              overview based on actual system
              data.
            </p>
          </div>

          {/* Status */}
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 shadow-lg">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl bg-gray-100 dark:bg-white/10 ${status.color}`}
              >
                <StatusIcon className="w-6 h-6" />
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Compliance Status
                </p>

                <h3
                  className={`font-bold text-lg ${status.color}`}
                >
                  {status.text}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] p-8 md:p-10 mb-10 shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            {/* Left */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-5">
                <Activity className="w-4 h-4" />
                Live Analytics
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Enterprise Compliance
                Intelligence Platform
              </h2>

              <p className="text-gray-400 text-lg mt-5 leading-relaxed">
                Monitor frameworks, products,
                and compliance reports in one
                centralized dashboard powered
                by real-time analytics.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-sm text-gray-400">
                    Reports
                  </p>

                  <h3 className="text-2xl font-bold text-white mt-1">
                    {dashboard.loading
                      ? "..."
                      : dashboard.reportsCount}
                  </h3>
                </div>

                <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-sm text-gray-400">
                    Frameworks
                  </p>

                  <h3 className="text-2xl font-bold text-white mt-1">
                    {dashboard.loading
                      ? "..."
                      : dashboard.frameworksCount}
                  </h3>
                </div>
              </div>
            </div>

            {/* Right Score */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-blue-500/20">
                  {dashboard.loading ? (
                    <Loader2 className="w-14 h-14 text-white animate-spin" />
                  ) : (
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-white">
                        {dashboard.complianceScore}
                      </h1>

                      <p className="text-blue-100 mt-2">
                        Compliance Score
                      </p>
                    </div>
                  )}
                </div>

                <div className="absolute inset-0 rounded-full border-[12px] border-blue-400/20 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {statCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                className="group rounded-3xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">
                      {card.title}
                    </p>

                    {dashboard.loading ? (
                      <Loader2 className="w-10 h-10 animate-spin mt-6 text-gray-400" />
                    ) : (
                      <h2 className="text-5xl font-bold mt-5">
                        {card.value}
                      </h2>
                    )}
                  </div>

                  <div
                    className={`p-4 rounded-2xl ${card.bg}`}
                  >
                    <Icon
                      className={`w-10 h-10 ${card.iconColor}`}
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Real-time synced data
                  </p>

                  <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-white transition" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Reports */}
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold">
                Recent Reports
              </h3>

              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Latest compliance reports from
                your system
              </p>
            </div>

            <Activity className="w-6 h-6 text-blue-500" />
          </div>

          {dashboard.loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
          ) : dashboard.latestReports.length ===
            0 ? (
            <div className="text-center py-16">
              <Database className="w-16 h-16 mx-auto text-gray-400 mb-4" />

              <h4 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                No reports found
              </h4>

              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Your recent compliance reports
                will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboard.latestReports.map(
                (report) => (
                  <div
                    key={report._id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/[0.06] transition"
                  >
                    <div>
                      <h4 className="font-semibold text-lg">
                        {report.product
                          ?.productName ||
                          "Unknown Product"}
                      </h4>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {
                          report.framework
                            ?.name
                        }{" "}
                        (
                        {
                          report.framework
                            ?.shortCode
                        }
                        )
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div
                        className={`px-4 py-2 rounded-xl font-semibold ${
                          report.complianceScore >=
                          90
                            ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                            : report.complianceScore >=
                              70
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                            : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                        }`}
                      >
                        {
                          report.complianceScore
                        }
                        %
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(
                          report.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;