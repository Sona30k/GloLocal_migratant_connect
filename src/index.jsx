import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


import MigrantSupportPlatform from './components/migrant_support.tsx';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <MigrantSupportPlatform />
    </React.StrictMode>
);
