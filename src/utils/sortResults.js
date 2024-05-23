export const sortResults = (books, sortConfig) => {
  return [...books].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === "authors") {
      aValue = a.authors.map((author) => author.name).join(", ");
      bValue = b.authors.map((author) => author.name).join(", ");
    } else if (sortConfig.key === "authorsBirthDates") {
      aValue = a.authors.map((author) => author.birthDate).join(", ");
      bValue = b.authors.map((author) => author.birthDate).join(", ");
    } else if (sortConfig.key === "authorsTopWorks") {
      aValue = a.authors.map((author) => author.topWork).join(", ");
      bValue = b.authors.map((author) => author.topWork).join(", ");
    } else if (sortConfig.key === "subject") {
      aValue = a.subject.join(", ");
      bValue = b.subject.join(", ");
    }

    if (aValue === undefined || aValue === "N/A") return 1;
    if (bValue === undefined || bValue === "N/A") return -1;

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });
};
