import React, { useState, useEffect } from 'react';
import API from '../services/API';
import {useNavigate} from 'react-router-dom';

function ProductOptions(props) {
    const {id} = props
    const navigate = useNavigate();
    const [stocks, setStocks] = useState([]);

    const [productOptions, setProductOptions] = useState({
        culoare: '',
        marime: '',
        descriere: ''
    });
    const [availableSizes, setAvailableSizes] = useState([]);
    const uniqueColors = [...new Set(stocks.map((stock) => stock.culoare))];

    const handleColorChange = (e) =>{
        const color = e.target.value;

        setProductOptions( (prevOptions) => ({
            ...prevOptions, 
            culoare: color
        }));

        const sizesForColor = stocks
        .filter((stock) => stock.culoare === color && stock.stoc > 0)
        .map((stock) => stock.marime)
        .sort((a, b) => {
            const sizeA = parseInt(a, 10);
            const sizeB = parseInt(b, 10);
      
            if (!isNaN(sizeA) && !isNaN(sizeB)) {
              return sizeA - sizeB;
            } else {
              return a.localeCompare(b);
            }
          });      

        setAvailableSizes(sizesForColor);
    }

    const handleSizeChange = (e) => {
        const size = e.target.value;
        setProductOptions((prevOptions) => ({
            ...prevOptions, 
            marime: size
        }))
    }

    const handleDescriptionChange = (e) =>{
        const description = e.target.value;
        setProductOptions((prevOptions) => ({
            ...prevOptions, 
            descriere: description
        }))
    }

    useEffect( () => {
        API.productStocks(id)
        .then(data => {
            console.log(data.stocuri);
            setStocks(data.stocuri);
        })
    }, [id]);

    const addToCart = () => {
        API.addToCart(id, productOptions)
        .then(resp => console.log(resp))
        .catch(error => {
          if (error.response && error.response.status === 401){
            navigate("/login", {state: { message: "Trebuie sa fii autentificat/a pentru a adauga in cos articole!"}})
        }});
      }

  return (
    <div>
      <form onSubmit={addToCart}>
        <select name="culoare" onChange={handleColorChange}>
            <option value="">Culori disponibile</option>
            {uniqueColors.map( color => (
                <option key={color} value={color}>
                    {color}
                </option>
            ))}
        </select>
        <select name="marime" onChange={handleSizeChange}>
            <option value="">Marimi disponibile</option>
            {availableSizes.map( size => (
                <option key={size} value={size}>
                    {size}
                </option>
            ))}
        </select>
        <textarea maxLength={200} onChange={handleDescriptionChange}></textarea>
        <button type="submit">Adaugă în coș</button>
      </form>
    </div>
  )
}

export default ProductOptions
