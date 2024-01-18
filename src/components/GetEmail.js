import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const GetEmail = () => {
  const [email, setEmail] = useState('');
  const history = useHistory();

  const handleInputChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = () => {
    // Redirect to the homepage with the useremail query parameter
    history.push(`/?useremail=${email}`);
  };

  return (
    <div>
      <h2>Enter Your Email:</h2>
      <input type="text" value={email} onChange={handleInputChange} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default GetEmail;
