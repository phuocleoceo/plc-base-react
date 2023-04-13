import { ToastContainer } from 'react-toastify'
import { AppConfig } from '~/configs'

function App() {
  return (
    <div>
      <ToastContainer />
      <p className='text-center'>My API: {AppConfig.PLCBaseApi}</p>
    </div>
  )
}

export default App
