import { Component } from '@angular/core';
import { data } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tree-select';
  data = data;
  selectedUsers: any = [6,16];

  // single select bind value
  selectedUser = [19, 20]; //take first
  // selectedUser = [19]; 
  // selectedUser = 19; 
  // selectedUser = { Id: 19 }; //by Object

  config = {
    multiple: true,
    titleCase: true,
    bindLabel: "Name",
    bindValue: "Id",
    includeEntireObject: true,
    groupBy: "SubManagers",
    noDataFoundText: "No Managers Found",
    placeHolder: "Select Sub Manager",
    closeOnSelect: false,
    clearable: true,
    clearAllText: "Remove All",
    dropdownOpen: false,
    readonly: false,
    dropdownPosition: "auto",
    searchable: true,
    expandable: true,
  }

  singleSelectConfig = {
    multiple: false,
    titleCase: true,
    bindLabel: "Name",
    bindValue: "Id",
    includeEntireObject: true,
    groupBy: "SubManagers",
    noDataFoundText: "No Managers Found",
    placeHolder: "Select Sub Manager",
    closeOnSelect: false,
    clearable: true,
    clearAllText: "Remove All",
    dropdownOpen: false,
    readonly: false,
    dropdownPosition: "auto",
    searchable: true,
    expandable: true,
  }

  func(type: any = "a", event: any = "b") {
    console.log(type, event)
  }
}
