import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import AssessmentPage from './pages/AssessmentPage'
import ResultsPage from './pages/ResultsPage'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [results, setResults] = useState(null)

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/assess" element={<AssessmentPage setResults={setResults} />} />
          <Route path="/results" element={<ResultsPage results={results} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
