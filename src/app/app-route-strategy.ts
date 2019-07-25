import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { RouteReuseStrategy } from '@angular/router/';

export interface AllowRetriveCacheDictionary {
  'table': boolean;
  'form': boolean;
}

export class CacheableRoutesUtil<T> {
  private entries: T;

  constructor(value: T) {
    this.entries = value;
  }

  setEntry(key: keyof T, value: T[keyof T]): void {
    this.entries[key] = value;
  }

  getEntry(key: keyof T): T[keyof T] {
    return this.entries[key];
  }

  containsEntry(value: keyof T | any): boolean {
    const check = this.getEntry(value);
    return check !== undefined;
  }
}

export class AppRouteStrategy implements RouteReuseStrategy {
  storedRouteHandles = new Map<string, DetachedRouteHandle>();
  util = new CacheableRoutesUtil<AllowRetriveCacheDictionary>({ table: true, form: true });

  /**
   * Determines if a route should be reused.
   */
  shouldReuseRoute(before: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    const beforePath = this.getPath(before);
    const currentPath = this.getPath(curr);

    const preset = beforePath === 'table' || beforePath === 'form';
    if (this.util.containsEntry(currentPath)) {
      this.util.setEntry(currentPath as keyof AllowRetriveCacheDictionary, preset);
    }

    const results = before.routeConfig === curr.routeConfig;
    return results;
  }

  /**
   * Determines if this route (and its subtree) should be reattached
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = this.getPath(route);
    let results = false;
    if (this.util.getEntry(path as keyof AllowRetriveCacheDictionary)) {
      results = this.storedRouteHandles.has(this.getPath(route));
    }
    return results;
  }

  /**
   * Retrieves the previously stored route
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.storedRouteHandles.get(this.getPath(route)) as DetachedRouteHandle;
  }

  /**
   * Determines if this route (and its subtree) should be detached to be reused later
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const path = this.getPath(route);
    const results = this.util.containsEntry(path);
    return results;
  }

  /**
   * Stores the detached route.
   *
   * Storing a `null` value should erase the previously stored value.
   */
  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
    this.storedRouteHandles.set(this.getPath(route), detachedTree);
  }

  private getPath(route: ActivatedRouteSnapshot): string {
    if (route.routeConfig !== null && route.routeConfig.path !== undefined) {
      return route.routeConfig.path;
    }
    return '';
  }
}
