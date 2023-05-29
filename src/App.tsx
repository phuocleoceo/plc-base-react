import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

import { useRouteElements } from '~/common/routings'

function App() {
  const routeElements = useRouteElements()

  return (
    <div className='bg-c-111 flex plc-theme'>
      {routeElements}
      <ToastContainer
        closeOnClick
        position='top-right'
        rtl={false}
        autoClose={1500}
        newestOnTop={true}
        hideProgressBar={false}
      />
    </div>
  )
}

export default App
