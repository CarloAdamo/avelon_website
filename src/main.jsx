import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Lazy — TestPage pulls in the Spline runtime, which must stay out of the main bundle.
const TestPage = lazy(() => import('./pages/TestPage.jsx'))
// Dev only: the frame-capture stage for the film clips (scripts/film/frame.mjs). Production never ships it.
const CaptureFrame = import.meta.env.DEV ? lazy(() => import('./film/CaptureFrame.jsx')) : null

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/test"
          element={
            <Suspense fallback={null}>
              <TestPage />
            </Suspense>
          }
        />
        {CaptureFrame && <Route path="/capture" element={<Suspense fallback={null}><CaptureFrame /></Suspense>} />}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
