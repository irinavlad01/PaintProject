import React from 'react';
import { useLocation } from 'react-router-dom';

function Home() {
  const location = useLocation();
  const successMessage = location.state && location.state.message;
  return (
    <div>
      {successMessage && (<p className='alert alert-success w-25' role='alert'>{successMessage}</p>)}
      <h1>Paint Project</h1>
    </div>
  )
}

export default Home
