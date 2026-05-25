import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  ArrowLeft,
  Building2,
  Globe,
  Loader2,
  Package,
  ShieldCheck,
  FileText,
  ImageIcon,
} from "lucide-react";

import api from "./api/api.js";
import AddProducts from "./Components/AddProducts.jsx";

function Products() {
  const [activeTab, setActiveTab] =
    useState("my-products");

  const [view, setView] =
    useState("list");

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [organizations, setOrganizations] =
    useState([]);

  const [selectedOrgId, setSelectedOrgId] =
    useState("all");

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  // ================= FETCH ORGANIZATIONS =================

  const fetchOrganizations = async () => {
    try {
      const res = await api.get(
        "/organization/show"
      );

      setOrganizations(
        res.data.data || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  // ================= FETCH PRODUCTS =================

  const fetchAllProducts = async () => {
    setLoading(true);

    try {
      const orgsRes = await api.get(
        "/organization/show"
      );

      const orgs =
        orgsRes.data.data || [];

      const allProducts = [];

      for (const org of orgs) {
        try {
          const productRes =
            await api.get(
              `/product/getbycompany/${org._id}`
            );

          const normalizedProducts =
            (
              productRes.data.data || []
            ).map((p) => ({
              ...p,

              productCode:
                p.productCode ||
                p.productcode ||
                "N/A",

              orgName:
                org.legalName ||
                "Unknown Organization",
            }));

          allProducts.push(
            ...normalizedProducts
          );
        } catch (error) {
          console.log(
            `No products for ${org.legalName}`
          );
        }
      }

      setProducts(allProducts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
    fetchAllProducts();
  }, []);

  // ================= FILTER PRODUCTS =================

  const filteredProducts =
    products.filter((p) => {
      const productName =
        p.productName?.toLowerCase() ||
        "";

      const productCode =
        p.productCode?.toLowerCase() ||
        "";

      const search =
        searchQuery.toLowerCase();

      const matchesSearch =
        productName.includes(search) ||
        productCode.includes(search);

      const matchesOrg =
        selectedOrgId === "all" ||
        p.company === selectedOrgId;

      return (
        matchesSearch && matchesOrg
      );
    });

  // ================= INFO CARD =================

  const InfoCard = ({
    title,
    value,
    icon: Icon,
  }) => (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        dark:border-white/10
        bg-gray-50
        dark:bg-white/[0.03]
        p-5
      "
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="
            w-10
            h-10
            rounded-xl
            bg-blue-100
            dark:bg-blue-500/10
            flex
            items-center
            justify-center
          "
        >
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </p>
      </div>

      <h3 className="font-semibold text-lg break-words">
        {value || "N/A"}
      </h3>
    </div>
  );

  // ================= DETAILS PAGE =================

  const ProductDetails = ({
    product,
    onBack,
  }) => {
    return (
      <div className="min-h-screen bg-[#f4f7fb] dark:bg-[#070b17] text-gray-900 dark:text-white">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* BACK BUTTON */}

          <button
            onClick={onBack}
            className="
              inline-flex
              items-center
              gap-2
              px-5
              py-3
              rounded-2xl
              bg-white
              dark:bg-white/[0.04]
              border
              border-gray-200
              dark:border-white/10
              hover:scale-105
              transition-all
              duration-300
              mb-8
            "
          >
            <ArrowLeft className="w-4 h-4" />
            Back To Products
          </button>

          {/* HERO SECTION */}

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-gray-200
              dark:border-white/10
              bg-white
              dark:bg-white/[0.04]
              backdrop-blur-xl
              shadow-2xl
              mb-8
            "
          >
            {/* Glow */}

            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full" />

            <div className="relative p-6 md:p-10">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
                {/* LEFT */}

                <div className="flex items-start gap-5">
                  <div
                    className="
                      w-20
                      h-20
                      rounded-3xl
                      bg-gradient-to-br
                      from-blue-600
                      to-indigo-600
                      flex
                      items-center
                      justify-center
                      text-white
                      text-3xl
                      font-bold
                      shadow-xl
                      shrink-0
                    "
                  >
                    {product.productName?.charAt(
                      0
                    )}
                  </div>

                  <div>
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                      {product.productName}
                    </h1>

                    <div className="flex flex-wrap gap-4 mt-5">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Package className="w-5 h-5" />

                        <span>
                          {
                            product.productType
                          }
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Building2 className="w-5 h-5" />

                        <span>
                          {product.orgName}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">
                        Product Code
                      </p>

                      <h3 className="text-xl font-semibold">
                        {
                          product.productCode
                        }
                      </h3>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}

                <div
                  className="
                    rounded-3xl
                    border
                    border-gray-200
                    dark:border-white/10
                    bg-gray-50
                    dark:bg-white/[0.03]
                    p-6
                    min-w-[280px]
                  "
                >
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-6 h-6 text-blue-500" />

                    <h3 className="text-xl font-bold">
                      Product Summary
                    </h3>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {
                      product.description
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT GRID */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* LEFT */}

            <div className="xl:col-span-2 space-y-8">
              {/* DESCRIPTION */}

              <div
                className="
                  rounded-3xl
                  bg-white
                  dark:bg-white/[0.04]
                  border
                  border-gray-200
                  dark:border-white/10
                  p-8
                  shadow-lg
                "
              >
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-blue-500" />

                  <h2 className="text-2xl font-bold">
                    Description
                  </h2>
                </div>

                <p className="leading-8 text-gray-600 dark:text-gray-300">
                  {product.description ||
                    "No description available for this product."}
                </p>
              </div>

              {/* REGULATORY */}

              <div
                className="
                  rounded-3xl
                  bg-white
                  dark:bg-white/[0.04]
                  border
                  border-gray-200
                  dark:border-white/10
                  p-8
                  shadow-lg
                "
              >
                <div className="flex items-center gap-3 mb-8">
                  <ShieldCheck className="w-6 h-6 text-blue-500" />

                  <h2 className="text-2xl font-bold">
                    Regulatory Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InfoCard
                    title="Device Class"
                    value={
                      product
                        .regulatory
                        ?.deviceClass
                    }
                    icon={ShieldCheck}
                  />

                  <InfoCard
                    title="Intended Use"
                    value={
                      product
                        .regulatory
                        ?.intendedUse
                    }
                    icon={Package}
                  />

                  <InfoCard
                    title="Risk Category"
                    value={
                      product
                        .regulatory
                        ?.riskCategory ||
                      "Low"
                    }
                    icon={ShieldCheck}
                  />

                  <InfoCard
                    title="Markets"
                    value={
                      product
                        .regulatory
                        ?.market?.join(
                          ", "
                        ) || "N/A"
                    }
                    icon={Globe}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <div className="space-y-8">
              {/* PRODUCT IMAGES */}

              <div
                className="
                  rounded-3xl
                  bg-white
                  dark:bg-white/[0.04]
                  border
                  border-gray-200
                  dark:border-white/10
                  p-8
                  shadow-lg
                "
              >
                <div className="flex items-center gap-3 mb-6">
                  <ImageIcon className="w-6 h-6 text-blue-500" />

                  <h2 className="text-2xl font-bold">
                    Product Assets
                  </h2>
                </div>

                {product.images?.length >
                0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {product.images.map(
                      (img, i) => (
                        <img
                          key={i}
                          src={img.url}
                          alt="product"
                          className="
                            w-full
                            h-40
                            object-cover
                            rounded-2xl
                            border
                            border-gray-200
                            dark:border-white/10
                          "
                        />
                      )
                    )}
                  </div>
                ) : (
                  <div
                    className="
                      rounded-2xl
                      border
                      border-dashed
                      border-gray-300
                      dark:border-white/10
                      p-10
                      text-center
                    "
                  >
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />

                    <p className="text-gray-500 dark:text-gray-400">
                      No product assets available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ================= DETAILS VIEW =================

  if (
    view === "detail" &&
    selectedProduct
  ) {
    return (
      <ProductDetails
        product={selectedProduct}
        onBack={() =>
          setView("list")
        }
      />
    );
  }

  // ================= MAIN PAGE =================

  return (
    <div className="min-h-screen bg-[#f4f7fb] dark:bg-[#070b17] text-gray-900 dark:text-white transition-all duration-300">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* HEADER */}

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">
              Product Portfolio
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">
              Enterprise inventory
              management system
            </p>
          </div>

          <button
            onClick={() =>
              setActiveTab(
                "add-product"
              )
            }
            className="
              inline-flex
              items-center
              gap-2
              px-6
              py-4
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              hover:scale-105
              text-white
              font-semibold
              shadow-xl
              transition-all
              duration-300
            "
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* TABS */}

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() =>
              setActiveTab(
                "my-products"
              )
            }
            className={`
              px-5
              py-3
              rounded-2xl
              font-medium
              transition-all
              duration-300
              ${
                activeTab ===
                "my-products"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10"
              }
            `}
          >
            Products
          </button>

          <button
            onClick={() =>
              setActiveTab(
                "add-product"
              )
            }
            className={`
              px-5
              py-3
              rounded-2xl
              font-medium
              transition-all
              duration-300
              ${
                activeTab ===
                "add-product"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10"
              }
            `}
          >
            Add Product
          </button>
        </div>

        {activeTab ===
        "my-products" ? (
          <>
            {/* FILTERS */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
              {/* SEARCH */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-white/10
                  bg-white
                  dark:bg-white/[0.04]
                  px-5
                  py-4
                "
              >
                <Search className="w-5 h-5 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    bg-transparent
                    outline-none
                  "
                />
              </div>

              {/* ORG FILTER */}

              <select
                value={selectedOrgId}
                onChange={(e) =>
                  setSelectedOrgId(
                    e.target.value
                  )
                }
                className="
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-white/10
                  bg-white
                  dark:bg-white/[0.04]
                  px-5
                  py-4
                  outline-none
                "
              >
                <option value="all">
                  All Organizations
                </option>

                {organizations.map(
                  (org) => (
                    <option
                      key={org._id}
                      value={org._id}
                    >
                      {
                        org.legalName
                      }
                    </option>
                  )
                )}
              </select>
            </div>

            {/* LOADING */}

            {loading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
              </div>
            ) : filteredProducts.length ===
              0 ? (
              <div
                className="
                  rounded-3xl
                  border
                  border-gray-200
                  dark:border-white/10
                  bg-white
                  dark:bg-white/[0.04]
                  p-16
                  text-center
                "
              >
                <Package className="w-20 h-20 mx-auto text-gray-400 mb-5" />

                <h3 className="text-3xl font-bold">
                  No Products Found
                </h3>

                <p className="text-gray-500 dark:text-gray-400 mt-3">
                  Try adjusting your
                  search or add a new
                  product.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map(
                  (product) => (
                    <div
                      key={
                        product._id
                      }
                      onClick={() => {
                        setSelectedProduct(
                          product
                        );

                        setView(
                          "detail"
                        );
                      }}
                      className="
                        group
                        relative
                        overflow-hidden
                        rounded-3xl
                        border
                        border-gray-200
                        dark:border-white/10
                        bg-white
                        dark:bg-white/[0.04]
                        backdrop-blur-xl
                        p-6
                        shadow-lg
                        hover:shadow-2xl
                        hover:-translate-y-2
                        transition-all
                        duration-500
                        cursor-pointer
                      "
                    >
                      {/* TOP */}

                      <div className="flex items-start gap-4 mb-5">
                        <div
                          className="
                            w-14
                            h-14
                            rounded-2xl
                            bg-gradient-to-br
                            from-blue-600
                            to-indigo-600
                            flex
                            items-center
                            justify-center
                            text-white
                            text-xl
                            font-bold
                            shrink-0
                          "
                        >
                          {product.productName?.charAt(
                            0
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-xl font-bold line-clamp-1">
                            {
                              product.productName
                            }
                          </h3>

                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {
                              product.orgName
                            }
                          </p>
                        </div>
                      </div>

                      {/* DESCRIPTION */}

                      <p className="text-sm leading-7 text-gray-600 dark:text-gray-300 line-clamp-3 min-h-[84px]">
                        {product.description ||
                          "No description available."}
                      </p>

                      {/* FOOTER */}

                      <div className="mt-6 pt-5 border-t border-gray-200 dark:border-white/10">
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                          Product Code
                        </p>

                        <h4 className="font-semibold text-lg">
                          {
                            product.productcode
                          }
                        </h4>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </>
        ) : (
          <AddProducts />
        )}
      </div>
    </div>
  );
}

export default Products;