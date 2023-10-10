import { secretKey } from "@/config/key";
import CryptoJS from "crypto-js";

export function encryptTheValue(object: any) {
  const encJson = CryptoJS.AES.encrypt(
    JSON.stringify(object),
    secretKey
  ).toString();
  const encData = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(encJson)
  );
  return encData;
}

export function decryptTheValue(object: any) {
  const decData = CryptoJS.enc.Base64.parse(object).toString(CryptoJS.enc.Utf8);
  const bytes = CryptoJS.AES.decrypt(decData, secretKey).toString(
    CryptoJS.enc.Utf8
  );
  return JSON.parse(bytes);
}
