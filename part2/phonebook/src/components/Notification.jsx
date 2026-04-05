const Notification = ({ message, isSuccess = true}) => {
    if (message === null) {
        return null
    }

    return (
        <div className={isSuccess ? "success" : "error"}>
            {message}
        </div>
    )
}

export default Notification