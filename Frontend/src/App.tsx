import './App.css'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import Home from './pages/Home/Home'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
