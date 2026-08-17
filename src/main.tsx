import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import './index.css'
import { ThemeProvider } from './theme/ThemeContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { CaptchaGate } from './components/CaptchaGate.tsx'
import { AppRoutes } from './AppRoutes.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <CaptchaGate>
            <AppRoutes />
          </CaptchaGate>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
