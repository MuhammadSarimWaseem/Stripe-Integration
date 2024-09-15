import React, { Fragment, useState } from 'react';
import axios from 'axios';
import './App.css'
import Data from "./Data/Data.jsx"

function App() {
  const [cartItem, setCartItem] = useState([]);

  const addToCart = (item) => {
    console.log("add to cart", item);

    setCartItem((previousList) => [...previousList, item])
  }

  const buyFunction = async () => {
    try {
      const response = await axios.post('http://localhost:3000/payment', { cartItem });
      if (response.status === 200) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  return (
    <Fragment>
      <div className='cart'>
        {Data.map((item) => (
          <div key={item.id} className='item'>
            <img src={item.image} alt={item.name} className='item-image' />
            <h1>{item.name}</h1><br />
            <p>Price: {item.price}.00$</p><br />
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
      <div className='buy'>
        <button onClick={buyFunction}>Buy Now</button>
      </div>
    </Fragment>
  );
}

export default App;