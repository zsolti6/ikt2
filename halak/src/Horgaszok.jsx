import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export const Horgaszok = () => {
  const [horgaszok, setHorgaszok] = useState([]);
  const [newHorgasz, setNewHorgasz] = useState({ nev: "", eletkor: 0 });
  const [editHorgasz, setEditHorgasz] = useState(null);

  useEffect(() => {
    fetchHorgaszok();
  }, []);

  const fetchHorgaszok = async () => {
    const response = await axios.get("https://localhost:7067/api/Horgaszok");
    setHorgaszok(response.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHorgasz({ ...newHorgasz, [name]: value });
  };

  const handleAddHorgasz = async () => {
    await axios.post("https://localhost:7067/api/Horgaszok", newHorgasz);
    fetchHorgaszok();
    setNewHorgasz({ nev: "", eletkor: 0 });
  };

  const handleEditHorgasz = (horgasz) => {
    setEditHorgasz(horgasz);
  };

  const handleUpdateHorgasz = async () => {
    await axios.put(`https://localhost:7067/api/Horgaszok/${editHorgasz.id}`, editHorgasz);
    fetchHorgaszok();
    setEditHorgasz(null);
  };

  const handleDeleteHorgasz = async (id) => {
    await axios.delete(`https://localhost:7067/api/Horgaszok/${id}`);
    fetchHorgaszok();
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Horgászok</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm rounded-4">
            <div className="card-body">
              <h4 className="card-title text-center mb-3">{editHorgasz ? "Szerkesztés" : "Új Horgász Hozzáadása"}</h4>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Név"
                  name="nev"
                  value={editHorgasz ? editHorgasz.nev : newHorgasz.nev}
                  onChange={(e) => (editHorgasz ? setEditHorgasz({ ...editHorgasz, nev: e.target.value }) : handleInputChange(e))}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Életkor"
                  name="eletkor"
                  value={editHorgasz ? editHorgasz.eletkor : newHorgasz.eletkor}
                  onChange={(e) => (editHorgasz ? setEditHorgasz({ ...editHorgasz, eletkor: e.target.value }) : handleInputChange(e))}
                />
              </div>
              <button
                className="btn btn-primary w-100"
                onClick={editHorgasz ? handleUpdateHorgasz : handleAddHorgasz}
              >
                {editHorgasz ? "Frissítés" : "Hozzáadás"}
              </button>
              {editHorgasz && (
                <button
                  className="btn btn-secondary w-100 mt-2"
                  onClick={() => setEditHorgasz(null)}
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
              <h4 className="card-title text-center mb-3">Horgászok Listája</h4>
              <ul className="list-group">
                {horgaszok.map((horgasz) => (
                  <li key={horgasz.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{horgasz.nev}</strong> - {horgasz.eletkor} éves
                    </div>
                    <div>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditHorgasz(horgasz)}
                      >
                        Szerkesztés
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteHorgasz(horgasz.id)}
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