import React, { createContext, useContext, useEffect, useReducer } from 'react';

const TimerContext = createContext();

const timerReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TIMER':
      return {
        ...state,
        timers: [
          ...state.timers,
          {
            id: action.payload.deviceId,
            duration: action.payload.duration,
            remaining: action.payload.duration,
            serialNo: action.payload.serialNo,
            url: action.payload.url
          }
        ]
      };
      
    case 'UPDATE_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer => 
          timer.id === action.payload.deviceId ? 
          { ...timer, remaining: action.payload.remaining } : 
          timer
        )
      };
      
    case 'REMOVE_TIMER':
      return {
        ...state,
        timers: state.timers.filter(timer => timer.id !== action.payload.deviceId)
      };

    default:
      return state;
  }
};

export const TimerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(timerReducer, { timers: [] });

  useEffect(() => {
    const interval = setInterval(() => {
      state.timers.forEach(async (timer) => {
        const newRemaining = timer.remaining - 1;
        
        if (newRemaining <= 0) {
          try {
            await fetch(`${timer.url}/toggle`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ topic: timer.serialNo }),
            });
            dispatch({ type: 'REMOVE_TIMER', payload: { deviceId: timer.id } });
          } catch (error) {
            console.error('Timer toggle failed:', error);
          }
        } else {
          dispatch({ 
            type: 'UPDATE_TIMER', 
            payload: { 
              deviceId: timer.id, 
              remaining: newRemaining 
            }
          });
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.timers]);

  return (
    <TimerContext.Provider value={{ timers: state.timers, dispatch }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);