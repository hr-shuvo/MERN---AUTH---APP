import "./PasswordInput.scss"
import {useState} from "react";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";

const PasswordInput = ({placeholder, value, onChange, name, onPaste}) => {
    const [showPassword, setShowPassword] = useState(false)

    const togglePassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className={'password'}>
            <input type={showPassword ? 'text' : 'password'}
                   value={value}
                   placeholder={placeholder}
                   required
                   name={name}
                   onChange={onChange}
                   onPaste={onPaste}
            />
            <div className='icon' onClick={togglePassword}>
                {showPassword ? (
                        <AiOutlineEyeInvisible size={20}/>
                    ) :
                    (
                        <AiOutlineEye size={20}/>
                    )
                }
            </div>
        </div>
    )
};

export default PasswordInput;