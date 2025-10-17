import { useState } from 'react'
import UserPage from './pages/UserPage'


function App() {
  const [count, setCount] = useState(0)

  return (
      <UserPage />
  )
}

export default App
