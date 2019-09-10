import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, MatDialog, MatTableDataSource } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dish } from '../dish.model';
import { DishIngredient } from '../dish-ingredient.model';
import { DishService } from '../dish.service';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-dish-ingredients-list',
  templateUrl: './dish-ingredients-list.component.html',
  styleUrls: ['./dish-ingredients-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DishIngredientsListComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dish: Dish;
  public ingredients;
  public ingredientsList = [];
  public isLoading = false;
  panelOpenState = false;
  public id: string;
  iconBadgeText = '';
  toolTipPosition = 'above';
  reviewTableDataSource: any;
  reviewDataDisplayedColumnDefs: string[] = ['name', 'unit_price', 'qty', 'cost', 'yield', 'real_cost', 'chevron'];
  reviewTableData = new MatTableDataSource<Dish>(this.reviewTableDataSource);
  // public dishSub: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private service: DishService,
    private globalService: GlobalService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.reviewTableDataSource = [];
    this.isLoading = true;
    // this.id = this.route.snapshot.paramMap.get('_id');
    this.dish = this.service.getDish();


    if (this.dish) {
      this.iconBadgeText = this.globalService.getIconBadgeText(this.dish.name);
      this.ingredients = this.dish.ingredients;
      this.ingredients.forEach(item => {
        const object: DishIngredient = {
          id: item.id,
          name: item.name,
          qty: item.qty,
          cost: '',
          unit_price: '',
          real_cost: '',
          AP_weight: item.AP_weight,
          EP_weight: item.EP_weight,
          yield: item.yield,
          complete: item.complete
        };
        // because these values need to be inserted after the object is created
        object.unit_price = this.service.getIngredientUnitCost(item.id);
        object.cost = (parseFloat(object.unit_price) * parseFloat(object.qty)).toFixed(2);
        object.real_cost = this.service.getIngredientActualCost(object);
        this.reviewTableDataSource.push(object);
      });

      //  add the variable to the MattableDataSource.data property
      this.reviewTableData.data = this.reviewTableDataSource;
      this.isLoading = false;
    } else {
      console.log('no dish data on local');
    }
  }


  onDeleteDishIngredient(ingredientName) {
    this.dish.ingredients = this.ingredients.filter(item => item.name !== ingredientName);
    this.service.updateDish(this.dish);
  }
}
