import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles } from "lucide-react";

const ComplianceEngine = () => {
  const [products, setProducts] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedFramework, setSelectedFramework] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productRes, frameworkRes] = await Promise.all([
        axios.get("http://localhost:5000/api/product/getAllproducts", {
          withCredentials: true,
        }),
        axios.get("http://localhost:5000/api/framework/get", {
          withCredentials: true,
        }),
      ]);

      setProducts(productRes.data?.data || []);
      setFrameworks(frameworkRes.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products and frameworks");
    }
  };

  const handleAnalyze = async () => {
    if (!selectedProduct || !selectedFramework) {
      toast.warning("Please select both a Product and a Framework");
      return;
    }

    setLoading(true);
    setReport("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/complince/analyze",
        {
          productId: selectedProduct,
          frameworkId: selectedFramework,
        },
        { withCredentials: true }
      );

      setReport(response.data?.data?.report);
      toast.success("Compliance report generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-blue-600 dark:text-blue-400 w-8 h-8" />
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            Compliance Engine
          </h1>
        </div>

        <p className="text-gray-600 dark:text-gray-400">
          Select a product and a regulatory framework to perform an AI-powered RAG analysis.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Controls */}
        <div className="md:col-span-4">
          <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 sticky top-5 border border-gray-100 dark:border-gray-800">

            <h2 className="text-xl font-semibold mb-6">
              Analysis Parameters
            </h2>

            {/* Product */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Product
              </label>

              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
              >
                <option value="">Choose Product</option>

                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.productName}
                  </option>
                ))}
              </select>
            </div>

            {/* Framework */}
            <div className="mb-8">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Framework
              </label>

              <select
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
              >
                <option value="">Choose Framework</option>

                {frameworks.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name} ({f.shortcode})
                  </option>
                ))}
              </select>
            </div>

            {/* Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !selectedProduct || !selectedFramework}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-white font-medium transition-all duration-200
                ${
                  loading || !selectedProduct || !selectedFramework
                    ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg"
                }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Report...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Compliance
                </>
              )}
            </button>
          </div>
        </div>

        {/* Report */}
        <div className="md:col-span-8">
          <div
            className={`rounded-2xl shadow-lg p-8 min-h-[60vh] border transition-colors duration-300
            ${
              report
                ? "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"
                : "bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
            }`}
          >

            {/* Empty */}
            {!report && !loading && (
              <div className="m-auto text-center opacity-70">
                <Sparkles className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />

                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                  Ready for Analysis
                </h2>

                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Configure your parameters on the left and run the AI engine.
                </p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="m-auto text-center">
                <div className="w-14 h-14 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-5"></div>

                <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 animate-pulse">
                  Querying Vector Database & Analyzing...
                </h2>
              </div>
            )}

            {/* Report */}
            {report && !loading && (
              <div>
                <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-2">
                  AI Compliance Analysis Report
                </h2>

                <hr className="mb-6 border-gray-300 dark:border-gray-700" />

                <div
                  className="
                    prose prose-lg max-w-none
                    dark:prose-invert
                    prose-headings:text-blue-900 dark:prose-headings:text-blue-300
                    prose-p:text-gray-700 dark:prose-p:text-gray-300
                    prose-li:text-gray-700 dark:prose-li:text-gray-300
                    prose-strong:text-black dark:prose-strong:text-white
                  "
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {report}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceEngine;