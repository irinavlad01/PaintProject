import React, { useState, useEffect } from 'react';
import API from '../services/API';
import {useNavigate} from 'react-router-dom';

function ProductOptions(props) {
    const {id} = props;
    const navigate = useNavigate();
    const [stocks, setStocks] = useState([]);

    useEffect( () => {
        API.productStocks(id)
        .then(data => {
            console.log(data.stocuri);
            setStocks(data.stocuri);
        })
    }, [id]);

    const [productOptions, setProductOptions] = useState({
        culoare: '',
        marime: '',
        descriere: ''
    });
    const [availableSizes, setAvailableSizes] = useState([]);
    const uniqueColors = [...new Set(stocks.map((stock) => stock.culoare))];
    const selectedStock = stocks.find(
        (stock) =>
          stock.culoare === productOptions.culoare &&
          stock.marime === productOptions.marime
      );

    const handleColorChange = (e) =>{
        const color = e.target.value;

        setProductOptions( (prevOptions) => ({
            ...prevOptions, 
            culoare: color
        }));

        //pentru testare
        console.log(productOptions);

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
        console.log(productOptions);
    }

    const handleDescriptionChange = (e) =>{
        const description = e.target.value;
        setProductOptions((prevOptions) => ({
            ...prevOptions, 
            descriere: description
        }))
        console.log(productOptions);
    }


    const addToCart = async () => {
        try{
            const response = await API.addToCart(id, productOptions)
            console.log(response)
        }
        catch (error) {
            if (error.response && error.response.status === 401){
                navigate("/login", {state: { message: "Trebuie sa fii autentificat/a pentru a adauga in cos articole!"}})
        }}};

    const handleSubmit = (e) =>{
        e.preventDefault();
        addToCart();
        navigate("/cos", {state: {message: "Produsul a fost adaugat!"}});
    }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <select name="culoare" onChange={handleColorChange} className="form-control">
            <option value="">Culori disponibile</option>
            {uniqueColors.map( color => (
                <option key={color} value={color}>
                    {color}
                </option>
            ))}
        </select>
        <select name="marime" onChange={handleSizeChange} className="form-control">
            <option value="">Marimi disponibile</option>
            {availableSizes.map( size => (
                <option key={size} value={size}>
                    {size}
                </option>
            ))}
        </select>
        {selectedStock ? <p>Stoc disponibil: {selectedStock.stoc}</p> : 0}
        <textarea maxLength={200} onBlur={handleDescriptionChange} className="form-control"></textarea>
        <button type="submit" className="btn btn-success">Adaugă în coș</button>
      </form>
    </div>
  )
}

export default ProductOptions
