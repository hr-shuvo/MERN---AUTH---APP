import {useState} from "react";


const ChangeRole = () => {
    const [userRole, setUserRole] = useState('')

    return(
        <div className='sort'>
            <form className='--flex-start'>
                <select value={userRole} onChange={(e) =>setUserRole(e.target.value)}>
                    <option value="">-- Select --</option>
                    <option value="subscriber">Member</option>
                    <option value="author">Author</option>
                    <option value="admin">Admin</option>
                    <option value="suspended">Suspended</option>

                </select>
            </form>
        </div>
    )

}

export default ChangeRole;