import React, { useEffect, useRef } from 'react';
import ACTIONS from '../Actions';
import Client from '../Components/Client';
import Editor from '../Components/Editor';
import { initSocket } from '../socket';
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from 'react-router-dom';
import toast from 'react-hot-toast';

const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();

  const codeRef = useRef();

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(e) {
        console.log('scoket error ', e);
        toast.error('Socket connection Failed! Try Again');
        reactNavigator('/');
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username != location.state?.username) {
            toast.success(`${username} have Joined the Room!`);
            console.log(username + ' joined');
          }

          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} have left the room!`);
        setClients((prev) =>
          prev.filter((client) => client.socketId != socketId)
        );
      });
    };

    init();

    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    };
  }, []);
  const [clients, setClients] = React.useState([]);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('🚀 RoomId has been copied to Clipboard!');
    } catch (error) {
      toast.error('😥Error in copying RoomID!');
    }
  };

  const leaveRoom = () => {
    reactNavigator('/');
  };

  if (!location.state.username) {
    return <Navigate to='/' />;
  }

  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
          <div
            className='logo'
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <img className='logoImage' src='/3.png' alt='logo' />
            <span style={{ fontSize: '18px' }}>
              <b>GS Code</b>
            </span>
          </div>
          <h3>Connected</h3>
          <div className='clientsList'>
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className='btn copyBtn' onClick={copyRoomId}>
          Copy Room ID
        </button>
        <button className='btn leaveBtn' onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className='editorWrap'>
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
