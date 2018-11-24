import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-ingredient-create-help-dialog',
  templateUrl: './ingredient-create-help-dialog.component.html',
  styleUrls: ['./ingredient-create-help-dialog.component.css']
})
export class IngredientCreateHelpDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<IngredientCreateHelpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  onClose() {
    this.dialogRef.close();
  }
}
