import { Injectable } from '@angular/core';

export interface CatalogItem {
  id: string;
  name: string;
  updated: Date;
  disabled?: boolean;
}

const CATALOG = [
  {
    id: 'permits',
    name: 'Permit Applications',
    updated: new Date('6/3/19')
  },
  {
    id: 'crimes',
    name: 'City of Orlando Crimes',
    updated: new Date('2/17/19'),
    disabled: true
  }
];

@Injectable()
export class CatalogItems {

  getAllItems(): CatalogItem[] {
    return CATALOG;
  }

  getItemById(id: string): CatalogItem {
    return CATALOG.find(i => i.id === id);
  }
}
