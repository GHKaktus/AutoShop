import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store/store.ts'
import './index.css'
import App from './App.tsx'
// Корневой файл
createRoot(document.getElementById('root')!).render(

    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>,
)
