import {
  Search,
  Plus,
  Loader2,
  Package,
  Building2,
} from "lucide-react";

export default function ProductList({
  products,
  loading,
  organizations,
  selectedOrgId,
  setSelectedOrgId,
  searchQuery,
  setSearchQuery,
  onSelect,
  onCreate,
}) {
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
            onClick={onCreate}
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

          {/* ORGANIZATION FILTER */}

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

            {organizations.map((org) => (
              <option
                key={org._id}
                value={org._id}
              >
                {org.legalName}
              </option>
            ))}
          </select>
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          </div>
        ) : products.length === 0 ? (
          /* EMPTY STATE */

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
              Try adjusting your search
              or add a new product.
            </p>
          </div>
        ) : (
          /* PRODUCT GRID */

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() =>
                  onSelect(product)
                }
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

                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <Building2 className="w-4 h-4" />

                      <span>
                        {product.orgName}
                      </span>
                    </div>
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
                    {product.productCode}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}