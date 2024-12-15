'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight, faCommentMedical, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { buttonPressed } from '@/app/redux/slices/navBarSlice';
import { addChat } from '@/app/redux/slices/asstListSlice';
import { newChatHistory } from '@/app/redux/slices/currentChatSlice';
import { exitEditMode } from '@/app/redux/slices/editAsstSlice';

const Header = () => {
  const currentAssisstant = useSelector(state => state.asstList.currentAssisstant);
  const currentChat = useSelector(state => state.asstList.currentChat);

  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);

  const handleNavPress = (e) => {
    e.preventDefault();
    dispatch(buttonPressed());
  };

  const addChatPress = (e) => {
    e.preventDefault();
    dispatch(addChat(currentAssisstant));
    dispatch(newChatHistory());
    dispatch(exitEditMode());
  };

  const callLambda = async () => {
    try {
      const response = await fetch('/api/call-lambda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'value' }) // The payload
      });
      const data = await response.json();
      console.log('Response from Lambda:', data);
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };
  
  const handleLoginClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem('access_token');
      setIsLoggedIn(false);
      setUsername(null);
      window.location.href = '/';
    } else {
      window.location.href = "https://us-west-1ychwtpjpy.auth.us-west-1.amazoncognito.com/login?client_id=217rc9ici3mqaa768m3u2pllti&redirect_uri=https://main.d27waaueioitu2.amplifyapp.com/&response_type=code&scope=email+openid+phone";
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
  
    if (code) {
      const exchangeCodeForUsername = async () => {
        try {
          const response = await fetch('/api/exchange-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });

          const data = await response.json();

          if (response.ok && data.username) {
            console.log('Logged in as:', data.username);
            setUsername(data.username);
            setIsLoggedIn(true);
          } else {
            console.error('Failed to login:', data.message);
          }
        } catch (error) {
          console.error('Error during login:', error);
        }
      };

      exchangeCodeForUsername();
    }
  }, []);

  return (
    <div className="header">
      <div className="chat-btns-container">
        <button className="open-sidebar" onClick={handleNavPress}>
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        </button>
        <button className="new-chat">
          <FontAwesomeIcon icon={faCommentMedical} onClick={addChatPress} />
        </button>
        <button className='change-model'>GPT-4o
          <FontAwesomeIcon icon={faChevronDown} className="down-carat"/>
        </button>
      </div>
      <div className='assisstant-name-container'>
        <h2 className='assisstant-name'>{`${currentAssisstant} - ${currentChat}`}</h2>
      </div>
      <div className='login-btn-container'>
        <button className='login-btn' onClick={handleLoginClick}>
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default Header;
