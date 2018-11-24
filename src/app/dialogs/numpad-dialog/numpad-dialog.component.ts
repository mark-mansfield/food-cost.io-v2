import { Component, OnInit, Inject, ViewChild, HostListener } from '@angular/core';

import { A11yModule } from '@angular/cdk/a11y';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FocusTrapFactory, FocusMonitor, ListKeyManager } from '@angular/cdk/a11y';
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-numpad-dialog',
  templateUrl: './numpad-dialog.component.html',
  styleUrls: ['./numpad-dialog.component.css']
})
export class NumpadDialogComponent implements OnInit {
  @ViewChild('updateButton') updateButton;

  public numberPad = {
    numberString: [],
    deleteLast: function() {
      this.numberString.pop();
    },
    clearAll: function() {
      this.numberString = [];
    },
    insertDecimalPoint: function(str) {
      if (this.numberString.length === 0) {
        this.numberString.push('0');
        this.numberString.push(str);
      } else {
        this.numberString.push(str);
      }
    },
    insertValue: function(str) {
      this.numberString.push(str);
    }
  };

  tiles: Tile[] = [
    { text: '1', cols: 1, rows: 1, color: '' },
    { text: '2', cols: 1, rows: 1, color: '' },
    { text: '3', cols: 1, rows: 1, color: '' },
    { text: '5', cols: 1, rows: 1, color: '' },
    { text: '6', cols: 1, rows: 1, color: '' },
    { text: '7', cols: 1, rows: 1, color: '' },
    { text: '8', cols: 1, rows: 1, color: '' },
    { text: '9', cols: 1, rows: 1, color: '' },
    { text: '0', cols: 1, rows: 1, color: '' },
    { text: '.', cols: 1, rows: 1, color: '' },
    { text: 'x', cols: 1, rows: 1, color: '' },
    { text: 'clear', cols: 1, rows: 1, color: '' }
  ];

  // enables listenning for the enter key
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      // textContent adds whitespace to the beginning and end of its value
      const numPadKey = event.srcElement.firstElementChild.textContent.trim();
      this.updateReadOut(numPadKey);
    }
  }

  constructor(
    private focusTrap: FocusTrapFactory,
    private focusMonitor: FocusMonitor,
    public dialogRef: MatDialogRef<NumpadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  returnNumpadValue() {
    this.dialogRef.close(this.numberPad.numberString.join(''));
  }

  updateReadOut(str) {
    switch (str) {
      case 'x':
        this.numberPad.deleteLast();
        break;
      case 'clear':
        this.numberPad.clearAll();
        break;
      case '.':
        this.numberPad.insertDecimalPoint(str);
        break;
      default:
        this.numberPad.insertValue(str);
        break;
    }
    // edge case prevent returning 0 or a non number
    if (this.numberPad.numberString.length === 0 || this.numberPad.numberString.join('') === '0.') {
      this.updateButton.disabled = true;
    } else {
      this.updateButton.disabled = false;
    }
  }
}
