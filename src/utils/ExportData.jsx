import { CSVLink } from "react-csv";

// eslint-disable-next-line react/prop-types
const ExportData = ({ data, error, loading }) => {
  // eslint-disable-next-line react/prop-types
  const modifiedData = data.map((book) => {
    return {
      title: book.title,
      author: book.authors.map((author) => author.authorName).join(", "),
      firstPublishyear: book.firstPublishYear,
      subject: book.subject ? book.subject.join(", ") : "N/A",
      birthDate: book.authors.map((author) => author.birthDate).join(", "),
      topWork: book.authors.map((author) => author.topWork).join(", "),
      ratingsAverage: book.ratingsAverage,
    };
  });
  const headers = [
    {
      label: "Title",
      key: "title",
    },
    {
      label: "Author",
      key: "author",
    },
    {
      label: "First publish year",
      key: "firstPublishYear",
    },
    {
      label: "Subject",
      key: "subject",
    },
    {
      label: "Birth Date",
      key: "birthDate",
    },
    {
      label: "Top-work",
      key: "topWork",
    },
    {
      label: "Ratings Average",
      key: "ratingsAverage",
    },
  ];

  return (
    <div>
      {error || loading ? (
        <button
          style={{
            float: "right",
            margin: "1rem",
            backgroundColor: "lightgray",
          }}
        >
          No Data Available
        </button>
      ) : (
        <CSVLink data={modifiedData} headers={headers} filename={"books.csv"}>
          <button style={{ float: "right" }}>Download data</button>
        </CSVLink>
      )}
    </div>
  );
};

export default ExportData;
