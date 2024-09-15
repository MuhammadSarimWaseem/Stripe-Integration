import React, { Fragment, useState } from 'react';
import axios from 'axios';
import './App.css';
import Data from "./Data/Data.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [cartItem, setCartItem] = useState([]);
  const [items, setItems] = useState(0);

  const addToCart = (item) => {
    console.log("add to cart", item);

    setCartItem((previousList) => [...previousList, item]);
    setItems(items + 1);
    toast("Added to Cart", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      theme: "dark",
      style: {
        width: "70%",
        maxWidth: "300px",
        margin: "0 auto",
        fontSize: "14px"
      },
    });
  };

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

  const deleteItem = (index) => {
    const newCartItem = [...cartItem];
    newCartItem.splice(index, 1);
    setCartItem(newCartItem);
    setItems(items - 1);
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
        <h2>CART ITEMS</h2>
        <ul>
          {cartItem.map((cart, index) => (
            <li key={cart.id}>{cart.name} - {cart.price}.00$ <button onClick={() => deleteItem(index)}>X</button></li>
          ))}
        </ul>
        {cartItem.length > 0 && (
          <button onClick={buyFunction}>Buy Now</button>
        )}
      </div>
      <ToastContainer />
    </Fragment>
  );
}

export default App;
