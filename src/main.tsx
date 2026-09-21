import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ColorModeProvider } from './theme/ColorModeContext'

createRoot(document.getElementById('root')!).render(
    <ColorModeProvider>
        <App />
    </ColorModeProvider>
)
