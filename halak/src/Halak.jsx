import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export const Halak = () => {
  const [halak, setHalak] = useState([]);
  const [newHal, setNewHal] = useState({ nev: "", faj: "", meretCm: 0, toId: 0, kep: "" });
  const [editHal, setEditHal] = useState(null);

  useEffect(() => {
    fetchHalak();
  }, []);

  const fetchHalak = async () => {
    const response = await axios.get("https://localhost:7067/api/Halak");
    setHalak(response.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHal({ ...newHal, [name]: value });
  };

  const handleAddHal = async () => {
    await axios.post("https://localhost:7067/api/Halak", newHal);
    fetchHalak();
    setNewHal({ nev: "", faj: "", meretCm: 0, toId: 0, kep: "" });
  };

  const handleEditHal = (hal) => {
    setEditHal(hal);
  };

  const handleUpdateHal = async () => {
    await axios.put(`https://localhost:7067/api/Halak/${editHal.id}`, editHal);
    fetchHalak();
    setEditHal(null);
  };

  const handleDeleteHal = async (id) => {
    await axios.delete(`https://localhost:7067/api/Halak/${id}`);
    fetchHalak();
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Halak</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm rounded-4">
            <div className="card-body">
              <h4 className="card-title text-center mb-3">{editHal ? "Szerkesztés" : "Új Hal Hozzáadása"}</h4>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Név"
                  name="nev"
                  value={editHal ? editHal.nev : newHal.nev}
                  onChange={(e) => (editHal ? setEditHal({ ...editHal, nev: e.target.value }) : handleInputChange(e))}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Faj"
                  name="faj"
                  value={editHal ? editHal.faj : newHal.faj}
                  onChange={(e) => (editHal ? setEditHal({ ...editHal, faj: e.target.value }) : handleInputChange(e))}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Méret (cm)"
                  name="meretCm"
                  value={editHal ? editHal.meretCm : newHal.meretCm}
                  onChange={(e) => (editHal ? setEditHal({ ...editHal, meretCm: e.target.value }) : handleInputChange(e))}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Tó ID"
                  name="toId"
                  value={editHal ? editHal.toId : newHal.toId}
                  onChange={(e) => (editHal ? setEditHal({ ...editHal, toId: e.target.value }) : handleInputChange(e))}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Kép (Base64)"
                  name="kep"
                  value={editHal ? editHal.kep : newHal.kep}
                  onChange={(e) => (editHal ? setEditHal({ ...editHal, kep: e.target.value }) : handleInputChange(e))}
                />
              </div>
              <button
                className="btn btn-primary w-100"
                onClick={editHal ? handleUpdateHal : handleAddHal}
              >
                {editHal ? "Frissítés" : "Hozzáadás"}
              </button>
              {editHal && (
                <button
                  className="btn btn-secondary w-100 mt-2"
                  onClick={() => setEditHal(null)}
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
              <h4 className="card-title text-center mb-3">Halak Listája</h4>
              <ul className="list-group">
                {halak.map((hal) => (
                  <li key={hal.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{hal.nev}</strong> - {hal.faj} ({hal.meretCm} cm)
                    </div>
                    <div>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditHal(hal)}
                      >
                        Szerkesztés
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteHal(hal.id)}
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