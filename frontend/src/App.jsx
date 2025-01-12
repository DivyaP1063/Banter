import {  Routes, Route } from "react-router-dom";
import Template from "./components/Template";

function App() {
  return (
    <div className="App">

        <Routes>
          <Route path="/" element={<Template />} />
        </Routes>

    </div>
  );
}

export default App;
