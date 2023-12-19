import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { NextUIProvider } from '@nextui-org/react';
// import { gradientLeft, gradientRight } from './assets/images';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <main className="dark text-foreground bg-background min-h-screen">
        <App />
        {/* <div className="fixed hidden dark:md:block dark:opacity-100 -bottom-[40%] -left-[20%] z-0">
          <img
            src={gradientLeft}
            className="relative shadow-black/5 opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large"
            alt="Left Gradient Background"
          />
        </div>
        <div className="fixed hidden dark:md:block dark:opacity-70 -top-[80%] -right-[60%] 2xl:-top-[60%] 2xl:-right-[45%] z-0 rotate-12">
          <img
            src={gradientRight}
            className="relative shadow-black/5 opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large"
            alt="Right Gradient Background"
          />
        </div> */}
      </main>
    </NextUIProvider>
  </React.StrictMode>
);
