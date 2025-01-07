import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Draft from './components/Draft.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    < Draft />
  )
}

export default App
