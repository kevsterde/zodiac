import { useState } from "react";
import "./App.css";
import zodiacData from "./assets/data/dataZodiac.json";

function App() {
  const [show, setShow] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const [input, setInput] = useState("");
  const [person, setPerson] = useState([]);
  const [error, setError] = useState("");
  const handleInputChange = (e) => {
    setInput(e.target.value);
    setError("");
    setShow(false);
    console.log(input);
  };

  const getAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleVerifyInput = () => {
    const regex =
      /^(.*),\s*(0?[1-9]|1[0-2])-(0?[1-9]|1\d|2\d|3[01])-(19|20)\d{2}$/;
    return regex.test(input);
  };

  const handleVerifyBirthdateYear = (year) => {
    if (year > 1947 && year < 2032) {
      return true;
    } else {
      return false;
    }
  };

  const getZodiac = (year) => {
    for (const name in zodiacData) {
      if (zodiacData[name].date.includes(year)) {
        return name;
      }
    }
    setError("Zodiac Not Found");
    return null;
  };

  const sortBirthdate = () => {
    console.log("sorting");
    const temp = [...person].sort(
      (a, b) => new Date(b.birthdate) - new Date(a.birthdate)
    );
    setPerson(temp);
  };

  const handleAddPerson = () => {
    if (input === "*") {
      setInput("");
      setPerson([]);
      setShow(false);
      return;
    }
    if (!input) {
      if (person.length == 0) {
        setError("Empty Person Data");
        return;
      }
      setShow(true);
      console.log(show);
      sortBirthdate();
    } else {
      const verifyInput = handleVerifyInput();
      if (!verifyInput) {
        setError("Invalid Input Format. Ex: Fullname, Birthdate(mm-dd-yyyy)");
        return;
      }

      const [name, birthdate] = input.split(",");
      const [month, day, year] = birthdate.trim().split("-").map(Number);

      const verifyBirthdateYear = handleVerifyBirthdateYear(year);
      if (!verifyBirthdateYear) {
        setError("Birthdate year must be 1948 until 2031");
        return;
      }

      const age = getAge(new Date(year, month - 1, day));

      const zodiac = getZodiac(year);
      setPerson((prevPerson) => [
        ...prevPerson,
        {
          name: name.trim(),
          birthdate: `${month}-${day}-${year}`,
          age,
          zodiac,
        },
      ]);

      setInput("");
    }
  };
  return (
    <div className="container">
      <a href="" className="code">
        Show Code
      </a>
      <h1>Zodiac Sign</h1>
      <div className="flex">
        <small>Enter &apos;*&apos; to reset data</small>
        {error && <small className="error">{error}</small>}
      </div>

      <input
        type="text"
        placeholder="Person’s Name, Birth Date(mm-dd-yyyy)"
        value={input}
        onChange={handleInputChange}
      />
      <button
        type="submit"
        onClick={handleAddPerson}
        className={`${!input ? "done" : ""}`}
      >
        {!input ? "Show Summary" : input === "*" ? "Reset" : "Submit"}
      </button>

      {show && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Birthdate</th>
              <th>Age</th>
              <th>Zodiac Sign</th>
            </tr>
          </thead>
          <tbody>
            {person.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.birthdate}</td>
                <td>{item.age}</td>
                <td>{item.zodiac}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
