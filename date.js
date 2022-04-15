const todayDate = new Date();

const today = todayDate.getDate();
const month = todayDate.getMonth() + 1;
const year = todayDate.getFullYear();
const day = todayDate.getDay();
const hour = todayDate.getHours();
const minute = todayDate.getMinutes();
const second = todayDate.getSeconds();
const millisecond = todayDate.getMilliseconds();

const date = `${todayDate.getFullYear()}-${
  todayDate.getMonth() + 1
}-${todayDate.getDate()}`;

const time = `${todayDate.getHours()}:${todayDate.getMinutes()}:${todayDate.getSeconds()}`;

let dateAndTime = `${date}T${time}Z`;

console.log(todayDate);
console.log(
  `today's date: ${today},\n month of ${month},\n year: ${year},\n day: ${day},\n hour: ${hour},\n minute: ${minute},\n second: ${second},\n millisecond: ${millisecond}`
);
console.log(`date: ${date}`);
console.log(`time: ${time}`);
console.log(`date and time: ${dateAndTime}`);

let myDate1 = new Date('2022-04-01');
let myDate2 = new Date('2022-06-02');

let timeDifference = myDate2 - myDate1;
console.log({ timeDifference: timeDifference });
console.log({ convertTimeDifferenceToDate: new Date(timeDifference) });
console.log({
  convertTimeDifferenceToDate: new Date(timeDifference.toLocaleString()),
});
console.log({ numberOfDays: timeDifference / 1000 / 60 / 60 / 24 });
console.log({ numberOfDays2: timeDifference / (1000 * 3600 * 24) });
