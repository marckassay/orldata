import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  id: string;
  type: string;
  address: string;
  owner: string;
  contractor?: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: '1', type: 'Hydrogen', address: '', owner: 'H', contractor: '' },
  { id: '2', type: 'Helium', address: '', owner: 'He' },
  { id: '3', type: 'Lithium', address: '', owner: 'Li' },
  { id: '4', type: 'Beryllium', address: '', owner: 'Be' },
  { id: '5', type: 'Boron', address: '', owner: 'B' },
  { id: '6', type: 'Carbon', address: '', owner: 'C' },
  { id: '7', type: 'Nitrogen', address: '', owner: 'N' },
  { id: '8', type: 'Oxygen', address: '', owner: 'O' },
  { id: '9', type: 'Fluorine', address: '', owner: 'F' },
  { id: '10', type: 'Neon', address: '', owner: 'Ne' },
];

@Component({
  selector: 'app-permit',
  templateUrl: './permit.component.html',
  styleUrls: ['./permit.component.scss']
})
export class PermitComponent implements OnInit {
  panelOpenState = false;

  displayedColumns: string[] = ['id', 'type', 'address', 'owner', 'contractor'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit() {
  }

}
