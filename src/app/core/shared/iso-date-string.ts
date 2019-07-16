export class ISODateStringConverter {
  // https://regex101.com/r/zZ1pF9/1
  // validator: RegExp = /\d{4}(.\d{2}){2}(\s|T)(\d{2}.){2}\d{2}/;

  static convert(date: Date, removeSuffix = true): ISODateString {
    return (removeSuffix) ? date.toISOString().replace('Z', '') : date.toISOString();
  }
}

export type ISODateString = string;
