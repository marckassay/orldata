import { Injectable } from '@angular/core';
import { DatasetIDs } from 'src/environments/environment';

export interface CatalogItem {
  readonly id: DatasetIDs;
  readonly routeLink: string;
  name?: string;
  category?: string;
  description?: string;
  dataUpdatedAt?: Date | undefined;
  disabled?: boolean;
}

@Injectable()
export class CatalogItems {

  CATALOG: CatalogItem[] = [
    { id: DatasetIDs.PERMITS, routeLink: 'permits' },
    { id: DatasetIDs.CRIMES, routeLink: 'crimes' }
  ];

  getAllItems(): CatalogItem[] {
    return this.CATALOG;
  }

  getItemById(id: DatasetIDs): CatalogItem {
    // try to match this app's dataset IDs to the id from services.
    try {
      return this.CATALOG.find(item => item.id === id) as CatalogItem;
    } catch (error) {
      throw error;
    }
  }
}
