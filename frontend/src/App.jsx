import {  Routes, Route } from "react-router-dom";
import Template from "./components/Template";
import Chats from "./pages/Chats"

function App() {
  return (
    <div className="App">

        <Routes>
          <Route path="/" element={<Template />} />
          <Route path="/chats" element={<Chats />} />
        </Routes>

    </div>
  );
}

export default App;
