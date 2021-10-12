export function getCurrentMonth() {
    var date = new Date();
    var dateString = `${getMonthName(
      date.getMonth()
    )} ${date.getFullYear()}`;
    return dateString;
  }

export function getAllMonths(){
    var year = new Date().getFullYear();
    var final = [];
    for (let index = 1; index <= 12; index++) {
        final.push(`${getMonthName(index)} ${year}`);
    }
    return final;
}

  
export function sameDay(d1, d2) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

export function getMonthName(id) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[id];
  }