import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider, CssBaseline } from '@mui/material'
import ttsTheme from './theme/ttsTheme'

createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={ttsTheme}>
        <CssBaseline />
        <App />
    </ThemeProvider>
)
