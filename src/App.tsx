import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

import { useRouteElements } from '~/common/routings'

function App() {
  const routeElements = useRouteElements()

  return (
    <div>
      {routeElements}
      <ToastContainer />
    </div>
  )
}

export default App
