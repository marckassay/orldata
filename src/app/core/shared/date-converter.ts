export class DateConverter {
  static convert(date: Date, removeSuffix = true): ISODateString {
    return (removeSuffix) ? date.toISOString().replace('Z', '') : date.toISOString();
  }
}

export type ISODateString = string;
