import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export const Feladatok = () => {
  const [halakTavak, setHalakTavak] = useState([]);
  const [fogasok, setFogasok] = useState([]);
  const [topHalak, setTopHalak] = useState([]);

  useEffect(() => {
    axios.get("https://localhost:7067/api/Halak/halak-tavakkal").then((res) => setHalakTavak(res.data));
    axios.get("https://localhost:7067/api/Fogasok").then((res) => setFogasok(res.data));
    axios.get("https://localhost:7067/api/Halak/legnagyobb-halak").then((res) => setTopHalak(res.data));
  }, []);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Halas feladatok</h1>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm rounded-4">
            <div className="card-body">
              <h4 className="card-title text-center mb-3">Halak és Tavak</h4>
              <ul className="list-group">
                {halakTavak.map((item, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between">
                    <span>{item.halNev}</span>
                    <span className="badge bg-primary rounded-pill">{item.toNev}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm rounded-4">
            <div className="card-body">
              <h4 className="card-title text-center mb-3">Horgász Fogások</h4>
              <ul className="list-group">
                {fogasok.map((item, index) => (
                  <li key={index} className="list-group-item">
                    <div className="fw-bold">{item.horgaszNeve}</div>
                    <div>
                      {item.halNeve} - <small className="text-muted">{item.fogasDatuma}</small>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm rounded-4">
            <div className="card-body">
              <h4 className="card-title text-center mb-3">Top 3 Legnagyobb Hal</h4>
              <ul className="list-group">
                {topHalak.map((item, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between">
                    <span>{item.nev}</span>
                    <span className="badge bg-success rounded-pill">{item.meretCm} cm</span>
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
