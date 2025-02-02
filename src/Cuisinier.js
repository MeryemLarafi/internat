import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Cuisinier({ products }) {
  const [search, setSearch] = useState(""); // Search filter by product name
  const [selectedProduct, setSelectedProduct] = useState(null); // Selected product for quantity input
  const [quantityToUse, setQuantityToUse] = useState(0); // Quantity input for reduction
  const [usedProducts, setUsedProducts] = useState([]); // Track used products within Cuisinier only
  const [selectedDate, setSelectedDate] = useState(null); // Date to filter by

  // Load usedProducts from localStorage on component mount
  useEffect(() => {
    const storedUsedProducts = JSON.parse(localStorage.getItem("usedProducts"));
    if (storedUsedProducts) {
      setUsedProducts(storedUsedProducts);
    }
  }, []);

  // Save updated usedProducts to localStorage whenever it changes
  useEffect(() => {
    if (usedProducts.length > 0) {
      localStorage.setItem("usedProducts", JSON.stringify(usedProducts));
    }
  }, [usedProducts]);

  // Filter products based on search input and selected date
  const filteredProducts = products.filter((product) => {
    const usedProduct = usedProducts.find((used) => used.id === product.id);
    const availableQuantity = usedProduct
      ? usedProduct.availableQuantity
      : product.quantity;

    // Filter by product name and date
    const dateMatches =
      !selectedDate ||
      (usedProduct && usedProduct.datesUsed.includes(selectedDate.toLocaleDateString()));

    return (
      availableQuantity >= 0 &&
      product.name.toLowerCase().startsWith(search.toLowerCase()) &&
      dateMatches
    );
  });

  // Function to handle reducing quantity in the Cuisinier table only
  const handleQuantityDecrease = (productId) => {
    const selected = products.find((product) => product.id === productId);
    const usedProduct = usedProducts.find((used) => used.id === selected.id);
    const availableQuantity = usedProduct
      ? usedProduct.availableQuantity
      : selected.quantity;

    if (quantityToUse <= 0 || quantityToUse > availableQuantity) {
      alert(
        "Quantité invalide. Veuillez entrer une quantité supérieure à zéro et inférieure ou égale à la quantité disponible."
      );
      setQuantityToUse(0);
      return;
    }

    const currentDate = new Date().toLocaleDateString(); // Current date

    if (usedProduct) {
      const updatedUsedProducts = usedProducts.map((used) =>
        used.id === selected.id
          ? {
              ...used,
              usedQuantity: used.usedQuantity + quantityToUse,
              availableQuantity: availableQuantity - quantityToUse,
              datesUsed: [...(used.datesUsed || []), currentDate],
            }
          : used
      );
      setUsedProducts(updatedUsedProducts);
    } else {
      const newUsedProduct = {
        ...selected,
        usedQuantity: quantityToUse,
        availableQuantity: availableQuantity - quantityToUse,
        datesUsed: [currentDate],
      };
      setUsedProducts([...usedProducts, newUsedProduct]);
    }

    setQuantityToUse(0);
    setSelectedProduct(null);
  };

  // Helper function to get product status
  const getStatus = (product) => {
    const usedProduct = usedProducts.find((used) => used.id === product.id);
    const remainingQuantity = usedProduct
      ? usedProduct.availableQuantity
      : product.quantity;

    if (remainingQuantity <= 0) {
      return {
        status: "🛑 La quantité est terminée",
        bgColor: "#ffe6e6",
        textColor: "#cc0000",
      };
    } else if (remainingQuantity <= 5) {
      return {
        status: "⚠️ La quantité est proche de la fin",
        bgColor: "#fff8e5",
        textColor: "#cc7a00",
      };
    } else {
      return {
        status: "✅ Valide",
        bgColor: "#ffffff",
        textColor: "#008000",
      };
    }
  };

  return (
    <div className="Cuisinier" style={{ padding: "20px", display: "flex", gap: "20px" }}>
      <div
        style={{
          width: "30%",
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#343a40" }}>
          Utiliser un produit
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="text"
            placeholder="Rechercher un produit"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              width: "100%",
            }}
          />
          <FaSearch style={{ cursor: "pointer", fontSize: "20px" }} />
        </div>
        <div style={{ marginTop: "20px" }}>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            placeholderText="Sélectionner une date"
            dateFormat="dd/MM/yyyy"
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              width: "100%",
            }}
          />
        </div>
        {selectedProduct && (
          <div style={{ marginTop: "20px" }}>
            <h3>{selectedProduct.name}</h3>
            <p>
              Quantité disponible en Cuisinier:{" "}
              {(() => {
                const usedProduct = usedProducts.find(
                  (used) => used.id === selectedProduct.id
                );
                return usedProduct
                  ? usedProduct.availableQuantity
                  : selectedProduct.quantity;
              })()}
            </p>
            <input
              type="number"
              placeholder="Quantité à utiliser"
              value={quantityToUse}
              onChange={(e) =>
                setQuantityToUse(Math.max(0, parseInt(e.target.value) || 0))
              }
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            />
            <button
              onClick={() => handleQuantityDecrease(selectedProduct.id)}
              style={buttonStyle}
            >
              Utiliser
            </button>
          </div>
        )}
      </div>
      <div style={{ width: "70%" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr style={{ background: "#343a40", color: "#fff" }}>
              <th style={tableHeaderStyle}>Nom</th>
              <th style={tableHeaderStyle}>Quantité disponible</th>
              <th style={tableHeaderStyle}>Quantité utilisée</th>
              <th style={tableHeaderStyle}>État</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              const { status, bgColor, textColor } = getStatus(p);
              const usedProduct = usedProducts.find((used) => used.id === p.id);
              const usedQuantity = usedProduct ? usedProduct.usedQuantity : 0;
              const availableQuantity = usedProduct
                ? usedProduct.availableQuantity
                : p.quantity;

              return (
                <tr
                  key={p.id}
                  style={{
                    backgroundColor: bgColor,
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <td style={tableCellStyle}>{p.name}</td>
                  <td style={tableCellStyle}>
                    {availableQuantity} {p.unit}
                  </td>
                  <td style={tableCellStyle}>{usedQuantity}</td>
                  <td style={tableCellStyle}>
                    <span style={{ color: textColor, fontWeight: "bold" }}>
                      {status}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div
                      style={{ display: "flex", justifyContent: "center", gap: "10px" }}
                    >
                      <button
                        onClick={() => setSelectedProduct(p)}
                        style={{
                          ...iconButtonStyle,
                          backgroundColor: availableQuantity <= 0 ? "#ccc" : "#007bff",
                          cursor: availableQuantity <= 0 ? "not-allowed" : "pointer",
                        }}
                        disabled={availableQuantity <= 0}
                      >
                        Sélectionner
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const buttonStyle = {
  width: "100%",
  padding: "10px",
  background: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
const tableHeaderStyle = {
  padding: "10px",
  textAlign: "center",
  borderBottom: "1px solid #ddd",
};
const tableCellStyle = {
  padding: "10px",
  textAlign: "center",
  borderBottom: "1px solid #ddd",
};
const iconButtonStyle = {
  padding: "10px",
  background: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Cuisinier;
