import { Injectable } from '@angular/core';

export interface CatalogItem {
  id: string;
  name: string;
  updated: Date | undefined;
  disabled?: boolean;
}

const CATALOG = [
  {
    id: 'permits',
    name: 'Permit Applications',
    updated: undefined
  },
  {
    id: 'crimes',
    name: 'City of Orlando Crimes',
    updated: undefined,
    disabled: true
  }
];

@Injectable()
export class CatalogItems {

  getAllItems(): CatalogItem[] {
    return CATALOG;
  }

  getItemById(id: string): CatalogItem | undefined {
    return CATALOG.find(item => item.id === id);
  }
}
