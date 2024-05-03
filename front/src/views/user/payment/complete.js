import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";

function Complete(props) {
  const sendMsg = () => {
    window.opener.postMessage('success', '*')
    window.close()
  }

  useEffect(() => {
    sendMsg()
  }, []);

  return (
    <>

    </>
  );
}

export default Complete;
