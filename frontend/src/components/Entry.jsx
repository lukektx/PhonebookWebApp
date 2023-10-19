const Entry = ({person, deleteHandler}) => {
    return (
        <p>
            {person.name} {person.number}
            <button onClick={deleteHandler}>delete</button>
        </p>
    )
}

export default Entry