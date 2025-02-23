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
  selectedUsers: any = [11, 12];
  selectedUsers2: any = [10, 12];

  // single select bind value (anything you can use)
  // selectedUser = [12,13]; //take first
  // selectedUser = [19]; 
  selectedUser = 5;
  // selectedUser = { Id: 6 }; // by Object (key name should be matched with bindValue)

  config = {
    multiple: true,
    titleCase: true,
    bindLabel: "Name",
    bindValue: "Id",
    includeEntireObject: false,
    groupBy: "Teams",
    noDataFoundText: "No Teams Found",
    placeHolder: "Select Teams",
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
    ...this.config,
    multiple: false,
    closeOnSelect: true
  }

  func(type: any = "a", event: any = "b") {
    console.log(type, event)
  }
}
