/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./table.css";
import axios from "axios";
import { sortResults } from "../utils/sortResults";
import Pagination from "./Pagination";
import SelectDataPerPage from "./SelectDataPerPage";
import ExportData from "../utils/ExportData";
import Loader from "../utils/Loader";
import errorImg from "../assets/error.svg";
// import { Link } from "react-router-dom";

// component for searching books
const SearchBar = ({ searchBooks, setData }) => {
  const [searchValue, setSearchValue] = useState("");
  const submitForm = (e) => {
    e.preventDefault();
    searchBooks(searchValue);
  };
  return (
    <div className="search-bar">
      <form onSubmit={submitForm}>
        <input
          type="text"
          placeholder="Search a Book"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </form>
      <SelectDataPerPage setData={setData} />
    </div>
  );
};

const Table = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalBooksCount, setTotalBooksCount] = useState(0);
  const [dataPerPage, setDataPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });

  const setData = (newDataPerPage) => {
    setDataPerPage(newDataPerPage);
  };

  const selectPage = (newSelectedPage) => {
    setPage(newSelectedPage);
  };

  const searchBooks = async (newSearchValue) => {
    setSearchValue(newSearchValue);
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/search?q=${searchValue}&limit=${dataPerPage}&offset=${
          page * dataPerPage - dataPerPage
        }`
      );
      const books = response.data.docs;
      const resultsFound = response.data.numFound;

      const bookDetails = await Promise.all(
        books.map(async (book) => {
          const authorKey = book.author_key || [];

          // fetching author details
          const authorDetails = await Promise.all(
            authorKey.map(async (author) => {
              if (!authorKey) return;
              const authorResponse = await axios.get(
                `http://localhost:5000/author/${author}`
              );
              return {
                authorName: authorResponse.data.name || "N/A",
                birthDate: authorResponse.data.birth_date || "N/A",
                topWork:
                  (await fetchTopWork(authorResponse.data.name, authorKey)) ||
                  "N/A",
              };
            })
          );

          if (authorDetails.length === 0) {
            authorDetails.push({
              name: "N/A",
              birthDate: "N/A",
              topWork: "N/A",
            });
          }

          // removing duplicates in subject
          let uniqueSubjects = [...new Set(book.subject)];

          if (uniqueSubjects.length == 0) {
            uniqueSubjects.push("N/A");
          }

          return {
            title: book.title || "N/A",
            firstPublishYear: book.first_publish_year || "N/A",
            subject: uniqueSubjects,
            authors: authorDetails,
            ratingsAverage: book.ratings_average || "N/A",
          };
        })
      );
      setBooks(bookDetails);
      setTotalBooksCount(resultsFound);
      setLoading(false);
    } catch (error) {
      setError(true);
      console.log("Error fetching data:", error);
    }
  };

  // fetching topwork using author details
  const fetchTopWork = async (authorName, authorKey) => {
    const authorResponse = await axios.get(
      `http://localhost:5000/authors?q=${authorName}`
    );
    const authorRequired = authorResponse.data.docs.filter((doc) => {
      return doc.key == authorKey;
    });

    return authorRequired.map((item) => item.top_work)[0];
  };

  // calculating total pages based on the number of results obtained
  const totalPages = Math.floor(totalBooksCount / dataPerPage);

  useEffect(() => {
    fetchBooks();
  }, [searchValue, dataPerPage, page]);

  // function to handle sorting
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedResults = sortResults(books, sortConfig);

  return (
    <>
      <div>
        <SearchBar searchBooks={searchBooks} setData={setData} />
      </div>
      {error ? (
        <img src={errorImg} />
      ) : loading ? (
        <Loader />
      ) : (
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("title")}>Title</th>
              <th onClick={() => handleSort("authors")}>Authors</th>
              <th onClick={() => handleSort("firstPublishYear")}>
                First Publish Year
              </th>
              <th onClick={() => handleSort("subject")}>Subject</th>
              <th onClick={() => handleSort("authorsBirthDates")}>
                Author Birth Dates
              </th>
              <th onClick={() => handleSort("authorsTopWorks")}>Top Work</th>
              <th onClick={() => handleSort("ratingsAverage")}>
                Ratings Average
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((book, index) => (
              <tr key={index}>
                <td>{book.title}</td>
                <td>
                  {book.authors.map((author) => author.authorName).join(", ")}
                </td>
                <td>{book.firstPublishYear}</td>
                <td>{book.subject ? book.subject.join(", ") : "N/A"}</td>
                <td>
                  {book.authors.map((author) => author.birthDate).join(", ")}
                </td>
                <td>
                  {book.authors.map((author) => author.topWork).join(", ")}
                </td>
                <td>{book.ratingsAverage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Pagination selectPage={selectPage} totalPages={totalPages} page={page} />
      <ExportData data={books} error={error} loading={loading} />
    </>
  );
};

export default Table;
