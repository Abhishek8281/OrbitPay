import App from './App'
import './index.css'

const { createRoot } = await import('react-dom/client')
const root = createRoot(document.getElementById('root')!)
root.render(<App />)