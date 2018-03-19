// import { renderRoutes } from 'react-router-config'
import renderRoutes from '@client/routes/renderRoutes'

import routes from './routes'

import './style.css'

const App = () => renderRoutes(routes)

export default App
