// hash-generator.js
import bcrypt from "bcryptjs";

const password = "cueksteam12"; // ubah sesuai password baru
const saltRounds = 10;

bcrypt.hash(password, saltRounds).then((hash) => {
  console.log("Password asli:", password);
  console.log("Hash bcrypt:", hash);
});
