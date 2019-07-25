export enum ContentName {
  Permits = 'permits',
  Crimes = 'crimes'
}

export enum DatasetIDs {
  PERMITS = 'ryhf-m453',
  CRIMES = '4y9m-jbmz'
}

export const getEndpoint = (id: DatasetIDs) => `https://data.cityoforlando.net/resource/${id}.json`;

export const getMetaDataEndpoint = (id: DatasetIDs) => `https://data.cityoforlando.net/api/views/metadata/v1/${id}`;

export enum SnackBarActions {
  'SEE RESULTS',
  'DISMISS'
}

// the minimum time the progress bar should stay visible before becoming invisible.
export const ProgressbarDelay = 1000;

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
  'Past 24 hours' = 1,
  'Past week',
  'Past month',
  'Past year'
}

export type RGTKeyType = keyof typeof RadioGroupTime;

export const rgtMap = new Map<RGTKeyType, number>([
  ['Past 24 hours', 1],
  ['Past week', 2],
  ['Past month', 3],
  ['Past year', 4],
]);

export const toRadioGroupTimeKey = (value: 0 | 1 | 2 | 3 | 4): RGTKeyType => {
  return RadioGroupTime[value] as RGTKeyType;
};

export const toRadioGroupTimeValue = (key: RGTKeyType): number => {
  return rgtMap.get(key) as number;
};
