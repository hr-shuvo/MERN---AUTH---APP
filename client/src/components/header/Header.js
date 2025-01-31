import "./Header.scss"
import {IoLogInOutline} from "react-icons/io5";
import {FaUserCircle} from "react-icons/fa";
import {Link, NavLink, useNavigate} from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout, RESET } from "../../redux/features/auth/authSlice";

const activeLink = ({isActive}) => (isActive ? 'active' : '')

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const goHome = () =>{
        navigate('/')
    }

    const logoutUser = async () =>{

        dispatch(RESET());

        await dispatch(logout());    
        
        navigate('/')
    }

    return (
        <header className={'header'}>
            <nav>
                <div className="logo" onClick={goHome}>
                    <IoLogInOutline size={35}/>
                    <span>AUTH:Z</span>
                </div>

                <ul className='home-links'>
                    <li className='--flex-center'>
                        <FaUserCircle size={20}/>
                        <p className='--color-white'>
                            Hi, Shuvo
                        </p>
                    </li>
                    <li>
                        <button className='--btn --btn-primary'>
                            <Link to={'/login'}>Login</Link>
                        </button>
                    </li>
                    <li>
                        <NavLink className={activeLink} to={'/profile'}>
                            Profile
                        </NavLink>
                    </li>

                    <li>
                        <button className='--btn --btn-secondary' onClick={logoutUser}>
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;