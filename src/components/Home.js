import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './Home.css';
import SideNavigation from './SideNavigation';
import VoiceComponent from './VoiceComponent';
import AllVoiceRecords from './AllVoiceRecords';
import NewTask from './NewTask';
import { Container,Form,Button } from 'react-bootstrap';
// import GoogleSignIn from './components/GoogleSignIn';
import { GoogleOAuthProvider,GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import axios from 'axios';


function Home() {
  const [activeComponentIndex, setActiveComponentIndex] = useState(-1);
  const [user_email , setUserEmail] = useState(null);
  const [totalPoints,setTotalPoints] = useState(0);
  

  useEffect(() => {
    // const storedUserEmail = localStorage.getItem('userEmail');
    const storedUserEmail = "111arpit1@gmail.com" ;
    if (storedUserEmail) {
      setUserEmail(storedUserEmail);
      FetchPoints(storedUserEmail);
    }
    
  }, []);

  const addNewVoiceComponent = () => {
    setActiveComponentIndex(activeComponentIndex + 1); // Increment the activeComponentIndex
  };

  function HandleNewUsers(message){
    console.log("inside handle new users",message);
      const url = `https://8tdgrcf0cc.execute-api.ap-south-1.amazonaws.com/default/z-alpha_api`
    
      const payload = {
        "queryload":`INSERT INTO arpit_testing.new_users (first_name, email, last_name) SELECT '${message.given_name}' AS first_name, '${message.email}' AS email, '${message.family_name}' AS last_name WHERE NOT EXISTS (SELECT 1 FROM arpit_testing.new_users WHERE email = '${message.email}');`
    }
        
        axios.post(url, JSON.stringify(payload))
          .then(response => {
            console.log(response.data); // Make sure response.data is already a JSON object
          })
          .catch(error => {
            console.error(error);
          })
    
  }
  function FetchPoints(email){
    console.log("inside fetch points")
      const url = `https://8tdgrcf0cc.execute-api.ap-south-1.amazonaws.com/default/z-alpha_api`
    
      const payload = {
        "queryload":`select points from arpit_testing.new_users where email = '${email}';`
    }
        
        axios.post(url, JSON.stringify(payload))
          .then(response => {
            console.log(response.data); // Make sure response.data is already a JSON object
            setTotalPoints(response.data[0].points)
          })
          .catch(error => {
            console.error(error);
          })
    
  }
  const handleGoogleLoginSuccess = (credentialResponse) => {
    var message = jwt_decode(credentialResponse.credential);
    console.log(message);
    if (message.email_verified === true) {
      setUserEmail(message.email);
      HandleNewUsers(message);
      FetchPoints(message.email)
      // Save the user email to local storage so that the user stays logged in even after refreshing
      localStorage.setItem('userEmail', message.email);
    }
  };

  const handleGoogleLoginError = () => {
    console.log('Login Failed');
  };

  const handleLogout = () => {
    // Clear the user email from the state and local storage on logout
    setUserEmail(null);
    localStorage.removeItem('userEmail');
  };
  return (
    <div className="app-container">
      <Router>
        <SideNavigation userEmail={user_email} onLogout={handleLogout} totalPoints={totalPoints} FetchPoints={FetchPoints}/>
        <div className="main-content">
        {user_email ? (
          <>
          <h1 className='text-center'>Tasks</h1>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {activeComponentIndex >= 0 && (
                    <VoiceComponent key={activeComponentIndex} recordingEnabled={true} userEmail={user_email} totalPoints={totalPoints} FetchPoints={FetchPoints} />
                  )}
                  <NewTask onYes={addNewVoiceComponent} onNo={() => {}} />
                </>
              }
            />
            <Route path="/allRecordings" element={<AllVoiceRecords userEmail={user_email}  />} />
          </Routes>
          </>
          ) : (
            <div className="text-center">
              <h1>Authenticate First</h1>
              <Container className="col-lg-6">
                <GoogleOAuthProvider clientId="227942730260-ak4jk14iep3lt2fjla71et4mr8gd7h0o.apps.googleusercontent.com">
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginError}
                  />
                  </GoogleOAuthProvider>
              </Container>
            </div>
          )}
        </div>
      </Router>

      
    </div>
  );
}

export default Home;
