import React, { useState, useRef, useEffect } from 'react';
import { Button,Container,Table } from 'react-bootstrap';
import axios from 'axios';
// import { useLocation } from 'react-router-dom';

function AllVoiceRecords({userEmail})
{
    const [allaudios , SetAudios] = useState([]);
    // const [userEmail,setUserEmail] = useState(null);
    // const location = useLocation();
    
    // useEffect(() => {
    //   // const userEmail = new URLSearchParams(window.location.search).get('useremail');
    //   // console.log(userEmail);
    //   // setUserEmail(userEmail);
    // }, [userEmail]);
  
    useEffect(() => {
      console.log("i am insied useffect",userEmail)
      FetchData();
    },userEmail);

    function FetchData(){
      console.log(userEmail ,"insed fetch data");
        const url = `https://8tdgrcf0cc.execute-api.ap-south-1.amazonaws.com/default/z-alpha_api`
      
        const payload = {
          "queryload" : `select * from arpit_testing.aicrowd where username='${userEmail}';`
          } 
          
          axios.post(url, JSON.stringify(payload))
            .then(response => {
              console.log(response.data); // Make sure response.data is already a JSON object
              SetAudios(response.data);
            })
            .catch(error => {
              console.error(error);
            })
      
    }
    return(
        <>
        <Container className='col-lg-10  my-4 allrec'>
    <div>
        <h2>Your Previous saved recordings</h2>
        <Table striped bordered hover>
      <thead>
        <tr>
          <th>No.</th>
          <th>Product Name</th>
          <th>Material ID</th>
          <th>Audio URL</th>
        </tr>
      </thead>
      <tbody>
      {
            allaudios.length > 0 ?(
                allaudios.map((item,index)=>(
                    <tr>
                    <td>{index+1}</td>
                    <td>{item.product_name}</td>
                    <td>{item.material_id}</td>
                    <td><a href={item.url}> {item.url}</a></td>
                    </tr>
            ))
            ) : (<h1>No Tasks yet , please add a new one...</h1>)
        }
        
      </tbody>
    </Table>
        

    </div>
    </Container>
        </>
    );
}

export default AllVoiceRecords;