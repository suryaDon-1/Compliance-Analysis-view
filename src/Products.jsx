import { useEffect, useMemo, useState } from "react";

import api from "./api/api";
import ProductDetail from "./Components/product/ProductDetail.jsx";
import ProductList from "./Components/product/ProductList.jsx";
import AddProducts from "./Components/product/AddProducts.jsx";

export default function Products() {
  const [view, setView] = useState("list");

  const [products, setProducts] = useState([]);

  const [organizations, setOrganizations] = useState([]);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [selectedOrgId, setSelectedOrgId] =
    useState("all");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [loading, setLoading] =
    useState(false);

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
      console.log(error);
    }
  };

  // ================= FETCH PRODUCTS =================

  const fetchProducts = async () => {
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

  // ================= INITIAL LOAD =================

  useEffect(() => {
    fetchOrganizations();
    fetchProducts();
  }, []);

  // ================= FILTER PRODUCTS =================

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const productName =
        p.productName?.toLowerCase() || "";

      const productCode =
        p.productCode?.toLowerCase() || "";

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
  }, [
    products,
    searchQuery,
    selectedOrgId,
  ]);

  // ================= HANDLERS =================

  const handleSelectProduct = (
    product
  ) => {
    setSelectedProduct(product);

    setView("detail");
  };

  const handleCreateProduct = () => {
    setView("create");
  };

  const handleBackToList = () => {
    setView("list");
  };

  // ================= DETAIL VIEW =================

  if (
    view === "detail" &&
    selectedProduct
  ) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={handleBackToList}
      />
    );
  }

  // ================= CREATE VIEW =================

  if (view === "create") {
    return (
      <AddProducts
        onSuccess={() => {
          fetchProducts();

          setView("list");
        }}
        onBack={handleBackToList}
      />
    );
  }

  // ================= LIST VIEW =================

  return (
    <ProductList
      products={filteredProducts}
      loading={loading}
      organizations={organizations}
      selectedOrgId={selectedOrgId}
      setSelectedOrgId={
        setSelectedOrgId
      }
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onSelect={handleSelectProduct}
      onCreate={handleCreateProduct}
    />
  );
}