import { useEffect } from 'react';
import { message } from 'antd';


const MessageConfig = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      message.config({
        top: window.innerHeight - 100, // Set the message position to be at the bottom (100px from the bottom)
        duration: 3, // Duration in seconds
      });
    }
  }, []);

  return null;
};

export default MessageConfig;
