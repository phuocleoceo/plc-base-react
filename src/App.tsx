import { useEffect } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { AppConfig } from '~/configs'
import { AuthAPI } from './data/apis'

function App() {
  useEffect(() => {
    async function testLogin() {
      const data = await AuthAPI.login({
        email: 'ht10082001@gmail.com',
        password: 'phuocleoceo'
      })
      console.log(data)
    }
    testLogin()
  }, [])

  return (
    <div>
      <ToastContainer />
      <p className='text-center'>My API: {AppConfig.PLCBaseApi}</p>
    </div>
  )
}

export default App
