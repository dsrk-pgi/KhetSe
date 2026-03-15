import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { LanguageProvider } from './context/LanguageContext'
import { Home } from './pages/Home'
import { Admin } from './pages/Admin'

function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        </BrowserRouter>
      </AppProvider>
    </LanguageProvider>
  )
}

export default App
