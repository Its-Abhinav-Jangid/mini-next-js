import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { pages } from '../../.pages/index.js';

const pathname = window.location.pathname;
const Page = pages[pathname] || pages['/not-found'];

hydrateRoot(document.getElementById('root'), React.createElement(Page));
