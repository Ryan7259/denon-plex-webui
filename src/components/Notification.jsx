import { useSelector, useDispatch } from 'react-redux'
import { resetGotNotification } from '../reducers/notificationSlice'
import './Notification.css'

const Notification = () =>
{
    const notification = useSelector(state => state.notification.message)
    const gotNotification = useSelector(state => state.notification.gotNotification)
    const dispatch = useDispatch()

    return (
        <div className={`alert ${gotNotification ? 'alert-show' : 'alert-hide'}`} onTransitionEnd={() => {
            dispatch(resetGotNotification())
        }}>
            {notification}
        </div>
    )
}

export default Notification