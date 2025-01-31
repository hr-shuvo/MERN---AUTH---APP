import styles from './auth.module.scss'
import Card from "../../components/card/Card";
import {BiLogIn} from "react-icons/bi";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import PasswordInput from "../../components/passwordInput/PasswordInput";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { login, RESET } from '../../redux/features/auth/authSlice';
import Loader from '../../components/loader/Loader';

const initialState = {
    email: '',
    password: ''
}

const Login = () => {
    const [ fromData, setFromData] = useState(initialState);
    const { email, password } = fromData;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {isLoading, isLoggedIn, isSuccess, message} = useSelector((state) => state.auth);

    const handleInputChange = (e) => {
        const {name, value} = e.target

        setFromData({...fromData, [name]: value});
    };


    const loginUser = async (e) => {
        e.preventDefault()
        
        if(!email || !password){
            return toast.error('All field are required');
        }

        if(!email){
            return toast.error('Invalid email');
        }

        const userData = {
            email, password
        }

        console.log(userData);

        await dispatch(login(userData));
    }

    useEffect(() =>{
            if(isSuccess && isLoggedIn){
                navigate('/profile');     
            }
    
            dispatch(RESET());
        }, [isLoggedIn, isSuccess, dispatch, navigate])

    return (
        <div className={`container ${styles.auth}`}>
            {isLoading && <Loader/>}

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
                               name={'email'}
                               placeholder={"Email"}
                               required
                               onChange={handleInputChange}
                        />

                        <PasswordInput
                            placeholder={'Password'}
                            name={'password'}
                            value={password}
                            onChange={handleInputChange}

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