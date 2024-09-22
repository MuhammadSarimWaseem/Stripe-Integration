import React, { Fragment, useState } from 'react';
import axios from 'axios';
import './App.css';
import Data from "./Data/Data.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [cartItem, setCartItem] = useState([]);

  const addToCart = (item) => {
    console.log("add to cart", item);
    setCartItem((previousList) => [...previousList, item]);
    toast.success("Added to Cart", {
      position: "top-right",
      autoClose: 1000,
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
      const response = await axios.post('https://stripe-integration-zeta.vercel.app/payment', { cartItem });
      if (response.status === 200) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Error processing payment. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
    }
  };

  const deleteItem = (index) => {
    const newCartItem = [...cartItem];
    newCartItem.splice(index, 1);
    setCartItem(newCartItem);
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
            <li key={index}>
              {cart.name} - {cart.price}.00$ <button onClick={() => deleteItem(index)}>X</button>
            </li>
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
