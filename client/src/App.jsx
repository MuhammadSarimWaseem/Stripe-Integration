import React, { Fragment, useState } from 'react';
import axios from 'axios';
import './App.css'
import Data from "./Data/Data.jsx"
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [cartItem, setCartItem] = useState([]);
  const [items, setItems] = useState(0);

  const addToCart = (item) => {
    console.log("add to cart", item);

    setCartItem((previousList) => [...previousList, item])
    setItems(items + 1);
    toast("Add to Cart", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      progress: undefined,
      theme: "dark",
      style: {
        width: "70%",
        maxWidth: "300px",
        margin: "0 auto",
        fontSize: "14px"
      },
    });
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
      <ToastContainer></ToastContainer>
    </Fragment>
  );
}

export default App;