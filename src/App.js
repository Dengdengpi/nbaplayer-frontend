import React, { useState } from 'react';
import './app.css'
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [players, setPlayers] = useState([]);
  const [mine, setMine] = useState(false);

  const [textValue, setTextValue] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");
  const [booleanValue, setBooleanValue] = useState(false);

  const [provideValue, setProvide] = useState(true)
  const [id, setId] = useState(0)

  const [responseId, setReponseId] = useState(0)

  const [responses, setResponses] = useState([])

  const [error, setError] = useState(false);

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };

  const handleDropdownChange = (event) => {
    setDropdownValue(event.target.value);
  };

  const handleBooleanChange = (event) => {
    setBooleanValue(event.target.checked);
  };

  const handleSubmit_response = (event) => {
    event.preventDefault();
    console.log("Text value:", textValue);
    console.log("Dropdown value:", dropdownValue);
    console.log("Boolean value:", booleanValue);
    if(!textValue || !dropdownValue){
      setProvide(false);
      return false;
    } else {
      setProvide(true)
    }
    console.log(1)
    axios.post(`http://localhost:5000/`, {name: textValue, why: dropdownValue, watched: booleanValue})
      .then((response) => {
        setId(response.data.id)
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
   
    console.log(formData.name)
    axios.get(`https://www.balldontlie.io/api/v1/players?search=${formData.name}`)
      .then((response) => {
        setPlayers(response.data.data)
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const change = () => {
    if(mine === false){
      setMine(true)
    } else{
      setMine(false)
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleGet = (event) => {
    event.preventDefault();
    // Handle form submission
    if(!responseId){
      axios.get(`http://localhost:5000/`)
      .then((response) => {
        setResponses(response.data.players)
        setError(false)
      })
      .catch((error) => {
        console.error(error);
      });
    } else {
      axios.get(`http://localhost:5000/${responseId}`)
      .then((response) => {
        const arr = [response.data.player]
        setResponses(arr)
        setError(false)
      })
      .catch((error) => {
        console.error(error);
        setError(true)
        setResponses([])
      });
    }
    console.log(responses)
  };
  if(mine === false){
    return (
      <div>
      <button type="button" onClick={change}>Switch</button>
        <h1>Search Player Information</h1>
        <form onSubmit={handleSubmit}>
          <label>
            player name:
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
          </label>
          <button type="submit">Submit</button>
        </form>
        <h1>NBA Players</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Position</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {players.map(player => (
              <tr key={player.id}>
                <td>{player.id}</td>
                <td>{player.first_name}</td>
                <td>{player.last_name}</td>
                <td>{player.position}</td>
                <td>{player.team.full_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  else {
    return (
      <div>
      {provideValue ? <h1> </h1> : <h1 className='red'>please provide all the Information</h1>}
      <h1>Your fav nba player</h1>
      <form onSubmit={handleSubmit_response}>
      <button type="button" onClick={change}>Switch</button>
        <label htmlFor="text-input">Name of the player:</label>
        <input
          id="text-input"
          type="text"
          value={textValue}
          onChange={handleTextChange}
        />
        <label htmlFor="dropdown-input">What you like about him:</label>
        <select id="dropdown-input" value={dropdownValue} onChange={handleDropdownChange}>
          <option value="">Please select an option</option>
          <option value="strong">strong</option>
          <option value="fast">fast</option>
          <option value="skilled">skilled</option>
        </select>
        <label htmlFor="boolean-input">Did you ever watch his game?:</label>
        <input
          id="boolean-input"
          type="checkbox"
          checked={booleanValue}
          onChange={handleBooleanChange}
        />
        <button type="submit">Submit</button>
      </form>
      {id === 0? <></> : <h3>here is the id of your response: {id}</h3>}
      <br />
      <h1>get responses (if you don't provide id you will get all the responses)</h1>
      <form onSubmit={handleGet} style={{ textAlign: 'right' }}>
      <label>
        response id:
        <input type="text" value={responseId} onChange={(e) => setReponseId(e.target.value)}/>
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
    {error===true? <h3>provide the right id!</h3>: <></>}
    <table>
          <thead>
            <tr>
            <th>response id</th>
              <th>Name</th>
              <th>Watched</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            {responses.map(player => (
              <tr key={player._id}>
              <td>{player._id}</td>
                <td>{player.name}</td>
                <td>{player.watched.toString()}</td>
                <td>{player.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;

