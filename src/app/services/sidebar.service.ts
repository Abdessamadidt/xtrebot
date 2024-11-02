import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isSideBarOpenSubject = new BehaviorSubject<boolean>(true); // Initialize with true or false as needed
  isSideBarOpen$ = this.isSideBarOpenSubject.asObservable();

  constructor() { }

  toggleSideBar(isOpen: boolean): void {
    this.isSideBarOpenSubject.next(isOpen);
  }
}
