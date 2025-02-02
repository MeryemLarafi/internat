import React, { useState } from "react";
import { FaSearch, FaEye, FaEdit, FaTrash } from "react-icons/fa";

function StockGlobal({ products, setProducts }) {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    date: "",
    expirationDate: "",
    unit: "",
    supplier: "Non assigné", // Default static supplier
  });
  const [isMaterialForm, setIsMaterialForm] = useState(false);
  const [searchOption, setSearchOption] = useState("product");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchSupplier, setSearchSupplier] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue =
      name === "price" || name === "quantity" ? (value > 0 ? value : "") : value;

    setProduct({ ...product, [name]: newValue });
  };

  const addProduct = () => {
    if (
      product.name &&
      product.price &&
      product.quantity &&
      product.date &&
      (product.unit === "piece" || product.unit === "L" ? product.expirationDate : true)
    ) {
      const totalPrice = parseFloat(product.price) * parseInt(product.quantity);
      setProducts([
        ...products,
        {
          ...product,
          name: isMaterialForm ? `${product.name} (M)` : product.name,
          totalPrice,
          id: Date.now(),
          entryDate: product.date,
          unit: isMaterialForm ? "piece" : product.unit,
        },
      ]);
      setProduct({
        name: "",
        price: "",
        quantity: "",
        date: "",
        expirationDate: "",
        unit: "",
        supplier: "Non assigné", // Static for now
      });
    } else {
      alert("Veuillez remplir tous les champs.");
    }
  };

  const isCloseToExpiry = (expirationDate) => {
    const today = new Date();
    const expiry = new Date(expirationDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const isExpired = (expirationDate) => {
    const today = new Date();
    const expiry = new Date(expirationDate);
    return expiry < today;
  };

  const viewProductDetails = (product) => {
    alert(
      `Détails du produit :\nNom : ${product.name}\nPrix unitaire : ${product.price} DH\nQuantité : ${product.quantity} ${product.unit}\nPrix total : ${product.totalPrice} DH\nFournisseur : ${product.supplier}\nDate : ${product.date}\nDate d'expiration : ${
        product.expirationDate || "Non spécifiée"
      }`
    );
  };

    const editProduct = (id) => {
    const prod = products.find((p) => p.id === id);
    setProduct(prod);
    setProducts(products.filter((p) => p.id !== id));
  };

  const deleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  // Logic for filtering based on search
  const filteredProducts = products.filter((p) => {
    const productMatch = p.name.toLowerCase().startsWith(searchTerm.toLowerCase()); // Changed to startsWith
    const supplierMatch = p.supplier.toLowerCase().startsWith(searchSupplier.toLowerCase());
    const dateMatch = searchOption === "date" && searchDate ? p.entryDate.startsWith(searchDate) : true;
    return (
      (searchOption === "product" && productMatch) ||
      (searchOption === "date" && dateMatch) ||
      (searchOption === "supplier" && supplierMatch)
    );
  });
  

  return (
    <div className="StockGlobal" style={{ padding: "20px", display: "flex", gap: "20px" }}>
      {/* Form */}
      <div className="form" style={{ width: "30%", background: "#f8f9fa", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
        
        {/* Buttons Above Title */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
          <button
            onClick={() => setIsMaterialForm(true)}
            style={{
              background: "linear-gradient(135deg, #00b894, #1abc9c)",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "50px",
              cursor: "pointer",
              fontSize: "16px",
              width: "45%",
              border: "none",
              boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease-in-out",
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            Matériel
          </button>
          

          <button
            onClick={() => setIsMaterialForm(false)}
            style={{
              background: "linear-gradient(135deg, #00b894, #1abc9c)",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "50px",
              cursor: "pointer",
              fontSize: "16px",
              width: "45%",
              border: "none",
              boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease-in-out",
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            Produit
          </button>
        </div>

        {/* Form Title */}
        <h2 style={{ textAlign: "center", marginBottom: "15px", fontSize: "24px", fontWeight: "bold", color: "#333" }}>
          {isMaterialForm ? "Ajouter un Matériel" : "Ajouter un Produit"}
        </h2>

        {/* Form Fields */}
        {isMaterialForm ? (
          <>
            <input type="text" name="name" placeholder="Nom du matériel" value={product.name} onChange={handleChange} style={inputStyle} />
            <input type="number" name="price" placeholder="Prix unitaire" value={product.price} onChange={handleChange} style={inputStyle} />
            <input type="number" name="quantity" placeholder="Quantité" value={product.quantity} onChange={handleChange} style={inputStyle} />
            <input type="date" name="date" placeholder="Date" value={product.date} onChange={handleChange} style={inputStyle} />
            <button onClick={addProduct} style={buttonStyle}>Ajouter Matériel</button>
          </>
        ) : (
          <>
            <input type="text" name="name" placeholder="Nom du produit" value={product.name} onChange={handleChange} style={inputStyle} />
            <input type="number" name="price" placeholder="Prix unitaire" value={product.price} onChange={handleChange} style={inputStyle} />
            <input type="number" name="quantity" placeholder="Quantité" value={product.quantity} onChange={handleChange} style={inputStyle} />
            <select name="unit" value={product.unit} onChange={handleChange} style={inputStyle}>
              <option value="">Sélectionner l'unité</option>
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="L">L</option>
              <option value="piece">Pièce</option>
            </select>
            {product.unit === "L" || product.unit === "piece" ? (
              <input type="date" name="expirationDate" placeholder="Date d'expiration" value={product.expirationDate} onChange={handleChange} style={inputStyle} />
            ) : null}
            <input type="date" name="date" placeholder="Date" value={product.date} onChange={handleChange} style={inputStyle} />
            <button onClick={addProduct} style={buttonStyle}>Ajouter Produit</button>
          </>
        )}
      </div>

      {/* Table */}
      <div style={{ width: "70%" }}>
        {/* Search Bar */}
        <div style={{ display: "flex", marginBottom: "20px", alignItems: "center" }}>
          <FaSearch style={{ fontSize: "18px", marginRight: "10px", color: "#007bff" }} />
          <select onChange={(e) => setSearchOption(e.target.value)} value={searchOption} style={selectStyle}>
            <option value="product">Produit</option>
            <option value="date">Date</option>
            <option value="supplier">Fournisseur</option>
          </select>
          {searchOption === "date" ? (
            <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} style={searchInputStyle} />
          ) : searchOption === "supplier" ? (
            <input type="text" placeholder="Rechercher par fournisseur" value={searchSupplier} onChange={(e) => setSearchSupplier(e.target.value)} style={searchInputStyle} />
          ) : (
            <input type="text" placeholder={`Rechercher par ${searchOption}`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={searchInputStyle} />
          )}
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
          <thead>
            <tr style={{ background: "#343a40", color: "#fff" }}>
              <th style={tableHeaderStyle}>Nom</th>
              <th style={tableHeaderStyle}>Quantité</th>
              <th style={tableHeaderStyle}>Prix total</th>
              <th style={tableHeaderStyle}>Fournisseur</th>
              <th style={tableHeaderStyle}>Date d'entrée</th>
              <th style={tableHeaderStyle}>Date d'expiration</th>
              <th style={tableHeaderStyle}>État</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              const closeToExpiry = isCloseToExpiry(p.expirationDate);
              const expired = isExpired(p.expirationDate);

              return (
                <tr
                  key={p.id}
                  style={{
                    backgroundColor: expired
                      ? "#ffcccc"
                      : closeToExpiry
                      ? "#fff3cd"
                      : "white",
                  }}
                >
                  <td style={tableCellStyle}>{p.name}</td>
                  <td style={tableCellStyle}>
                    {p.quantity} {p.unit}
                  </td>
                  <td style={tableCellStyle}>{p.totalPrice} DH</td>
                  <td style={tableCellStyle}>{p.supplier}</td>
                  <td style={tableCellStyle}>{p.entryDate}</td>
                  <td style={tableCellStyle}>
                    {p.expirationDate || "Non spécifiée"}
                  </td>
                  <td style={tableCellStyle}>
  {expired ? (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
      <span style={{ fontSize: "14px", fontWeight: "bold" }}>❌</span>
      <span style={{ color: "#dc3545", fontWeight: "bold", fontSize: "12px" }}>Produit expiré</span>
    </div>
  ) : closeToExpiry ? (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
      <span style={{ fontSize: "14px", fontWeight: "bold" }}>⚠️</span>
      <span style={{ color: "#ffc107", fontWeight: "bold", fontSize: "12px" }}>Expiration proche</span>
    </div>
  ) : (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
      <span style={{ fontSize: "14px", fontWeight: "bold" }}>✅</span>
      <span style={{ color: "#28a745", fontWeight: "bold", fontSize: "12px" }}>Valide</span>
    </div>
  )}
</td>



                  <td style={tableCellStyle}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "5px",
                      }}
                    >
                      <button
                        onClick={() => viewProductDetails(p)}
                        style={iconButtonStyle}
                      >
                        <FaEye color="#007bff" />
                      </button>
                      <button
                        onClick={() => editProduct(p.id)}
                        style={iconButtonStyle}
                      >
                        <FaEdit color="#ffc107" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        style={iconButtonStyle}
                      >
                        <FaTrash color="#dc3545" />
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

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "5px 0",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "#fff",
  padding: "10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px",
};

const selectStyle = {
  padding: "10px",
  marginRight: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const searchInputStyle = {
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  width: "200px",
};

const tableHeaderStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  textAlign: "center",
};

const tableCellStyle = {
  padding: "10px",
  textAlign: "center",
  borderBottom: "1px solid #ddd",
};

const iconButtonStyle = {
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "5px",
};

export default StockGlobal;



