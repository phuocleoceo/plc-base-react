import './App.css'
import { EnvConfig } from '~/configs'

function App() {
  return (
    <div className='App'>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
      <p className='text-clip'>{EnvConfig.PLCBaseUrl}</p>
    </div>
  )
}

export default App
