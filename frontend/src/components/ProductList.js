import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import API from '../services/API';

function ProductList() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])

    const[selectedCategory, setSelectedCategory] = useState('')
    const[filteredProducts, setFilteredProducts] = useState(products)

    useEffect( () => {
        API.getAllProducts().then(data => {
            console.log(data.produse)
            setProducts(data.produse)

            const uniqueCategories = [...new Set(data.produse.map(product => product.categorie))];
            setCategories(uniqueCategories)
        })
    }, []);

    const handleCategoryChange = e => setSelectedCategory(e.target.value);

    useEffect( () => {
      const updatedProducts = selectedCategory
            ? products.filter(product => product.categorie === selectedCategory)
            : products;

            setFilteredProducts(updatedProducts);
    }, [selectedCategory, products]);

  return (
    <div> 
      <h1>Lista produse</h1>
      {/* <button><Link to={`/products/create`}>Add product</Link></button> */}
      <select value={selectedCategory} onChange={handleCategoryChange} className="form-control w-25">
      <option value="">Toate categoriile</option>
      {categories.map((category, index) => (
        <option key={index} value={category}>
          {category}
        </option>
      ))}
    </select>
      {filteredProducts.map(product => (
        <div key={product.id}><Link to={`/produse/${product.id}`}>{product.nume}</Link></div>
      ))}
      
    </div>
  )
}

export default ProductList
