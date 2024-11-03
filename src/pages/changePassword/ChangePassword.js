import Card from "../../components/card/Card";
import profileImg from '../../assets/avatarr.png'
import './ChangePassword.scss'
import {useState} from "react";
import PageMenu from "../../components/pageMenu/PageMenu";
import PasswordInput from "../../components/passwordInput/PasswordInput";

const initialState = {
    oldPassword: '',
    password: '',
    password2: '',
}

const ChangePassword = () => {
    const [fromData, setFromData] = useState(initialState)
    const {oldPassword, password, password2} = fromData;

    const handleInputChange = () => {

    }

    return (
        <>
            <section>
                <div className="container">
                    <PageMenu></PageMenu>

                    <h2>Change Password</h2>

                    <div className="--flex-start profile">
                        <Card cardClass={'card'}>
                            <>
                                <form action="">
                                    <p>
                                        <label>Current Password:</label>
                                        <PasswordInput
                                            placeholder={'Old Password'}
                                            name={'oldPassword'}
                                            value={oldPassword}
                                            onChange={handleInputChange}

                                        ></PasswordInput>
                                    </p>
                                    <p>
                                        <label>New Password:</label>
                                        <PasswordInput
                                            placeholder={'Password'}
                                            name={'password'}
                                            value={password}
                                            onChange={handleInputChange}

                                        ></PasswordInput>
                                    </p>
                                    <p>
                                        <label>Confirm New Password:</label>
                                        <PasswordInput
                                            placeholder={'Confirm Password'}
                                            name={'password2'}
                                            value={password2}
                                            onChange={handleInputChange}

                                        ></PasswordInput>
                                    </p>

                                    <button className='--btn --btn-danger --btn-block'>Change Password</button>

                                </form>

                            </>

                        </Card>
                    </div>
                </div>
            </section>
        </>
    )
};

export default ChangePassword;