import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ReactGA from "react-ga4" // ១. ទាញយក (Import) react-ga4 ចូលមកប្រើប្រាស់

// ២. កំណត់ដំណើរការ GA4 ដោយប្រើប្រាស់ Measurement ID ផ្ទាល់ខ្លួនរបស់អ្នក (ជំនួសកន្លែង G-XXXXXXX)
ReactGA.initialize("G-N96GE06PJ4");

// ៣. កត់ត្រាការចូលមើលទំព័រដំបូងរបស់អតិថិជន (Initial Pageview)
ReactGA.send({ 
  hitType: "pageview", 
  page: window.location.pathname + window.location.search 
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)