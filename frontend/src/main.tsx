// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
// import WindowSetter from './WindowSetter.tsx';
// // import ReactDOM from 'react-dom/client';
// import {createBrowserRouter,RouterProvider} from 'react-router-dom';
// import Login from './Login';
// import LandingPage from './LandingPage.tsx'
// import SignupProccess from './SignupProcess.tsx'
// import DogWalkersSearchPage from './DogWalkersSearchPage.jsx'
//
// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <LandingPage/>
//   },
//   {
//     path: '/Login',
//     element: <Login/>
//   },
//   {
//     path: '/Signup',
//     element: <SignupProccess/>
//   },
//   {
//     path: '/SearchPage',
//     element: <DogWalkersSearchPage/>
//   }
// ]);
//
// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//    <RouterProvider router={router}/>
//   </React.StrictMode>,
// )

//main that works for now

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import WindowSetter from './WindowSetter.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
    <React.StrictMode>
      <WindowSetter />
    </React.StrictMode>
  </Router>,
);