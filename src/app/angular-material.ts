import { NgModule } from '@angular/core';

import { MatInputModule } from '@angular/material/input';
import {  MatCardModule } from '@angular/material/card';
import {MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
// import {MatDialogModule} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
 exports: [
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatExpansionModule,
  MatPaginatorModule,
  MatPaginatorModule
  // MatDialogModule
 ]
})

export class AngularMaterialModule {}
