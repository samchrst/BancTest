import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    nbRacks: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem('userInfo', JSON.stringify(formData));

    navigate('/ping');
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Bienvenue 🧑‍💻</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label htmlFor="nom" className="form-label">Nom</label>
          <input
            type="text"
            className="form-control"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="prenom" className="form-label">Prénom</label>
          <input
            type="text"
            className="form-control"
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="nbRacks" className="form-label">Nombre de racks</label>
          <input
            type="number"
            className="form-control"
            id="nbRacks"
            name="nbRacks"
            min="1"
            value={formData.nbRacks}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Valider</button>
      </form>
    </div>
  );
};

export default Home;
