import React, { useState } from 'react';
import API from '../services/API';

function StockUpdate(props) {
    const [marime, setMarime] = useState('');
    const [culoare, setCuloare] = useState('');
    const [stoc, setStoc] = useState('');

    const sendStock = (e) => {
        e.preventDefault();

        const stockData = {
            marime: marime,
            culoare: culoare, 
            stoc: stoc
        }
        API.updateStock(props.product.id, stockData)
        .then(resp => console.log(resp));
    }


  return (
    <div>
        <form onSubmit={sendStock}>
            <label htmlFor="culoare" className="form-label">
                Culoare: 
            </label>
            <input type="text" name="culoare" id="culoare" value={culoare} onChange={(e) => setCuloare(e.target.value) }
            className="form-control"/>

            <label htmlFor="marime" className="form-label">
                Marime: 
            </label>
            <input type="text" name="marime" id="marime" value={marime} onChange={(e) => setMarime(e.target.value) }
            className="form-control"/>

            <label htmlFor="stoc" className="form-label">
                Stoc: 
            </label>
            <input type="text" name="stoc" id="stoc" value={stoc} onChange={(e) => setStoc(e.target.value) }
            className="form-control"/>

            <button type="submit" className="btn btn-success">Trimite</button>
        </form>
      
    </div>
  )
}

export default StockUpdate
