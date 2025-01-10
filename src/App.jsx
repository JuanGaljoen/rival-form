import { useState } from 'react'
import './App.css'
import QuoteForm from './components/QuoteForm.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    < QuoteForm />
  )
}

export default App
