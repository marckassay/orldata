import { DateConverter, ISODateString } from '@core/shared/date-converter';

export const getToday = (asISODateString = false): Date | ISODateString => {
  const date = new Date();
  return (asISODateString === false) ? date : DateConverter.convert(date);
};

export const getDate24HoursAgo = (asISODateString = false): Date | ISODateString => {
  const date = new Date();
  date.setHours(-24);
  return (asISODateString === false) ? date : DateConverter.convert(date);
};

export const getDateOneWeekAgo = (asISODateString = false): Date | ISODateString => {
  const date = new Date();
  date.setHours(-168);
  return (asISODateString === false) ? date : DateConverter.convert(date);
};

export const getDateOneMonthAgo = (asISODateString = false): Date | ISODateString => {
  const date = new Date();
  const month = date.getMonth();
  date.setMonth((month !== 0) ? month - 1 : 11);
  return (asISODateString === false) ? date : DateConverter.convert(date);
};

export const getDateOneYearAgo = (asISODateString = false): Date | ISODateString => {
  const date = new Date();
  const year = date.getFullYear();
  date.setFullYear(year - 1);
  return (asISODateString === false) ? date : DateConverter.convert(date);
};

export const getDateFromRadioGroupTime = (
  value: 0 | 1 | 2 | 3 | 4 | undefined,
  asISODateString = false): Date | ISODateString | undefined => {

  if (typeof value === 'string') {
    value = (value as string).toInt() as any;
  }

  switch (value) {
    case 1: return getDate24HoursAgo(asISODateString);
    case 2: return getDateOneWeekAgo(asISODateString);
    case 3: return getDateOneMonthAgo(asISODateString);
    case 4: return getDateOneYearAgo(asISODateString);
    default: return undefined;
  }
};

export const getISODateFromRadioGroupTime = (value: 0 | 1 | 2 | 3 | 4 | undefined): ISODateString | undefined => {
  return getDateFromRadioGroupTime(value, true) as ISODateString | undefined;
};

declare global {
  interface String {
    toInt: () => number;
  }
}

// tslint:disable-next-line: space-before-function-paren
String.prototype.toInt = function (): number {
  return parseInt(this.valueOf(), 10);
};
