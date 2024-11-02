import styles from './auth.module.scss'
import Card from "../../components/card/Card";
import {useState} from "react";
import {Link} from "react-router-dom";
import {MdPassword} from "react-icons/md";
import PasswordInput from "../../components/passwordInput/PasswordInput";

const initialState = {
    password: '',
    password2: '',
}

const Reset = () => {
    const [fromData, setFromData] = useState(initialState);
    const {password, password2} = fromData;


    const handleInputChange = (e) => {
        const {name, value} = e.target

        setFromData({...fromData, [name]: value});
    }
    const loginUser = () => {
    }

    return (
        <div className={`container ${styles.auth}`}>
            <Card cardClass={''}>
                <div className={styles.form}>
                    <div className='--flex-center'>
                        <MdPassword size={35} color={'#999'}></MdPassword>
                    </div>
                    <h2>Reset Password</h2>

                    <form onSubmit={loginUser}>
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
                        />

                        <button type={"submit"} className='--btn --btn-primary --btn-block'>Reset Password</button>

                        <div className={styles.links}>
                            <p><Link to={'/'}>- Home</Link></p>
                            <p><Link to={'/login'}>Login</Link></p>

                        </div>
                    </form>


                </div>

            </Card>

        </div>
    );
};

export default Reset;