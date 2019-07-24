export enum ContentName {
  Permits = 'permits',
  Crimes = 'crimes'
}

// the minimum time the progress bar should stay visible before becoming invisible.
export const ProgressbarDelay = 1000;

// tslint:disable-next-line: max-line-length
export const PERMITS_SEARCHABLE_FILEDS = [
  'property_owner_name',
  'parcel_owner_name',
  'contractor',
  'contractor_name'
];

export const EMPTY_DESERIALIZED_FIELD_LABEL = 'n/a';

export const enum FieldType {
  Address = 'Address',
  Coordinates = 'Coordinates',
  Currency = 'Currency',
  Date = 'Date',
  Label = 'Label',
  Other = 'Other'
}

export enum RadioGroupTime {
  'No Selection' = 0,
  'Past 24 hours',
  'Past week',
  'Past month',
  'Past year'
}

type RadioGroupTimeKeyType = keyof typeof RadioGroupTime;

export const RadioGroupTimeMap = new Map<RadioGroupTimeKeyType, number>([
  ['Past 24 hours', RadioGroupTime['Past 24 hours']],
  ['Past week', RadioGroupTime['Past week']],
  ['Past month', RadioGroupTime['Past month']],
  ['Past year', RadioGroupTime['Past year']],
]);

export const toRadioGroupTimeKey = (value: 0 | 1 | 2 | 3 | 4): RadioGroupTimeKeyType => {
  return RadioGroupTime[value] as RadioGroupTimeKeyType;
};

export const toRadioGroupTimeValue = (key: RadioGroupTimeKeyType): number => {
  return RadioGroupTimeMap.get(key) as number;
};
