import { NgModule } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
@NgModule({
  exports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatStepperModule,
    MatSelectModule,
    MatToolbarModule,
    MatTableModule,
    MatGridListModule
  ]
})
export class AngularMaterialModule {}
