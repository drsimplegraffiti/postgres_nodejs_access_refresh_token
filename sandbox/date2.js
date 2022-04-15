const date = new Date();
const startDate = `${date.getFullYear()}-${
  date.getMonth() + 1
}-${date.getDate()}`;

console.log(startDate);
date.setMonth(date.getMonth() + 1);
console.log(date);
date.setDate(date.getDate() + 30);
console.log(date);

const d = new Date(date);
const endDate = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
