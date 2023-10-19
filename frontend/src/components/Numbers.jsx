import Entry from "./Entry"
import numberService from '../services/numbers'

const Numbers = ({people, deleteID}) => {

    return (
        <div>
            {people.map(person => {
                return (
                    <Entry key={person.id} person={person} deleteHandler={() => deleteID(person.id)}/>
                )})}
        </div>
    )
}

export default Numbers