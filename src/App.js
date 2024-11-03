import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/home/Home";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Forgot from "./pages/auth/Forgot";
import Reset from "./pages/auth/Reset";
import LoginWithCode from "./pages/auth/LoginWithCode";
import Profile from "./pages/profile/Profile";


function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={
                        <Layout>
                            <Home/>
                        </Layout>
                    }/>

                    <Route path='/login' element={
                        <Login/>
                    }/>

                    <Route path='/register' element={
                        <Register/>
                    }/>

                    <Route path='/forgot' element={
                        <Forgot/>
                    }/>

                    <Route path='/resetPassword/:resetToken' element={
                        <Reset/>
                    }/>

                    <Route path='/loginWithCode/:email' element={
                        <Layout>
                            <LoginWithCode/>
                        </Layout>
                    }/>


                    <Route path='/profile' element={
                        <Layout>
                            <Profile/>
                        </Layout>
                    }/>


                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
