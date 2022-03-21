import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const Home = () => {
  const [roomId, setRoomId] = useState('');
  const [username, setUserName] = useState('');

  const navigate = useNavigate();

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success('New Room Created!');
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error('Either RoomID or Username is Missing!');
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code == 'Enter') {
      joinRoom();
    }
  };

  return (
    <div className='homePageWrapper'>
      <div className='formWrapper'>
        <img src='/3.png' className='homePageLogo' />
        <h4 className='mainLabel'> Welcome to GS Real Time Code Editor</h4>
        <div className='inputGroup'>
          <input
            className='inputBox'
            placeholder='Enter Room ID'
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
            onKeyUp={handleInputEnter}
          />

          <input
            className='inputBox'
            placeholder='Enter UserName'
            value={username}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            onKeyUp={handleInputEnter}
          />

          <button className='btn joinBtn' onClick={joinRoom}>
            Let's Go! 🚀
          </button>

          <span className='createInfo'>
            Don't Have Invite ? Create your own new Room &nbsp;
            <a href='' className='createNewBtn' onClick={createNewRoom}>
              Here!
            </a>
          </span>
        </div>
      </div>

      <footer>
        <h4>
          Built With 💖 ~ &nbsp;
          <button className='portfolio'>
            <b>GS</b>
          </button>
        </h4>
      </footer>
    </div>
  );
};

export default Home;
