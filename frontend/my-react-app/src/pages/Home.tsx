import * as React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { increment, decrement } from '../store/slices/exampleSlice';

const Home: React.FC = () => {
  const count = useAppSelector((state) => state.example.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h1>Counter Example</h1>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
};

export default Home;
