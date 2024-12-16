import { createRoot } from 'react-dom/client';
import RootComponent from './RootComponent';
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(<RootComponent />);
