import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {
  message = 'An un known error occured';
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
