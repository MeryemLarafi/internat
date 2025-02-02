import React, { useState } from "react";
import StockGlobal from "./StockGlobal";
import Cuisinier from "./Cuisinier";
import Fournisseur from "./Fournisseur"; // Import Fournisseur page

function App() {
  const [products, setProducts] = useState([]); // Shared products state
  const [showStockGlobal, setShowStockGlobal] = useState(true);
  const [showCuisinier, setShowCuisinier] = useState(false);
  const [showFournisseur, setShowFournisseur] = useState(false); // Add state for Fournisseur page

  return (
    <div className="App" style={{ textAlign: "center", padding: "20px" }}>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <button
          onClick={() => {
            setShowStockGlobal(true);
            setShowCuisinier(false);
            setShowFournisseur(false);
          }}
          style={{
            ...buttonStyle,
            background: showStockGlobal
              ? "linear-gradient(45deg, #007bff, #0056b3)"
              : "#f8f9fa",
            color: showStockGlobal ? "#fff" : "#343a40",
            border: showStockGlobal ? "none" : "1px solid #ddd",
          }}
        >
          Page Stock Global
        </button>
        <button
          onClick={() => {
            setShowStockGlobal(false);
            setShowCuisinier(true);
            setShowFournisseur(false);
          }}
          style={{
            ...buttonStyle,
            background: showCuisinier
              ? "linear-gradient(45deg, #007bff, #0056b3)"
              : "#f8f9fa",
            color: showCuisinier ? "#fff" : "#343a40",
            border: showCuisinier ? "none" : "1px solid #ddd",
          }}
        >
          Page Cuisinier
        </button>
        <button
          onClick={() => {
            setShowStockGlobal(false);
            setShowCuisinier(false);
            setShowFournisseur(true); // Show Fournisseur page
          }}
          style={{
            ...buttonStyle,
            background: showFournisseur
              ? "linear-gradient(45deg, #007bff, #0056b3)"
              : "#f8f9fa",
            color: showFournisseur ? "#fff" : "#343a40",
            border: showFournisseur ? "none" : "1px solid #ddd",
          }}
        >
          Page Fournisseur
        </button>
      </div>

      {/* Render the selected page based on the state */}
      {showStockGlobal && <StockGlobal products={products} setProducts={setProducts} />}
      {showCuisinier && <Cuisinier products={products} setProducts={setProducts} />}
      {showFournisseur && <Fournisseur products={products} setProducts={setProducts} />} {/* Render Fournisseur */}
    </div>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  fontWeight: "bold",
  borderRadius: "25px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
};

export default App;
