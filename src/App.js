import logo from './logo.svg';
import './App.css';
import MemoryMatch from './MemoryMatch';

function App() {
  return <DynamicIframe url="https://game.rhym.io/game?id=GAM096083341755" />;
}

function DynamicIframe({ url }) {
  return (
    // <iframe
    //   src={url}
    //   width="100%"
    //   height="900px"
    //   style={{ border: "none" }}
    //   title="Dynamic Iframe"
    // ></iframe>
    <MemoryMatch />
  );
}


export default App;
