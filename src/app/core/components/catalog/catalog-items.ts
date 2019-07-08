import { Injectable } from '@angular/core';
import { ContentName } from '@app/constants';
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
    { id: DatasetIDs.PERMITS, routeLink: ContentName.Permits, disabled: false },
    { id: DatasetIDs.CRIMES, routeLink: ContentName.Crimes, disabled: true }
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

  getItemByName(name: ContentName | string): CatalogItem {
    try {
      return this.CATALOG.find(item => item.routeLink === name) as CatalogItem;
    } catch (error) {
      throw error;
    }
  }
}
