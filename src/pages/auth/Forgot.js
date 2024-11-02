import styles from './auth.module.scss'
import Card from "../../components/card/Card";
import {useState} from "react";
import {Link} from "react-router-dom";
import {AiOutlineMail} from "react-icons/ai";

const initialState = {
    email: '',
}
const Forgot = () => {
    const [fromData, setFromData] = useState(initialState);
    const {email} = fromData;

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
                        <AiOutlineMail size={35} color={'#999'}></AiOutlineMail>
                    </div>
                    <h2>Forgot Password</h2>

                    <form onSubmit={loginUser}>
                        <input type={"email"}
                               value={email}
                               name={'email'}
                               placeholder={"Email"}
                               required={true}
                               onChange={handleInputChange}
                        />

                        <button type={"submit"} className='--btn --btn-primary --btn-block'>Get Reset Link</button>

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

export default Forgot;