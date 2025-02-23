import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export const Fogasok = () => {
  const [fogasok, setFogasok] = useState([]);
  const [newFogas, setNewFogas] = useState({ horgaszId: 0, halId: 0, datum: "" });
  const [editFogas, setEditFogas] = useState(null);
  const [horgaszok, setHorgaszok] = useState([]); // List of anglers for dropdown
  const [halak, setHalak] = useState([]); // List of fish for dropdown

  useEffect(() => {
    fetchFogasok();
    fetchHorgaszok();
    fetchHalak();
  }, []);

  // Fetch all fogasok
  const fetchFogasok = async () => {
    try {
      const response = await axios.get("https://localhost:7067/api/Fogasok");
      setFogasok(response.data);
    } catch (error) {
      console.error("Error fetching fogasok:", error);
    }
  };

  // Fetch all horgaszok for dropdown
  const fetchHorgaszok = async () => {
    try {
      const response = await axios.get("https://localhost:7067/api/Horgaszok");
      setHorgaszok(response.data);
    } catch (error) {
      console.error("Error fetching horgaszok:", error);
    }
  };

  // Fetch all halak for dropdown
  const fetchHalak = async () => {
    try {
      const response = await axios.get("https://localhost:7067/api/Halak");
      setHalak(response.data);
    } catch (error) {
      console.error("Error fetching halak:", error);
    }
  };

  // Handle input changes for new fogas
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFogas({ ...newFogas, [name]: value });
  };

  // Add a new fogas
  const handleAddFogas = async () => {
    try {
      await axios.post("https://localhost:7067/api/Fogasok", newFogas);
      fetchFogasok(); // Refresh the list
      setNewFogas({ horgaszId: 0, halId: 0, datum: "" }); // Reset form
    } catch (error) {
      console.error("Error adding fogas:", error);
    }
  };

  // Set the fogas to edit
  const handleEditFogas = (fogas) => {
    setEditFogas(fogas);
  };

  // Update an existing fogas
  const handleUpdateFogas = async () => {
    try {
      await axios.put(`https://localhost:7067/api/Fogasok/${editFogas.id}`, editFogas);
      fetchFogasok(); // Refresh the list
      setEditFogas(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating fogas:", error);
    }
  };

  // Delete a fogas
  const handleDeleteFogas = async (id) => {
    try {
      await axios.delete(`https://localhost:7067/api/Fogasok/${id}`);
      fetchFogasok(); // Refresh the list
    } catch (error) {
      console.error("Error deleting fogas:", error);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Fogások</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm rounded-4">
            <div className="card-body">
              <h4 className="card-title text-center mb-3">
                {editFogas ? "Fogás Szerkesztése" : "Új Fogás Hozzáadása"}
              </h4>
              <div className="mb-3">
                <label className="form-label">Horgász</label>
                <select
                  className="form-select"
                  name="horgaszId"
                  value={editFogas ? editFogas.horgaszId : newFogas.horgaszId}
                  onChange={(e) =>
                    editFogas
                      ? setEditFogas({ ...editFogas, horgaszId: e.target.value })
                      : handleInputChange(e)
                  }
                >
                  <option value={0}>Válassz horgászt</option>
                  {horgaszok.map((horgasz) => (
                    <option key={horgasz.id} value={horgasz.id}>
                      {horgasz.nev}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Hal</label>
                <select
                  className="form-select"
                  name="halId"
                  value={editFogas ? editFogas.halId : newFogas.halId}
                  onChange={(e) =>
                    editFogas
                      ? setEditFogas({ ...editFogas, halId: e.target.value })
                      : handleInputChange(e)
                  }
                >
                  <option value={0}>Válassz halat</option>
                  {halak.map((hal) => (
                    <option key={hal.id} value={hal.id}>
                      {hal.nev}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Dátum</label>
                <input
                  type="date"
                  className="form-control"
                  name="datum"
                  value={editFogas ? editFogas.datum : newFogas.datum}
                  onChange={(e) =>
                    editFogas
                      ? setEditFogas({ ...editFogas, datum: e.target.value })
                      : handleInputChange(e)
                  }
                />
              </div>
              <button
                className="btn btn-primary w-100"
                onClick={editFogas ? handleUpdateFogas : handleAddFogas}
              >
                {editFogas ? "Frissítés" : "Hozzáadás"}
              </button>
              {editFogas && (
                <button
                  className="btn btn-secondary w-100 mt-2"
                  onClick={() => setEditFogas(null)}
                >
                  Mégse
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm rounded-4">
            <div className="card-body">
              <h4 className="card-title text-center mb-3">Fogások Listája</h4>
              <ul className="list-group">
                {fogasok.map((fogas, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold">{fogas.horgaszNeve}</div>
                      <div>
                        {fogas.halNeve} - <small className="text-muted">{fogas.fogasDatuma}</small>
                      </div>
                    </div>
                    <div>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditFogas(fogas)}
                      >
                        Szerkesztés
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteFogas(fogas.id)}
                      >
                        Törlés
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};