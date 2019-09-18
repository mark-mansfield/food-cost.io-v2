import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

// import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
// import { ErrorStateMatcher } from '@angular/material/core';
import { MenusService } from '../menus.service';
import { GlobalService } from '../../global.service';
import { Menu } from '../menu.model';
import { Dish } from '../../dishes/dish.model';

/** Error when invalid control is dirty, touched, or submitted. */
// export class MyErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }

@Component({
  selector: 'app-menu-details',
  templateUrl: './menu-details.component.html',
  styleUrls: ['./menu-details.component.css']
})
export class MenuDetailsComponent implements OnInit {
  // isHandset$: Observable<boolean> = this.breakpointObserver
  //   .observe(Breakpoints.Handset)
  //   .pipe(map(result => result.matches));

  dishesOnMenu: Dish[] = [];
  menu: Menu;
  isLoading = false;
  showDetails = false;
  showEditForm = false;
  showEditTools = false;
  selectedId;
  // matcher = new MyErrorStateMatcher();
  nameValue = '';
  iconBadgeText = '';
  editModeButtonText = 'edit';
  mode = null;


  constructor(
    private menuService: MenusService,
    private router: Router,
    private globalService: GlobalService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.selectedId = paramMap.get('id');
        this.menu = JSON.parse(localStorage.getItem('menu'));
        this.nameValue = this.menu.menu_name;
        this.dishesOnMenu = this.menuService.getDishesOnMenu(this.menu.members);
        this.isLoading = false;
        this.iconBadgeText = this.globalService.getIconBadgeText(this.nameValue);
      }
    });


  }

  toggleEditMode() {
    if (this.showEditTools) {
      this.showEditTools = false;
      this.editModeButtonText = 'edit';
    } else {
      this.showEditTools = true;
      this.editModeButtonText = 'cancel';
    }
  }

  toggleDetails() {
    this.showDetails ? (this.showDetails = false) : (this.showDetails = true);
  }

  toggleEditForm() {
    this.showEditForm ? (this.showEditForm = false) : (this.showEditForm = true);
  }
  onAddDish() {
    this.router.navigate(['/menus/' + this.selectedId + '/add-dish']);
  }
  onDishSelected(dish) {
    // const dishes = JSON.parse(localStorage.getItem('dishes'));
    // const selectedDish = dishes.filter(item => item._id === id);
    localStorage.setItem('dish', JSON.stringify(dish));
    this.router.navigate(['dish/edit/referrer/' + this.selectedId]);
  }

  updateNestedMenu(prop, newValue, menuId) {
    // update nested menus object
    const localMenusData = JSON.parse(localStorage.getItem('menus'));
    const menuDataCopy = [...localMenusData.menus];
    const idx = menuDataCopy.findIndex(obj => obj.id === menuId);
    localStorage.setItem('menu', JSON.stringify(this.menu));
    localMenusData.menus[idx][prop] = newValue;
    return localMenusData;
  }

  onRemoveDish(dishId) {

    const localMenusData = this.menuService.loadLocalMenusData();
    const idx = localMenusData.menus.findIndex(obj => obj.id === this.menu.id);

    this.menu.members = this.menu.members.filter(item => item !== dishId);
    localMenusData.menus[idx].members = this.menu.members;
    this.dishesOnMenu = this.menu.members;
    this.menuService.saveLocalMenusData(localMenusData);
    this.menuService.saveLocalMenuData(this.menu);

    this.menuService.updateMenus(localMenusData);
  }

  onDelete() {
    const obj = {
      id: this.menu.id
    };
    this.menuService.deleteMenu(obj);
  }

  onUpdateMenuName(menuId) {
    const newMenuDoc = this.updateNestedMenu('menu_name', this.nameValue, menuId);
    this.menuService.updateMenus(newMenuDoc);
    this.menu.menu_name = this.nameValue;
  }


}
