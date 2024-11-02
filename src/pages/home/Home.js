import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./Home.scss";
import loginImg from "./../../assets/login.svg";

const Home = () => {

    return (
        <div>
            <Header></Header>
            <section className='container hero'>
                <div className='hero-text'>
                    <h2>Ultimate MERN Stack Authentication System</h2>
                    <p>Learn and Master Authentication and Authorization using MERN Stack</p>
                    <p>Implement User Registration</p>

                    <div className="hero-buttons --flex-start">
                        <button className="--btn --btn-danger">Register</button>
                    </div>

                </div>
                <div className='hero-image'>
                    <img src={loginImg} alt={'Auth'}/>

                </div>

            </section>
            <Footer></Footer>
        </div>
    );

};

export default Home;