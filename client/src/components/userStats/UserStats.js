import './UserStats.scss'
import InfoBox from "../infoBox/InfoBox";
import {FaUsers} from "react-icons/fa";
import {BiUserCheck, BiUserMinus, BiUserX} from "react-icons/bi";

const icon1 = <FaUsers size={40} color={'#fff'}></FaUsers>
const icon2 = <BiUserCheck size={40}></BiUserCheck>
const icon3 = <BiUserMinus size={40}></BiUserMinus>
const icon4 = <BiUserX size={40} color={'#fff'}></BiUserX>

const UserStats = () => {
    return(
        <div className='user-summary'>
            <h3 className='--mt'>User Stats</h3>
            <div className='info-summary'>
                <InfoBox icon={icon1} title={'Total Users'} count={6} bgColor='card1'></InfoBox>
                <InfoBox icon={icon1} title={'Verified Users'} count={4} bgColor='card2'></InfoBox>
                <InfoBox icon={icon1} title={'Unverified Users'} count={1} bgColor='card3'></InfoBox>
                <InfoBox icon={icon1} title={'Suspended Users'} count={1} bgColor='card4'></InfoBox>
            </div>

        </div>
    )
  
};

export default UserStats;