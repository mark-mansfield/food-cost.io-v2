// globals.ts
import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  getCustomer() {
    return JSON.parse(localStorage.getItem('customer'));
  }

  setCustomer(obj) {
    const customer = {
      id: obj.userId
    };

    localStorage.setItem('customer', JSON.stringify(customer));
  }

