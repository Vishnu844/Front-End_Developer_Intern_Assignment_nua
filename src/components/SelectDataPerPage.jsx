import { useState } from "react";
import './select.css'

//select tag to select number of books to be rendered

// eslint-disable-next-line react/prop-types
const SelectDataPerPage = ({ setData }) => {
  // eslint-disable-next-line no-unused-vars
  const [dataPerPage, setDataPerPage] = useState(10);
  const handleDataPerPage = (e) => {
    setDataPerPage(e.target.value);
    setData(e.target.value);
  };
  return (
    <div className="select-data-per-page">
      <select onChange={handleDataPerPage} value={dataPerPage}>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
  );
};

export default SelectDataPerPage