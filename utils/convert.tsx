export function createKeyWords(names: string) {
  let arrNames: string[] = [];
  let curName = "";
  names.split("").forEach((letter) => {
    curName += letter;
    arrNames.push(curName);
  });
  names.split(" ").forEach((letter) => {
    curName = "";
    letter.split("").forEach((char) => {
      curName += char;
      arrNames.push(curName);
    });
  });
  arrNames = [...new Set(arrNames.map((r) => r))];
  return arrNames;
}
