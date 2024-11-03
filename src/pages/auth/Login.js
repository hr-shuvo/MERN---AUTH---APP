import styles from './auth.module.scss'
import Card from "../../components/card/Card";
import {BiLogIn} from "react-icons/bi";
import {useState} from "react";
import {Link} from "react-router-dom";
import PasswordInput from "../../components/passwordInput/PasswordInput";

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const handleInputChange = () => {
    }
    const loginUser = () => {
    }

    return (
        <div className={`container ${styles.auth}`}>
            <Card cardClass={''}>
                <div className={styles.form}>
                    <div className='--flex-center'>
                        <BiLogIn size={35} color={'#999'}></BiLogIn>
                    </div>
                    <h2>Login</h2>
                    <div className="--flex-center">
                        <button className='--btn --btn-google'>Login with google</button>
                    </div>

                    <br/>

                    <p className='--text-center --fw-bold'>or</p>

                    <form onSubmit={loginUser}>
                        <input type={"email"}
                               value={email}
                               placeholder={"Email"}
                               required={true}
                               onChange={handleInputChange}
                        />

                        <PasswordInput
                            placeholder={'Password'}
                            name={'password'}
                            value={password}
                            onChange={handleInputChange()}

                        ></PasswordInput>

                        <button type={"submit"} className='--btn --btn-primary --btn-block'>Login</button>

                    </form>

                    <Link to={'/forgot'}>Forgot Password</Link>
                    <span className={styles.register}>
                    <Link to={'/'}>Home</Link>
                    <p> &nbsp; Don't have an account? &nbsp;</p>
                    <Link to={'/register'}>Register</Link>

                    </span>


                </div>

            </Card>

        </div>
    );
};

export default Login;