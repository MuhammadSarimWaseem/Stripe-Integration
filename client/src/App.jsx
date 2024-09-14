import React from 'react';
import axios from 'axios';
import './App.css'
function App() {
  const buyFunction = async () => {
    try {
      const response = await axios.post('http://localhost:3000/payment');
      if (response.status === 200) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  return (
    <div className='cart'>
      <h1>Buy a T-Shirt</h1>
      <img src="https://www.shutterstock.com/image-photo/blank-short-sleeve-t-shirt-260nw-2494678487.jpg"/><br />
      <button onClick={buyFunction}>Buy Now</button>
    </div>
  );
}

export default App;