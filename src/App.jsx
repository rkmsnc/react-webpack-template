import React, { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>A React Webpack App!</h1>
      <h2>{count}</h2>
      <h2>{process.env.PORT}</h2>
      <button onClick={() => setCount(count + 1)}>Click</button>
    </div>
  );
};

export default App;
