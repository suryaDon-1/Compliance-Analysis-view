import {useEffect, useState} from "react";



import {
  Assessment,
  Shield,
  ArrowBack,
  CheckCircle,
  Cancel,
  WarningAmber,
} from "@mui/icons-material";

import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";
import api from "./api/api.js";

export default function Reports() {
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const response = await api.get("/complince/get-reports");

      setReports(response.data?.data || []);
    } catch (error) {
      console.log(error);

      alert("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const getScoreStyles = (score) => {
    if (score >= 90) {
      return {
        bg: "bg-green-100 dark:bg-green-500/20",
        text: "text-green-700 dark:text-green-300",
      };
    }

    if (score >= 75) {
      return {
        bg: "bg-yellow-100 dark:bg-yellow-500/20",
        text: "text-yellow-700 dark:text-yellow-300",
      };
    }

    return {
      bg: "bg-red-100 dark:bg-red-500/20",
      text: "text-red-700 dark:text-red-300",
    };
  };

  const getStatusIcon = (status) => {
    if (status === "pass") {
      return <CheckCircle className="text-green-500" />;
    }

    if (status === "partial") {
      return <WarningAmber className="text-yellow-500" />;
    }

    return <Cancel className="text-red-500" />;
  };

  // Stats
  const totalReports = reports.length;

  const avgScore =
    reports.length > 0
      ? Math.round(
          reports.reduce((acc, r) => acc + r.complianceScore, 0) /
            reports.length,
        )
      : 0;

  const compliantCount = reports.filter((r) => r.complianceScore >= 90).length;

  // =========================
  // SINGLE REPORT PAGE
  // =========================
  if (selectedReport) {
    const scoreStyle = getScoreStyles(selectedReport.complianceScore);

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-white p-6">
        {/* Back */}
        <button
          onClick={() => setSelectedReport(null)}
          className="flex items-center gap-2 mb-8 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:shadow-md transition"
        >
          <ArrowBack />
          Back to Reports
        </button>

        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl p-8 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                <Shield className="text-blue-600 dark:text-blue-300" />
              </div>

              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {selectedReport.product?.productName}
                </h1>

                <p className="text-gray-500 dark:text-slate-400">
                  {selectedReport.framework?.name} (
                  {selectedReport.framework?.shortCode})
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  Generated on{" "}
                  {new Date(selectedReport.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div
              className={`px-6 py-3 rounded-2xl text-xl font-bold ${scoreStyle.bg} ${scoreStyle.text}`}
            >
              {selectedReport.complianceScore}%
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>

          <p className="text-gray-700 dark:text-slate-300 leading-7">
            {selectedReport.summary}
          </p>
        </div>

        {/* Recommendations */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-5">Recommendations</h2>

          <div className="space-y-4">
            {selectedReport.recommendations?.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Controls Analysis */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Controls Analysis</h2>

          <div className="space-y-5">
            {selectedReport.analysis?.map((control, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-slate-700 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{control.title}</h3>

                    <p className="text-sm text-gray-500">{control.controlId}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusIcon(control.status)}

                    <span className="capitalize font-semibold">
                      {control.status}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-slate-300 leading-7">
                  {control.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Markdown Report */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Detailed AI Report</h2>

          <div
            className="
              prose
              prose-lg
              dark:prose-invert
              max-w-none
              break-words
            "
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {selectedReport.reportMarkdown}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // REPORT LIST PAGE
  // =========================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-white p-6">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
            <Assessment className="text-blue-600 dark:text-blue-300" />
          </div>

          <div>
            <h1 className="text-4xl font-bold">Compliance Reports</h1>

            <p className="text-gray-500 dark:text-slate-400 mt-1">
              Historical AI-generated compliance reports.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
          <h2 className="text-4xl font-bold">
            {loading ? "..." : totalReports}
          </h2>

          <p className="text-gray-500 dark:text-slate-400 mt-2">
            Total Reports
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
          <h2 className="text-4xl font-bold">
            {loading ? "..." : `${avgScore}%`}
          </h2>

          <p className="text-gray-500 dark:text-slate-400 mt-2">
            Average Compliance Score
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
          <h2 className="text-4xl font-bold">
            {loading ? "..." : compliantCount}
          </h2>

          <p className="text-gray-500 dark:text-slate-400 mt-2">
            Highly Compliant Products
          </p>
        </div>
      </div>

      {/* Reports */}
      {loading ? (
        <div className="flex justify-center items-center h-72">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl p-12 text-center">
          <h3 className="text-2xl font-bold mb-3">No Reports Found</h3>

          <p className="text-gray-500 dark:text-slate-400">
            Generate your first compliance report.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reports.map((report) => {
            const scoreStyle = getScoreStyles(report.complianceScore);

            return (
              <div
                key={report._id}
                onClick={() => setSelectedReport(report)}
                className="cursor-pointer bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {report.product?.productName}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {report.framework?.name} ({report.framework?.shortCode})
                    </p>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${scoreStyle.bg} ${scoreStyle.text}`}
                  >
                    {report.complianceScore}%
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-3 mb-4">
                  {report.summary}
                </p>

                <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {new Date(report.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}