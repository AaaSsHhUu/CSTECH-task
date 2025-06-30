import { Outlet } from 'react-router-dom';
import Header from './components/Header';

function App() {
    console.log("app comp")
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}

export default App;
