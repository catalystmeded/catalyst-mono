import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

const AiReadinessSurvey = lazy(() => import('./pages/AiReadinessSurvey'))

export default function App() {
  return (
    <Suspense fallback={<div style={{ color: '#fff', textAlign: 'center', marginTop: 80 }}>Loading...</div>}>
      <Routes>
        <Route path="/ai-readiness" element={<AiReadinessSurvey />} />
        <Route path="*" element={<Navigate to="/ai-readiness" replace />} />
      </Routes>
    </Suspense>
  )
}
