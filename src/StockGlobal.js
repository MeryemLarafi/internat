import React, { useState } from "react";
import { FaSearch, FaEye, FaEdit, FaTrash, FaPlus, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Explicitly import autoTable
import "./StockGlobal.css";

function StockGlobal({ products, setProducts }) {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    date: "",
    expirationDate: "",
    unit: "",
    supplier: "Non assigné",
    zone: "",
  });

  const [showExpirationInput, setShowExpirationInput] = useState(false);
  const [searchOption, setSearchOption] = useState("product");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchSupplier, setSearchSupplier] = useState("");
  const [showForm, setShowForm] = useState(false);

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
      product.unit
    ) {
      const totalPrice =
        parseFloat(product.price) * parseInt(product.quantity);
      setProducts([
        ...products,
        {
          ...product,
          totalPrice,
          id: Date.now(),
          entryDate: product.date,
          supplier: "Non assigné",
        },
      ]);
      setProduct({
        name: "",
        price: "",
        quantity: "",
        date: "",
        expirationDate: "",
        unit: "",
        supplier: "Non assigné",
        zone: "",
      });
      setShowExpirationInput(false);
      setShowForm(false);
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
      `Détails du produit :\nNom : ${product.name}\nPrix unitaire : ${product.price} DH\nQuantité : ${product.quantity} ${product.unit}\nPrix total : ${product.totalPrice} DH\nFournisseur : ${product.supplier}\nZone : ${product.zone || "Non spécifiée"}\nDate : ${product.date}\nDate d'expiration : ${
        product.expirationDate || "Non spécifiée"
      }`
    );
  };

  const editProduct = (id) => {
    const prod = products.find((p) => p.id === id);
    setProduct(prod);
    setProducts(products.filter((p) => p.id !== id));
    setShowExpirationInput(!!prod.expirationDate);
    setShowForm(true);
  };

  const deleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  const filteredProducts = products.filter((p) => {
    const productMatch = p.name
      .toLowerCase()
      .startsWith(searchTerm.toLowerCase());
    const supplierMatch = p.supplier
      .toLowerCase()
      .startsWith(searchSupplier.toLowerCase());
    const dateMatch =
      searchOption === "date" && searchDate
        ? p.entryDate.startsWith(searchDate)
        : true;
    return (
      (searchOption === "product" && productMatch) ||
      (searchOption === "date" && dateMatch) ||
      (searchOption === "supplier" && supplierMatch)
    );
  });

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Stock Global - Rapport", 14, 20);

    // Add current date
    doc.setFontSize(12);
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Date: ${currentDate}`, 14, 30);

    // Prepare table data
    const tableData = filteredProducts.map((p) => [
      p.name || "N/A",
      `${p.quantity} ${p.unit}` || "N/A",
      `${p.totalPrice} DH` || "N/A",
      p.supplier || "Non assigné",
      p.zone || "Non spécifiée",
      p.entryDate || "N/A",
      p.expirationDate || "Non spécifiée",
      isExpired(p.expirationDate)
        ? "Expiré"
        : isCloseToExpiry(p.expirationDate)
        ? "Expiration proche"
        : "Valide",
    ]);

    // Use autoTable directly
    autoTable(doc, {
      startY: 40,
      head: [
        [
          "Nom",
          "Quantité",
          "Prix total",
          "Fournisseur",
          "Zone",
          "Date d'entrée",
          "Date d'expiration",
          "État",
        ],
      ],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [22, 160, 133] },
      styles: { fontSize: 10, cellPadding: 3 },
    });

    // Save the PDF
    doc.save("stock_global_rapport.pdf");
  };

  return (
    <div className="container">
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowForm(false)}>
              ×
            </button>
            <h2>Ajouter un Produit</h2>
            <form>
              <input
                type="text"
                name="name"
                placeholder="Nom du produit"
                value={product.name}
                onChange={handleChange}
              />
              <input
                type="number"
                name="price"
                placeholder="Prix unitaire"
                value={product.price}
                onChange={handleChange}
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantité"
                value={product.quantity}
                onChange={handleChange}
              />

              <select name="unit" value={product.unit} onChange={handleChange}>
                <option value="">Sélectionner l'unité</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="L">L</option>
                <option value="piece">Pièce</option>
              </select>

              <select name="zone" value={product.zone} onChange={handleChange}>
                <option value="">Choisir une zone</option>
                <option value="Economa 1">Economa 1</option>
                <option value="Economa 2">Economa 2</option>
                <option value="Matériel">Matériel</option>
                <option value="Fruit et Légume">Fruit et Légume</option>
              </select>

              <button
                type="button"
                onClick={() => setShowExpirationInput(!showExpirationInput)}
                style={{ marginBottom: "10px" }}
              >
                {showExpirationInput
                  ? "Retirer la date d'expiration"
                  : "Ajouter date d'expiration"}
              </button>

              {showExpirationInput && (
                <input
                  type="date"
                  name="expirationDate"
                  value={product.expirationDate}
                  onChange={handleChange}
                />
              )}

              <input
                type="date"
                name="date"
                placeholder="Date"
                value={product.date}
                onChange={handleChange}
              />
              <button type="button" onClick={addProduct}>
                Ajouter Produit
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="controls-container">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <select
            className="search-input"
            style={{ position: "relative", paddingLeft: "40px" }}
            onChange={(e) => setSearchOption(e.target.value)}
            value={searchOption}
          >
            <option value="product">Produit</option>
            <option value="date">Date</option>
            <option value="supplier">Fournisseur</option>
          </select>
          {searchOption === "date" ? (
            <input
              type="date"
              className="search-input"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          ) : searchOption === "supplier" ? (
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher par fournisseur"
              value={searchSupplier}
              onChange={(e) => setSearchSupplier(e.target.value)}
            />
          ) : (
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher par produit"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
        </div>

        <div className="action-buttons">
          <button className="action-btn" onClick={() => setShowForm(true)}>
            <FaPlus /> Ajouter
          </button>
          <button className="action-btn" onClick={exportToPDF}>
            <FaFilePdf /> Exporter PDF
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Quantité</th>
              <th>Prix total</th>
              <th>Fournisseur</th>
              <th>Zone</th>
              <th>Date d'entrée</th>
              <th>Date d'expiration</th>
              <th>État</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              const closeToExpiry = isCloseToExpiry(p.expirationDate);
              const expired = isExpired(p.expirationDate);

              return (
                <tr
                  key={p.id}
                  className={
                    expired ? "expired" : closeToExpiry ? "close-to-expiry" : ""
                  }
                >
                  <td>{p.name}</td>
                  <td>
                    {p.quantity} {p.unit}
                  </td>
                  <td>{p.totalPrice} DH</td>
                  <td>{p.supplier}</td>
                  <td>{p.zone || "Non spécifiée"}</td>
                  <td>{p.entryDate}</td>
                  <td>{p.expirationDate || "Non spécifiée"}</td>
                  <td>
                    {expired ? (
                      <div className="status">
                        <span className="icon">❌</span>
                        <span className="text expired-text">Produit expiré</span>
                      </div>
                    ) : closeToExpiry ? (
                      <div className="status">
                        <span className="icon">⚠️</span>
                        <span className="text warning-text">Expiration proche</span>
                      </div>
                    ) : (
                      <div className="status">
                        <span className="icon">✅</span>
                        <span className="text valid-text">Valide</span>
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn btn-view"
                        onClick={() => viewProductDetails(p)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="action-btn btn-edit-icon"
                        onClick={() => editProduct(p.id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-btn btn-delete-icon"
                        onClick={() => deleteProduct(p.id)}
                      >
                        <FaTrash />
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

export default StockGlobal;