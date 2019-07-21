export enum ContentName {
  Permits = 'permits',
  Crimes = 'crimes'
}

// the minimum time the progress bar should stay visible before becoming invisible.
export const ProgressbarDelay = 1000;

// tslint:disable-next-line: max-line-length
export const PERMITS_SEARCHABLE_FILEDS = ['property_owner_name', 'parcel_owner_name', 'contractor', 'contractor_name'];

export const EMPTY_DESERIALIZED_FIELD_LABEL = 'n/a';

export const enum FieldType {
  Address = 'Address',
  Coordinates = 'Coordinates',
  Currency = 'Currency',
  Date = 'Date',
  Empty = 'Empty',
  Other = 'Other'
}
