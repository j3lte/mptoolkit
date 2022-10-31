import { dayjs } from "../../../deps.ts";

const tokenIdentifier = "%";
const amount = 10;

const getRndString = (len: number, an?: string) => {
  an = an && an.toLowerCase();
  let str = "";
  let i = 0;

  const min = an == "a" ? 10 : 0;
  const max = an == "n" ? 10 : 62;

  for (; i++ < len;) {
    let r = Math.random() * (max - min) + min << 0;
    str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
  }

  return tokenIdentifier + str + tokenIdentifier;
};

const getRndInteger = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

export const generateToken = () => {
  let date = dayjs().format("YYYY-MM-DD HH:mm:ss");
  let insertToIndex = 0;

  for (let i = 0; i < amount; i++) {
    insertToIndex = getRndInteger(insertToIndex, date.length);
    // console.log(`Index to insert: ${insertToIndex}`);
    const randomString = getRndString(getRndInteger(2, 6));
    date = date.substring(0, insertToIndex) + randomString + date.substring(insertToIndex);
    //Update next insertToIndex, currentIndex + the length of the inserted string. So the next insert will be after the last insert.
    insertToIndex += randomString.length;
    // console.log(`date string: ${date}`);
  }

  return date;
};
