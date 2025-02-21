import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { TitleCasePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DstTreeSelectService {

  constructor(private store: StoreService,
    private titleCasePipe: TitleCasePipe
  ) { }

  getName(text: string) {
    if (!!this.store?.config?.titleCase) {
      return this.titleCasePipe.transform(text)
    } else {
      return (text);
    }
  }
}
