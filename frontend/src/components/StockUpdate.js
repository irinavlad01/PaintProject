import React, { useState } from 'react';
import API from '../services/API';

function StockUpdate(props) {
  const [marime, setMarime] = useState('');
  const [culoare, setCuloare] = useState('');
  const [stoc, setStoc] = useState('');
  const [fisier, setFisier] = useState(null);

  const sendStock = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('marime', marime);
    formData.append('culoare', culoare);
    formData.append('stoc', stoc);
    if (fisier) {
      formData.append('fisier', fisier);
    }

    API.updateStock(props.product.id, formData)
      .then(resp => {
        console.log(resp);
        window.location.reload();
      })
      .catch(err => {
        console.error('Eroare la actualizarea stocului:', err);
      });
  };

  return (
    <div>
      <p>Introdu mărimea, culoarea și fișierul pentru a actualiza stocul.</p>
      <form onSubmit={sendStock} encType="multipart/form-data">
        <label htmlFor="culoare" className="form-label">Culoare:</label>
        <input
          type="text"
          name="culoare"
          id="culoare"
          value={culoare}
          onChange={(e) => setCuloare(e.target.value)}
          className="form-control"
        />

        <label htmlFor="marime" className="form-label">Marime:</label>
        <input
          type="text"
          name="marime"
          id="marime"
          value={marime}
          onChange={(e) => setMarime(e.target.value)}
          className="form-control"
        />

        <label htmlFor="stoc" className="form-label">Stoc:</label>
        <input
          type="text"
          name="stoc"
          id="stoc"
          value={stoc}
          onChange={(e) => setStoc(e.target.value)}
          className="form-control"
        />

        <label htmlFor="fisier" className="form-label">Fișier (opțional):</label>
        <input
          type="file"
          name="fisier"
          id="fisier"
          onChange={(e) => setFisier(e.target.files[0])}
          className="form-control"
          accept="image/*,application/pdf"
        />

        <button type="submit" className="btn btn-success mt-2">Trimite</button>
      </form>
    </div>
  );
}

export default StockUpdate;
