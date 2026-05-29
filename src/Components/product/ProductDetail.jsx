import {
  ArrowLeft,
  Building2,
  Globe,
  Package,
  ShieldCheck,
  FileText,
  ImageIcon,
} from "lucide-react";

function InfoCard({
  title,
  value,
  icon: Icon,
}) {
  return (
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
}

export default function ProductDetail({
  product,
  onBack,
}) {
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
          {/* GLOW */}

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
          {/* LEFT SIDE */}

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

            {/* REGULATORY INFORMATION */}

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
                    product.regulatory
                      ?.deviceClass
                  }
                  icon={ShieldCheck}
                />

                <InfoCard
                  title="Intended Use"
                  value={
                    product.regulatory
                      ?.intendedUse
                  }
                  icon={Package}
                />

                <InfoCard
                  title="Risk Category"
                  value={
                    product.regulatory
                      ?.riskCategory ||
                    "Low"
                  }
                  icon={ShieldCheck}
                />

                <InfoCard
                  title="Markets"
                  value={
                    product.regulatory
                      ?.market?.join(
                        ", "
                      ) || "N/A"
                  }
                  icon={Globe}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}

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
}