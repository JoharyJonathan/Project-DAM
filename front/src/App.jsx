import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-bootstrap'
import "./App.css";

function App() {

  return (
    <BrowserRouter>
      <ToastContainer position='top-center'>
        <Routes>

          <Route path="/*" element={<ClientRoute/>}/>

        </Routes>
      </ToastContainer>
    </BrowserRouter>
  );
}

export default App;
