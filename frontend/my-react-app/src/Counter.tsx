import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { increment, decrement, incrementByAmount } from './features/counterSlice';

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <section aria-label="카운터 섹션">
      <h1 id="counter-title">Counter: {count}</h1>
      <div role="group" aria-labelledby="counter-title">
        <button 
          onClick={() => dispatch(increment())}
          aria-label="1 증가"
        >
          Increment
        </button>
        <button 
          onClick={() => dispatch(decrement())}
          aria-label="1 감소"
        >
          Decrement
        </button>
        <button 
          onClick={() => dispatch(incrementByAmount(5))}
          aria-label="5만큼 증가"
        >
          Increment by 5
        </button>
      </div>
    </section>
  );
};

export default Counter;
