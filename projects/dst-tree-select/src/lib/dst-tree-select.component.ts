import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import { DstTreeSelectService } from './dst-tree-select.service';

@Component({
  selector: 'dst-tree-select',
  templateUrl: './dst-tree-select.component.html',
  styleUrls: ['./dst-tree-select.component.scss'],
  providers: [TitleCasePipe]
})
export class DstTreeSelectComponent implements OnChanges, OnInit {

  @Input() items: any = [];
  @Input() titleCase: boolean = true;
  @Input() bindLabel: string = '';
  @Input() bindValue: string = '';
  @Input() includeEntireObject: boolean = false;
  @Input() groupBy: string = '';
  @Input() noDataFoundText: string = '';
  @Input() placeHolder: string = '';
  @Input() closeOnSelect: any = true;
  @Input() dropdownOpen: any = false;
  @Input() clearable: any = true;
  @Input() readonly: any = false;
  @Input() clearAllText: string = '';
  @Input() multiple: any = false;
  @Input() searchable: any = true;
  @Input() expandable: any = false;
  @Input() dropdownPosition: string = '';

  @Input() config: any = {};

  @Input() ngModel: any;
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter<any>();

  selectedItems: any[] = [];

  constructor(
    public titleCasePipe: TitleCasePipe,
    public dstTreeSelectService: DstTreeSelectService,
    private eRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!Object.keys(this.config).length) {
      this.titleCase = this.config.titleCase;
      this.bindLabel = this.config.bindLabel;
      this.bindValue = this.config.bindValue;
      this.groupBy = this.config.groupBy;
      this.noDataFoundText = this.config.noDataFoundText;
      this.placeHolder = this.config.placeHolder;
      this.closeOnSelect = this.config.closeOnSelect;
      this.dropdownOpen = this.config.dropdownOpen;
      this.clearable = this.config.clearable;
      this.multiple = this.config.multiple;
      this.searchable = this.config.searchable;
      this.readonly = this.config.readonly;
      this.expandable = this.config.expandable;
      this.clearAllText = this.config.clearAllText;
      this.dropdownPosition = this.config.dropdownPosition;
      this.includeEntireObject = this.config.includeEntireObject;
    }

    if (!!this.readonly) {
      this.dropdownOpen = false;
    }

    if (!this.multiple && !!Array.isArray(this.ngModel)) {
      this.ngModel = [this.ngModel[0]];
    }
  }

  ngOnInit() {
    this.preselectNodesById(this.items, this.ngModel);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  getName(text: string) {
    if (!!this.titleCase) {
      return this.titleCasePipe.transform(text)
    } else {
      return (text);
    }
  }

  getNoDataFoundText() {
    if (!!this.noDataFoundText) {
      return this.noDataFoundText;
    } else {
      return ('No Data Found');
    }
  }

  getPlaceHolder() {
    if (!!this.placeHolder) {
      return this.placeHolder;
    } else {
      return ('No Data Found');
    }
  }

  closeModalOnSelect() {
    if (!!this.closeOnSelect) {
      this.dropdownOpen = false;
    }
  }

  getClearAllText() {
    if (!!this.clearAllText && !!this.clearable) {
      return this.clearAllText;
    } else {
      return ('Clear all');
    }
  }

  preselectNodesById(nodeList: any[], preselectedIds: number[]) {
    nodeList.forEach((node) => {
      if (preselectedIds.includes(node[this.bindValue])) {
        node.checked = true;
        this.updateChildren(node, true);
      }
      if (node[this.groupBy]?.length) {
        this.preselectNodesById(node[this.groupBy], preselectedIds);
      }
    });
    this.updateSelectedItems();
  }

  handleCheckboxChange(item: any, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (!this.multiple) {
      // For single select, reset other selections
      this.items.forEach((node: any) => this.clearSelection(node));
      this.selectedItems = [];
    }
    item.checked = checked;
    this.updateChildren(item, checked);
    this.updateParent(this.items, null);
  }

  clearSelection(node: any) {
    node.checked = false;
    if (node[this.groupBy]?.length) {
      node[this.groupBy].forEach((child: any) => this.clearSelection(child));
    }
  }

  updateChildren(item: any, checked: boolean) {
    if (item[this.groupBy]?.length) {
      item[this.groupBy].forEach((child: any) => {
        child.checked = checked;
        this.updateChildren(child, checked);
      });
    }
    this.updateSelectedItems();
  }

  updateParent(nodes: any[], parent: any) {
    let allChildrenChecked = true;
    nodes.forEach((node) => {
      if (node[this.groupBy]?.length) {
        this.updateParent(node[this.groupBy], node);
      }
      if (!node.checked) {
        allChildrenChecked = false;
      }
    });
    if (parent) {
      parent.checked = allChildrenChecked;
    }
    if (!parent) {
      this.updateSelectedItems();
    }
  }

  updateSelectedItems() {
    this.selectedItems = []; // Reset selection array
    const traverse = (nodes: any[], parentChecked: boolean) => {
      nodes.forEach((node) => {
        if (node.checked) {
          if (node[this.groupBy]?.length) {
            // If all children are selected, add only the parent
            const allChildrenSelected = node[this.groupBy].every((child: any) => child.checked);
            if (allChildrenSelected) {
              this.selectedItems.push(node);
              return; // Stop traversing deeper for this branch
            }
          }
          // If parentChecked is false, we add the current checked item
          if (!parentChecked) {
            this.selectedItems.push(node);
          }
        }
        // Continue traversal if node has children
        if (node[this.groupBy]?.length) {
          traverse(node[this.groupBy], node.checked);
        }
      });
    };
    traverse(this.items, false); // Start from the root
    // Emit the updated selectedItems list
    this.ngModelChange.emit(this.emitSelectedData());
  }

  emitSelectedData() {
    if (!this.multiple) {
      if (!!this.includeEntireObject) {
        return this.selectedItems[0];
      }
      return this.selectedItems[0][this.bindValue];
    } else {
      if (!!this.includeEntireObject) {
        return this.selectedItems;
      }
      return this.selectedItems.map((e) => e[this.bindValue]);
    }
  }

  removeItem(item: any) {
    const removeNode = (nodes: any[]) => {
      nodes.forEach((node) => {
        if (node[this.bindValue] === item[this.bindValue]) {
          node.checked = false;
          this.updateChildren(node, false);
          return;
        }
        if (node[this.groupBy]?.length) {
          removeNode(node[this.groupBy]);
        }
      });
    };
    removeNode(this.items);
    this.updateParent(this.items, null);
  }

  /** ✅ Removes All Selected Items */
  removeAll() {
    this.selectedItems = []; // Clear all selected items
    this.uncheckAll(this.items); // Uncheck all nodes in data
    this.ngModelChange.emit(null);
  }

  /** ✅ Recursive Function to Uncheck All Nodes */
  uncheckAll(nodes: any[]) {
    nodes.forEach(node => {
      node.checked = false; // Uncheck current node
      if (node[this.groupBy]?.length) {
        this.uncheckAll(node[this.groupBy]); // Recurse into sub-nodes
      }
    });
  }
}