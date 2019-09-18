import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Menu } from '../menu.model';

import { MenusService } from '../menus.service';

@Component({
  selector: 'app-menus-list',
  templateUrl: './menus-list.component.html',
  styleUrls: ['./menus-list.component.css']
})
export class MenusListComponent implements OnInit, OnDestroy {
  private menusSub: Subscription;
  public menus: Menu[] = [];
  public clonedItem: Menu[] = [];
  public searchTerm: string;
  menuCount: number;
  badgeNames = [];
  isLoading = false;
  hasImage = false;
  postsPerPage = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25];
  searchFoundNothing = false;
  noMenusFound = false;

  public noSearchResultsSub: Subscription;
  public noMenusFoundSub: Subscription;
  constructor(private service: MenusService, private router: Router) { }

  ngOnInit() {
    this.service.getMenusAndPaginate(this.pageIndex, this.postsPerPage);
    this.isLoading = true;
    this.menusSub = this.service.getMenusUpdateListener().subscribe((data: Menu[]) => {
      this.menus = data;
      this.menuCount = data.length;
      this.isLoading = false;
    });

    this.noSearchResultsSub = this.service.getNoSearchResultsUpdatedListener().subscribe(result => {
      this.searchFoundNothing = result;
      this.isLoading = false;
    });

    this.noMenusFoundSub = this.service.getNoMenusUpdatedListener().subscribe(result => {
      this.noMenusFound = result;
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent) {
    // this.service.paginateOnChange(pageData.pageIndex, pageData.pageSize);
  }

  saveMenuToLocal(menu) {
    localStorage.setItem('menu', JSON.stringify(menu));
    this.router.navigate(['menus/' + menu.id + '/details']);
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

  search(searchValue) {
    if (searchValue) {
      this.service.searchMenuByName(searchValue);
    }
  }

  ngOnDestroy() {
    this.menusSub.unsubscribe();
  }
}
