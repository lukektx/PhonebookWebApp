const Notification = ({message, style}) => {
    const errorStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }
    const successStyle = { ...errorStyle, color: 'green'}

    const requestedStyle = style === 'error' ? errorStyle : style === 'success' ? successStyle : {} 

    return message ? (
        <div style={requestedStyle}>
            <p>{message}</p>
        </div>
    ) : null
}

export default Notification