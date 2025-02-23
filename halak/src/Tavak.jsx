import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export const Tavak = () => {
  const [tavak, setTavak] = useState([]);
  const [newTo, setNewTo] = useState({ nev: "" });
  const [editTo, setEditTo] = useState(null);

  useEffect(() => {
    fetchTavak();
  }, []);

  const fetchTavak = async () => {
    const response = await axios.get("https://localhost:7067/api/Tavak");
    setTavak(response.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTo({ ...newTo, [name]: value });
  };

  const handleAddTo = async () => {
    await axios.post("https://localhost:7067/api/Tavak", newTo);
    fetchTavak();
    setNewTo({ nev: "" });
  };

  const handleEditTo = (to) => {
    setEditTo(to);
  };

  const handleUpdateTo = async () => {
    await axios.put(`https://localhost:7067/api/Tavak/${editTo.id}`, editTo);
    fetchTavak();
    setEditTo(null);
  };

  const handleDeleteTo = async (id) => {
    await axios.delete(`https://localhost:7067/api/Tavak/${id}`);
    fetchTavak();
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Tavak</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm rounded-4">
            <div className="card-body">
              <h4 className="card-title text-center mb-3">{editTo ? "Szerkesztés" : "Új Tó Hozzáadása"}</h4>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Név"
                  name="nev"
                  value={editTo ? editTo.nev : newTo.nev}
                  onChange={(e) => (editTo ? setEditTo({ ...editTo, nev: e.target.value }) : handleInputChange(e))}
                />
              </div>
              <button
                className="btn btn-primary w-100"
                onClick={editTo ? handleUpdateTo : handleAddTo}
              >
                {editTo ? "Frissítés" : "Hozzáadás"}
              </button>
              {editTo && (
                <button
                  className="btn btn-secondary w-100 mt-2"
                  onClick={() => setEditTo(null)}
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
              <h4 className="card-title text-center mb-3">Tavak Listája</h4>
              <ul className="list-group">
                {tavak.map((to) => (
                  <li key={to.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{to.nev}</strong>
                    </div>
                    <div>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditTo(to)}
                      >
                        Szerkesztés
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteTo(to.id)}
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