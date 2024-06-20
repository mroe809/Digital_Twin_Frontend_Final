import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch } from '../hooks/redux-hooks';
import { logout } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';

const LogoutTimer: React.FC<{ timeoutInMinutes: number }> = ({ timeoutInMinutes }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const startTimer = useCallback(() => {
    return setTimeout(() => {
      dispatch(logout());
      navigate('/login');
    }, timeoutInMinutes * 60 * 1000);
  }, [dispatch, navigate, timeoutInMinutes]);

  useEffect(() => {
    let timer = startTimer();

    const resetTimer = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = startTimer();
    };

    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('mousedown', resetTimer);
    document.addEventListener('keypress', resetTimer);
    document.addEventListener('touchmove', resetTimer);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      document.removeEventListener('mousemove', resetTimer);
      document.removeEventListener('mousedown', resetTimer);
      document.removeEventListener('keypress', resetTimer);
      document.removeEventListener('touchmove', resetTimer);
    };
  }, [startTimer]);

  return null;
};

export default LogoutTimer;
