import React, { useState } from 'react';

function Fournisseur({ products, setProducts }) {
  const [selectedProducts, setSelectedProducts] = useState([]); // Track selected products
  const [supplierName, setSupplierName] = useState(""); // Input field for supplier name

  // Handle product selection
  const handleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId) // Remove product from selection
        : [...prev, productId] // Add product to selection
    );
  };

  // Handle assigning the supplier to selected products
  const handleAssignSupplier = () => {
    if (supplierName.trim() !== "") {
      setProducts((prev) =>
        prev.map((product) =>
          selectedProducts.includes(product.id)
            ? { ...product, supplier: supplierName } // Assign the supplier name
            : product
        )
      );
      setSelectedProducts([]); // Clear the selection after assignment
      setSupplierName(""); // Clear the input field
    } else {
      alert("Please enter a supplier name.");
    }
  };

  return (
    <div className="Fournisseur" style={{ display: "flex", gap: "20px" }}>
      {/* Supplier Assignment Form */}
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
          Ajouter un fournisseur
        </h2>
        <input
          type="text"
          name="supplierName"
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
          placeholder="Nom du fournisseur"
          style={inputStyle}
        />
        <button onClick={handleAssignSupplier} style={buttonStyle}>
          Assigner Fournisseur
        </button>
      </div>

      {/* Product Table */}
      <div style={{ width: "70%" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={tableHeaderCellStyle}>Sélectionner</th>
              <th style={tableHeaderCellStyle}>Nom du produit</th>
              <th style={tableHeaderCellStyle}>Nom du fournisseur</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={tableCellStyle}>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleProductSelection(product.id)}
                  />
                </td>
                <td style={tableCellStyle}>{product.name}</td>
                <td style={tableCellStyle}>{product.supplier || "Non assigné"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Styles for the input, button, and table
const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  fontWeight: "bold",
  borderRadius: "15px",
  border: "none",
  background: "#007bff",
  cursor: "pointer",
   color: "#fff"
//   transition: "all 0.3s ease",
//   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
};

const inputStyle = {
  width: "100%",
  marginBottom: "15px",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ddd",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "14px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
};

const tableHeaderStyle = {
  background: "#343a40",
  color: "#fff",
};

const tableHeaderCellStyle = {
  padding: "10px",
  textAlign: "center",
  borderBottom: "1px solid #ddd",
};

const tableCellStyle = {
  padding: "10px",
  textAlign: "center",
  borderBottom: "1px solid #ddd",
};

export default Fournisseur;
