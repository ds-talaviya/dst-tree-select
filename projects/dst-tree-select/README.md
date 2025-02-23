## Description
dst-tree-select provide single multiple selection with hierarchy view.
dst-tree-select is a highly customizable tree-based dropdown component for Angular applications.
It supports both single and multiple selections with hierarchical data, making it ideal for use cases like category and nested data structures.

## Demo
[Stackblitz Demo](https://stackblitz.com/~/github.com/dhruvil-52/dst-tree-select-example)

## Installation
npm i @ng-select/ng-select 

## Usage
import DstTreeSelectModule module in your module file
```python
import { NgModule } from '@angular/core';
import { DstTreeSelectModule } from 'dst-tree-select';

@NgModule({
  declarations: [],
  imports: [
    DstTreeSelectModule
  ],
  providers: []
})
export class AbcModule { }
```

## Features
- Single selection in tree view
- Multiple selection in tree view
- Ultimate hierarchy view

## Code Example
```python
# Example code snippet
1. customize with properties 
<dst-tree-select
    [items]="data"
    [(ngModel)]="selectedUsers"
    [titleCase] = "true"
    [bindLabel] = "'Name'"
    [bindValue] = "'Id'"
    [includeEntireObject] = "true"
    [groupBy] = "'SubManagers'"
    [noDataFoundText] = "'No Managers Found'"
    [placeHolder] = "'Select Sub Manager'"
    [closeOnSelect] = "false"
    [clearable] = "true"
    [clearAllText] = "'Remove All'"
    [dropdownOpen] = "true"
    [readonly] = "false"
    [multiple] = "true"
    [dropdownPosition] = "'auto'"
    [searchable] = "true"
    [expandable] = "true"
    (open)="func('open',$event)"
    (close)="func('close',$event)"
    (change)="func('change',$event)"
    (select)="func('select',$event)"
    (clear)="func('clear',$event)"
    (clearAll)="func('clearAll',$event)"
    (search)="func('search',$event)"
    (scroll)="func('scroll',$event)"
    >
</dst-tree-select>

2. customize with config 
<dst-tree-select
    [items]="data"
    [config]="config" 
    [(ngModel)]="selectedUsers"
    (open)="func('open',$event)"
    (close)="func('close',$event)"
    (change)="func('change',$event)"
    (select)="func('select',$event)"
    (clear)="func('clear',$event)"
    (clearAll)="func('clearAll',$event)"
    (search)="func('search',$event)"
    (scroll)="func('scroll',$event)"
    >
</dst-tree-select>

config = {
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
  dropdownOpen: true,
  readonly: false,
  multiple: true,
  dropdownPosition: "auto",
  searchable: true,
  expandable: true
}
```

## Properties
### Inputs
| Properties       | Description                       | Values                           | Default Value    |
|------------------|-----------------------------------|----------------------------------|------------------|
| items            | Data which you want to bind       |                                  |                  |
| titleCase        | Convert text to title case        | true, false                      | true             |
| bindLabel        | Field name to display             |                                  | Name             |
| bindValue        | Field name to bind                |                                  | Id               |
| includeEntireObject | Return whole object of selected node | true, false                | false            |
| groupBy          | Group items by this field         |                                  | children         |
| noDataFoundText  | Text to show when no data found   |                                  | No Data Found    |
| placeHolder      | Placeholder text                  |                                  | Select Data      |
| closeOnSelect    | Close dropdown after selection    | true, false                      | true             |
| clearable        | Allow clearing selection          | true, false                      | true             |
| clearAllText     | Text for clearing all selections  |                                  | Remove All       |
| dropdownOpen     | Open dropdown by default          | true, false                      | false            |
| readonly         | Make dropdown read-only           | true, false                      | false            |
| multiple         | Allow multiple selections         | true, false                      | false            |
| dropdownPosition | Position of dropdown              | auto, top, bottom                | auto             |
| searchable       | Allow searching elements          | true, false                      | true             |
| expandable       | Allow expand collapse selection   | true, false                      | true             |
| height           | Allow to give custom max height   | em, rem, px (any unit)           | 350px            |
| width            | Allow to give custom max width    | em, rem, px (any unit)           | 250px            |

### Outputs
| events            | Description                             | Value return           |
|-------------------|-----------------------------------------|------------------------|
| open              | Fired on modal opened                   |true                    |
| close             | Fired on modal closed                   |true                    |
| change            | Fired on any element selected or clear  |selected element object |
| select            | Fired on any element selected           |selected element object |
| clear             | Fired on remove element                 |removed element object  |
| clearAll          | Fired on remove all elements            |true                    |
| search            | Fired on search                         |searched text           |
| scroll            | Fired on scroll                         |true                    |


## Contact
- For any bugs, improvements or queries, contact: [dhruviltalaviya234@gmail.com](mailto:dhruviltalaviya234@gmail.com)
