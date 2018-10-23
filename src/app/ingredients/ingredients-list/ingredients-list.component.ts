import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IngredientsService } from '../ingredients.service';
import { Ingredient } from '../ingredient.model';


@Component({
  selector: 'app-ingredients-list',
  templateUrl: './ingredients-list.component.html',
  styleUrls: ['./ingredients-list.component.css']
})
export class IngredientsListComponent implements OnInit, OnDestroy {

  public isLoading = false;
  public showRefresh = false;
  public ingredients: Ingredient[] = [];
  public linksList = [];
  public searchTerm: string;
  private ingredientsSub: Subscription;

  constructor(
    private service: IngredientsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {


    this.service.getIngredients();
    this.isLoading = true;
    this.ingredientsSub = this.service
      .geIngredientsUpdateListener()
      .subscribe((ingredientData: Ingredient[]) => {
        this.ingredients = ingredientData;
        // this.buildLinksList();
        this.isLoading = false;
      });
  }

  search(searchvalue) { }

  refresh() { }

  searchByFirstletter(link) { }

  onDelete(id) {
    this.service.deleteIngredient(id);
  }

  ngOnDestroy() {
    this.ingredientsSub.unsubscribe();
  }

  saveIngredientToLocal(ingredient) {
    this.service.saveLocalIngredientData(ingredient);
    this.router.navigate(['ingredients/' + ingredient.name]);
  }
}
