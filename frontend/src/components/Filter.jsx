const Filter = ({filter, handleFilterInput}) => {
    return (
        <div>
            filter by: <input value={filter} onChange={handleFilterInput}/>
        </div>
    )
}

export default Filter