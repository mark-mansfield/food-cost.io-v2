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
// ./dish-ingredients-list.component'
// '../../css/list-layout.css
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
  unitPrices = [];
  public isLoading = false;
  panelOpenState = false;
  public id: string;
  iconBadgeText = '';
  toolTipPosition = 'above';
  reviewTableDataSource: any;
  reviewDataDisplayedColumnDefs: string[] = ['name', 'unit_price', 'qty', 'cost', 'yield', 'real_cost', 'complete', 'chevron'];
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
    this.dish = this.service.getDish();
    if (this.dish) {
      this.iconBadgeText = this.globalService.getIconBadgeText(this.dish.name);
      this.ingredients = this.dish.ingredients;
      this.dish.progress = parseInt(this.service.getDishProgress(this.dish), 10);
      this.ingredients.forEach(item => {
        item.unit_price = this.service.getIngredientUnitCost(item.id);
        item.cost = this.service.getIngredientCost(item.unit_price, item.qty);
        item.yeild = this.ingredients.yeild;
        item.real_cost = this.service.getIngredientRealCost(item);
      });

      this.service.saveLocalDishData(this.dish);
      this.reviewTableDataSource = [...this.ingredients];
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
