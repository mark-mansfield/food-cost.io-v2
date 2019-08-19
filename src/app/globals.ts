// globals.ts
import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  getCustomer() {
    return JSON.parse(localStorage.getItem('iqf1efs'));
  }

  setCustomer(obj) {
    const customer = {
      id: obj.userId
    };

    localStorage.setItem('iqf1efs', JSON.stringify(customer));
  }
}
