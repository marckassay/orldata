import { Pipe, PipeTransform } from '@angular/core';

interface GeoLocationShape {
  'type': 'Point';
  'coordinates': [number, number];
}

/**
 * {"type":"Point","coordinates":[-81.381856,28.581373]}
 */
@Pipe({ name: 'geolocation' })
export class GeoLocationPipe implements PipeTransform {

  transform(value: GeoLocationShape): string {

    if (value.type === 'Point') {
      return 'lat: ' + value.coordinates[1] + '<br>' + 'long: ' + value.coordinates[0];
    } else {
      return value.toString();
    }
  }
}
