import { BrowserRouter, Routes, Route } from "react-router-dom";
import Usagestate from './page/Usagestat';
import Datasharing from './page/Datasharing';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path='/' element={<Usagestate />} />
         <Route path="/datasharing" element={<Datasharing />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
