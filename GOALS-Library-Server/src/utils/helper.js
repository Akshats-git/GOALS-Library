const threeWeeksLater = () => {
    const date = new Date();
    date.setDate(date.getDate() + 21); // Adds 21 days (3 weeks) to the current date
    return date;
  };

  module.exports = threeWeeksLater;