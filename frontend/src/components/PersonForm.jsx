const PersonForm = (props) => {
    return (
        <form>
            <div>
                name: <input value={props.newName} onChange={props.handleNameInput}/>
                <br/>
                number: <input value={props.newNumber} onChange={props.handleNumberInput}/>
            </div>
            <div>
                <button type="submit" onClick={props.addPerson}>add</button>
            </div>
        </form>
    )
}

export default PersonForm