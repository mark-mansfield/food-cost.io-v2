import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MenusService } from '../menus.service';
import { Menu } from '../menu.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menus-list',
  templateUrl: './menus-list.component.html',
  styleUrls: ['./menus-list.component.css']
})
export class MenusListComponent implements OnInit, OnDestroy {
  private menusSub: Subscription;
  public menus: Menu[] = [];
  public clonedItem: Menu[] = [];
  badgeNames = [];
  isLoading = false;
  hasImage = false;
  constructor(private service: MenusService, private router: Router) {}

  ngOnInit() {
    this.service.getMenus();
    this.isLoading = true;
    this.menusSub = this.service.getMenusUpdateListener().subscribe((data: Menu[]) => {
      this.menus = data;
      this.isLoading = false;
    });
  }

  saveMenuToLocal(menu) {
    localStorage.setItem('menu', JSON.stringify(menu));
    this.router.navigate(['menus/' + menu.id + '/details']);
  }

  onRemoveMenu(menuId) {
    this.service.deleteMenuItem(menuId);
  }

  onCloneMenu(menu) {
    const menuData = {
      menu_name: menu.menu_name.toLocaleLowerCase() + '(copy)',
      id: this.service.getUuid(),
      published: menu.published,
      parent_group: menu.parent_group,
      members: menu.members
    };
    const menuDoc = JSON.parse(localStorage.getItem('menus'));
    menuDoc.menus.push(menuData);
    this.menus = menuDoc.menus;
    this.service.cloneMenu(menuDoc);
  }

  ngOnDestroy() {
    this.menusSub.unsubscribe();
  }
}
