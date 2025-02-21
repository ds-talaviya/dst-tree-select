import { Injectable } from '@angular/core';

export interface configInterface {
  titleCase: boolean;
  bindLabel: string;
  bindValue: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  config: configInterface = {
    titleCase: false,
    bindLabel: 'Name',
    bindValue: 'Id',
  }

  constructor() { }
}
