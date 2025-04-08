import React, { useState } from "react";
import StockGlobal from "./StockGlobal";
import Cuisinier from "./Cuisinier";
import Fournisseur from "./Fournisseur";

function App() {
  const [products, setProducts] = useState([]);
  const [showStockGlobal, setShowStockGlobal] = useState(true);
  const [showCuisinier, setShowCuisinier] = useState(false);
  const [showFournisseur, setShowFournisseur] = useState(false);

  return (
    <div className="App" style={{ minHeight: "100vh", paddingTop: "80px" }}>
      {/* Top Navigation */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: "70px",
          right: 0,
          background: "white",
          padding: "20px",
          display: "flex",
          gap: "15px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          zIndex: 100,
        }}
      >
        <button
          onClick={() => {
            setShowStockGlobal(true);
            setShowCuisinier(false);
            setShowFournisseur(false);
          }}
          style={{
            ...navButtonStyle,
            background: showStockGlobal ? "#4a5568" : "#f1f1f1",
            color: showStockGlobal ? "white" : "#333",
          }}
        >
          Stock Global
        </button>
        <button
          onClick={() => {
            setShowStockGlobal(false);
            setShowCuisinier(true);
            setShowFournisseur(false);
          }}
          style={{
            ...navButtonStyle,
            background: showCuisinier ? "#4a5568" : "#f1f1f1",
            color: showCuisinier ? "white" : "#333",
          }}
        >
          Cuisine
        </button>
        <button
          onClick={() => {
            setShowStockGlobal(false);
            setShowCuisinier(false);
            setShowFournisseur(true);
          }}
          style={{
            ...navButtonStyle,
            background: showFournisseur ? "#4a5568" : "#f1f1f1",
            color: showFournisseur ? "white" : "#333",
          }}
        >
          Fournisseurs
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: "20px" }}>
        {showStockGlobal && <StockGlobal products={products} setProducts={setProducts} />}
        {showCuisinier && <Cuisinier products={products} setProducts={setProducts} />}
        {showFournisseur && <Fournisseur products={products} setProducts={setProducts} />}
      </div>
    </div>
  );
}

const navButtonStyle = {
  padding: "12px 24px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "500",
  transition: "all 0.3s ease",
  fontFamily: "'Poppins', sans-serif",
};

export default App;