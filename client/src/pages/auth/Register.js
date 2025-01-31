import styles from './auth.module.scss'
import Card from "../../components/card/Card";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import PasswordInput from "../../components/passwordInput/PasswordInput";
import {TiUserAddOutline} from "react-icons/ti";
import {FaTimes} from "react-icons/fa";
import {BsCheckAll} from "react-icons/bs";
import { toast } from 'react-toastify';
import {useDispatch, useSelector} from 'react-redux';
import { RESET, register } from '../../redux/features/auth/authSlice';
import Loader from '../../components/loader/Loader';

const initialState = {
    name: '',
    email: '',
    password: '',
    password2: '',
}

const Register = () => {
    const [fromData, setFromData] = useState(initialState);
    const {name, email, password, password2} = fromData;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {isLoading, isLoggedIn, isSuccess, message} = useSelector((state) => state.auth);

    const [uCase, setUCase] = useState(false)
    const [num, setNum] = useState(false)
    const [sChar, setSChar] = useState(false)
    const [passLength, setPassLength] = useState(false)

    const timesIcon = <FaTimes color='red' size={15}/>
    const checkIcon = <BsCheckAll color='green' size={15}/>
    const switchIcon = (condition) => {
        if (condition) return checkIcon;
        return timesIcon;
    }


    const handleInputChange = (e) => {
        const {name, value} = e.target

        setFromData({...fromData, [name]: value});
    };

    useEffect(() => {
        // Check Lower and Uppercase
        // if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
        //     setUCase(true);
        // } else {
        //     setUCase(false);
        // }

        // // Check for numbers
        // if (password.match(/([0-9])/)) {
        //     setNum(true);
        // } else {
        //     setNum(false);
        // }

        // Check for special character
        // if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
        //     setSChar(true);
        // } else {
        //     setSChar(false);
        // }

        // Check for PASSWORD LENGTH
        if (password.length > 5) {
            setPassLength(true);
        } else {
            setPassLength(false);
        }
    }, [password]);

    const registerUser = async (e) =>{
        e.preventDefault()

        if(!name || !email || !password){
            return toast.error('All field are required');
        }
        if(password.length < 6){
            return toast.error('Password must be at least 6 characters');
        }

        if(password.length > 20){
            return toast.error('Password must be at most 20 characters');
        }

        if(!email){
            return toast.error('Invalid email');
        }

        if(password !== password2){
            return toast.error('Password do not match');
        }

        const userData = {
            name, email, password
        }

        console.log(userData);

        await dispatch(register(userData));
    };

    useEffect(() =>{
        if(isSuccess && isLoggedIn){
            navigate('/profile');     
        }

        dispatch(RESET());
    }, [isLoggedIn, isSuccess, dispatch, navigate])


    return (<div className={`container ${styles.auth}`}>

        {isLoading && <Loader/>}
        <Card cardClass={''}>
            <div className={styles.form}>
                <div className='--flex-center'>
                    <TiUserAddOutline size={35} color={'#999'}></TiUserAddOutline>
                </div>
                <h2>Register</h2>

                <form onSubmit={registerUser}>

                    <input type={"text"}
                           value={name}
                           name={'name'}
                           placeholder={"Name"}
                           required
                           onChange={handleInputChange}
                    />

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
                    />

                    <PasswordInput
                        placeholder={'Confirm Password'}
                        name={'password2'}
                        value={password2}
                        onChange={handleInputChange}
                        onPaste={(e) =>{
                            e.preventDefault();
                            toast.error('Cannot paste into input field');
                            return false
                        }}
                    />

                    <Card cardClass={styles.group}>
                        <ul className='form-list'>
                            <li>
                                <span className={styles.indicator}>
                                {switchIcon(uCase)} &nbsp; Lowercase &  Uppercase
                                </span>
                            </li>
                            <li>
                                <span className={styles.indicator}>
                                {switchIcon(num)} &nbsp; Number (0 - 9)
                                </span>
                            </li>
                            <li>
                                <span className={styles.indicator}>
                                {switchIcon(sChar)} &nbsp; Special Character
                                </span>
                            </li>
                            <li>
                                <span className={styles.indicator}>
                                {switchIcon(passLength)} &nbsp; At least 6 character
                                </span>
                            </li>
                        </ul>

                    </Card>

                    <button type={"submit"} className='--btn --btn-primary --btn-block'>Register</button>

                </form>

                <span className={styles.register}>
                    <Link to={'/'}>Home</Link>
                    <p> &nbsp; Already have an account? &nbsp;</p>
                    <Link to={'/login'}>Login</Link>

                </span>


            </div>

        </Card>

    </div>);
};

export default Register;