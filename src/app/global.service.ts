import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor() {}

  getIconBadgeText(badgeName) {
    let text = '';
    let words = [];
    if (badgeName.includes(' ')) {
      words = badgeName.split(' ');
    } else {
      words.push(badgeName);
    }

    words.forEach(item => {
      text += item[0];
    });

    return text.toLocaleUpperCase();
  }
}
