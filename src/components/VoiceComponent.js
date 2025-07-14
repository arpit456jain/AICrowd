import React, { useState, useRef, useEffect } from 'react';
import { Progress } from 'antd';
import { Button,Container,FloatingLabel,Form } from 'react-bootstrap';
import AWS from 'aws-sdk'; // Import the AWS SDK for browser
import axios from 'axios';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './VoiceComponent.css'; // Import your custom CSS for styling



const VoiceComponent = ({ recordingEnabled, userEmail , totalPoints ,FetchPoints}) => {
  const [recording, setRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [timer, setTimer] = useState(0);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  
  const [data,setData] = useState({});
  // const [userEmail,setUserEmail] = useState(null);
  const [audioUploaded, setAudioUploaded] = useState(false);
  const [apiResponse, setApiResponse] = useState([]);

  // Function to call the API and set the response in the state
  const callApiAndGetResponse = () => {
    console.log("inside api call");
    // Call your API here and update the apiResponse state with the data received
    // For example, you can use axios to make the API call
    axios.post('https://097k9w6fik.execute-api.ap-south-1.amazonaws.com/stage2')
      .then((response) => {
        setApiResponse(JSON.parse(response.data.body));
        console.log("from new end point",response.data.body,typeof(JSON.parse(response.data.body)));
      })
      .catch((error) => {
        console.error('Error calling API:', error);
      });
  };

  useEffect(() => {
    let interval;
    if (recording) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [recording]);

  useEffect(() => {
    fetchRandomProduct();
  },[]);
  

    function fetchRandomProduct(){
        const url = `https://8tdgrcf0cc.execute-api.ap-south-1.amazonaws.com/default/z-alpha_api`
      
        const payload = {
          "queryload" : `SELECT * FROM material_master.catalogue ORDER BY RANDOM() LIMIT 1;`
          } 
          
          axios.post(url, JSON.stringify(payload))
            .then(response => {
              console.log("randome procut ",response.data[0]); // Make sure response.data is already a JSON object
              setData(response.data[0]);
            })
            .catch(error => {
              console.error(error);
            })
      
    }
    const handleStartRecording = () => {
      if (!recordingEnabled) {
        return;
      }
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorderRef.current = new MediaRecorder(stream);
          const audioChunks = [];
    
          mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
            audioChunks.push(event.data);
          });
    
          mediaRecorderRef.current.addEventListener('stop', () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            // Instead of setting the URL, set the Blob object itself
            setRecordedAudio(audioBlob);
            audioRef.current.src = URL.createObjectURL(audioBlob);
          });
    
          mediaRecorderRef.current.start();
          setRecording(true);
          setTimer(0); // Reset the timer when starting recording
          // Automatically stop recording after 5 seconds
          setTimeout(handleStopRecording, 5000);
        })
        .catch((error) => {
          console.error('Error accessing microphone:', error);
        });
    };
    
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const handleResetRecording = () => {
    setRecordedAudio(null);
    audioRef.current.src = '';
  };

  const handleUploadRecording = () => {
    if (!recordedAudio) {
      return;
    }

    // Configure your AWS credentials and S3 bucket details
    AWS.config.update({
      accessKeyId: 'AKIAQOP6Z755U7TO3YNM',
      secretAccessKey: 'QmpQx5esQWP6LZvMb8Owe4XL7GPfoqvuXNr1pr+U',
      region: 'ap-south-1',
    });

   // Replace 'recorded-audio' with the desired filename in the S3 bucket (including the file extension)
  const fileName = `recorded-audio-${Date.now()}.mp3`;

  // Prepare the parameters for the S3 upload
  const params = {
    Bucket: 'aicrowdbucketnew',
    Key: fileName,
    Body: recordedAudio,
    ContentType: 'audio/mpeg', // Set the correct Content-Type for mp3
    ACL: 'public-read',
  };

  // const upload = new AWS.S3.ManagedUpload({ params });
  // upload.promise()
  //   .then(data => {
  //     console.log('Audio uploaded successfully:', data.Location);
  //     // SavetheAudio(data.Location);
  //     AddPoints();
  //     FetchPoints(userEmail);
  //     // setAudioUploaded(true);
  //     // callApiAndGetResponse();
  //   })
  //   .catch(err => {
  //     console.error('Error uploading audio:', err);
  //   }); 
    
  };

  function AddPoints()
  {
    const url = `https://8tdgrcf0cc.execute-api.ap-south-1.amazonaws.com/default/z-alpha_api`
  const payload ={
    "queryload":`update arpit_testing.new_users set points=${totalPoints}+10 where email = '${userEmail}';`
}

 
    axios.post(url, JSON.stringify(payload))
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        
        console.error(error);
      })

  }
  function SavetheAudio(url_of_audio)
  {
    console.log(url_of_audio)
  const url = `https://8tdgrcf0cc.execute-api.ap-south-1.amazonaws.com/default/z-alpha_api`

  const payload = {
    "queryload": `insert into arpit_testing.aicrowd (url,username,product_name,material_id) values('${url_of_audio}','${userEmail}','${data.name}','${data.material_id}')`,
  }

 
    axios.post(url, JSON.stringify(payload))
      .then(response => {
        console.log(response);
        toast.success("Audo Saved Successfully!!");
        handleResetRecording();
      })
      .catch(error => {
        
        console.error(error);
      })


  }
  // New function to handle downloading the recorded audio
  const handleDownloadRecording = () => {
    if (!recordedAudio) {
      return;
    }

    const downloadLink = document.createElement('a');
    downloadLink.href = recordedAudio;
    downloadLink.download = `recorded-audio-${Date.now()}.mp3`;
    downloadLink.click();
    handleResetRecording();
  };
  return (
    <>
    <ToastContainer/>
    
    <Container className='col-lg-6 mt-5'>
    <div className="voice-component-container">
        <div className="crop-name"> 
        <h3>
        Speak : {data.name}
        </h3>
         </div>
      <div className="chat-bubble">
        <div className="chat-bubble-content my-3">
          {recording && <Progress percent={(timer / 10) * 100} />}
          {recording && <span>{`${timer}s`}</span>}
        </div>
      </div>
      <div className="audio-player-container">
        <audio ref={audioRef} controls />
      </div>
      <div className="button-container mybuttons my-2">
      <Button
              type="primary"
              onClick={handleStartRecording}
              disabled={!recordingEnabled || recording || audioUploaded}
            >
          {recording ? 'Recording...' : 'Start Recording'}
        </Button>
        <Button
          variant="danger"
          onClick={handleStopRecording}
          disabled={!recording}
          className='mx-1'
        >
          Stop Recording
        </Button>
        <Button
          variant="info"
          onClick={handlePlayPause}
          disabled={!recordedAudio}
          className='mx-1'
        >
          {audioRef.current && !audioRef.current.paused ? 'Pause' : 'Play'}
        </Button>
        <Button
         variant="warning"
          onClick={handleResetRecording}
          disabled={!recordedAudio}
          className='mx-1'
        >
          Re-record
        </Button>
        <Button
         variant="success"
          onClick={handleUploadRecording}
          disabled={!recordedAudio}
          className='mx-1'
        >
          submit
        </Button>
        

        {/* <Button
            variant="outline-secondary"
            onClick={handleDownloadRecording}
            disabled={!recordedAudio}
            className="mx-1"
          >
            Download
          </Button> */}
      </div>
      {/* Display the API response data if it's not empty */}
      {apiResponse.length <= 0 ?
     "": 
        <>
        <div>
                <h3 className='text-center mt-3'>Output</h3>
                <div className='form-floating text-center'>
                {/* Map through the array and display the elements */}
                {apiResponse.map((item, index) => (
                  <div key={index}>
                   {apiResponse[index]}
                  </div>
                ))}
                 </div>
              </div>
        </>
        
        }
    </div>
    
    </Container>
    </>
  );
};

export default VoiceComponent;
