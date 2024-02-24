import React, { useState, useEffect } from 'react';
import axios from 'axios';
import csvtojson from 'csvtojson';
import './App.css'; // Import the CSS file

function App() {
  const [csvData, setCsvData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterByCredit, setFilterByCredit] = useState(false);
  // const [count,setCount]=useState(0)
  let count=0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.kurukshetraceg.org.in/api/v1/admin/get-kusers?user=admin&access=thepowerofthesuninthepalmofmyhand');
        const csvData = await csvtojson().fromString(response.data);
        setCsvData(csvData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleFilterByCredit = (event) => {
    setFilterByCredit(event.target.checked);
  };

  const filteredData = csvData.filter((row) => {
    const rowValues = Object.values(row).join('').toLowerCase();
    const containsSearchText = rowValues.indexOf(searchText.toLowerCase()) !== -1;
    const containsCredit = rowValues.indexOf('true') !== -1;
    return (!filterByCredit || containsCredit) && containsSearchText;
  });
  // setCount(filteredData.length);
  count= filteredData.length;

  return (
    <div className="app-container">
      <div className="header">
        <input type="text" value={searchText} onChange={handleSearch} placeholder="Search..." />
 
        <label>
          <input type="checkbox" checked={filterByCredit} onChange={handleFilterByCredit} />
          Filter by Paid
        </label>
        <h2 class='count'>count: {count}</h2>
      </div>
      <div className="styled-table-container">

      <table className="styled-table">
        <thead>
          <tr>
            <th>S.NO</th>
            {csvData.length > 0 && Object.keys(csvData[0]).map((key, index) => (
              <th key={index}>{key}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              {Object.values(row).map((value, index) => (
                <td key={index}>{value}</td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
          </div>
    </div>
  );
}

export default App;
