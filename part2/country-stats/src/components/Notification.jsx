const Notification = ({ message }) => {
    if (message === null) {
        return null
    }

    return (
        <div className="message" style={{ margin: "1em" }}>
            {message}
        </div>
    )
}

export default Notification