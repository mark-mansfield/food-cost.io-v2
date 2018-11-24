import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-dialog-large',
  templateUrl: './dialog-large.component.html',
  styleUrls: ['./dialog-large.component.css']
})
export class DialogLargeComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DialogLargeComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {}

  onSave(choice) {
    this.dialogRef.close(choice);
  }
}
