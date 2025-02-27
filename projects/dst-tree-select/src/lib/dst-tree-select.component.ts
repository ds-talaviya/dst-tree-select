import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TitleCasePipe } from '@angular/common';

import { DstTreeSelectService } from './dst-tree-select.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'dst-tree-select',
  templateUrl: './dst-tree-select.component.html',
  styleUrls: ['./dst-tree-select.component.scss'],
  providers: [TitleCasePipe]
})
export class DstTreeSelectComponent implements OnChanges, OnInit, OnDestroy {

  @Input() id!: string;
  // for perfectly work everything (treat every dropdown individually), you have to make deep copy of objects and arrays of input bound properties (due to none Primitives type, use same reference not making deep copy), for string, number, boolean variables it's not needed
  @Input() config: any = {};
  internalConfig: any = {}; // this will help to treat every dropdown individually
  @Input() items: any = [];
  internalItems: any[] = []; // this will help to treat every dropdown individually

  @Input() titleCase: boolean = true;
  @Input() bindLabel: string = 'Name';
  @Input() bindValue: string = 'Id';
  @Input() includeEntireObject: boolean = false;
  @Input() groupBy: string = 'children';
  @Input() noDataFoundText: string = '';
  @Input() placeHolder: string = '';
  @Input() closeOnSelect: any = false;
  @Input() dropdownOpen: any = false;
  @Input() clearable: any = true;
  @Input() readonly: any = false;
  @Input() clearAllText: string = '';
  @Input() multiple: any = false;
  @Input() searchable: any = true;
  @Input() clearSearchOnAdd: any = true;
  @Input() expandable: any = false;
  @Input() dropdownPosition: string = '';
  @Input() width: any;
  @Input() height: any;

  @Input() ngModel: any = null;
  preselected: any = [];
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Output() open: EventEmitter<any> = new EventEmitter<any>();
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  @Output() clear: EventEmitter<any> = new EventEmitter<any>();
  @Output() clearAll: EventEmitter<any> = new EventEmitter<any>();
  @Output() search: EventEmitter<any> = new EventEmitter<any>();
  @Output() scroll: EventEmitter<any> = new EventEmitter<any>();

  selectedItems: any[] = [];
  searchText: string = '';
  filteredData: any[] = [];
  searchSubject = new Subject<string>();

  constructor(
    public titleCasePipe: TitleCasePipe,
    public dstTreeSelectService: DstTreeSelectService,
    private eRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
      this.close.emit(true);
    }
  }

  // on click anywhere in chip input bring cursor to input
  @ViewChild('chipInput') chipInput!: ElementRef<HTMLInputElement>;
  focusInput() {
    if (this.chipInput) {
      this.chipInput.nativeElement.focus();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.readonly) {
      this.dropdownOpen = false;
    }
    if (this.dropdownOpen) {
      this.open.emit(true);
    }
    if (changes['config'] && changes['config'].currentValue) {
      // Ensure deep copy to prevent reference issues
      this.internalConfig = JSON.parse(JSON.stringify(this.config));

      // Assign properties safely from internalConfig
      this.titleCase = this.internalConfig?.titleCase;
      this.bindLabel = this.internalConfig?.bindLabel;
      this.bindValue = this.internalConfig?.bindValue;
      this.groupBy = this.internalConfig?.groupBy;
      this.noDataFoundText = this.internalConfig?.noDataFoundText;
      this.placeHolder = this.internalConfig?.placeHolder;
      this.closeOnSelect = this.internalConfig?.closeOnSelect;
      this.dropdownOpen = this.internalConfig?.dropdownOpen;
      this.clearable = this.internalConfig?.clearable;
      this.multiple = this.internalConfig?.multiple;
      this.searchable = this.internalConfig?.searchable;
      this.clearSearchOnAdd = this.internalConfig?.clearSearchOnAdd;
      this.readonly = this.internalConfig?.readonly;
      this.expandable = this.internalConfig?.expandable;
      this.clearAllText = this.internalConfig?.clearAllText;
      this.dropdownPosition = this.internalConfig?.dropdownPosition;
      this.includeEntireObject = this.internalConfig?.includeEntireObject;
      this.width = this.internalConfig?.width;
      this.height = this.internalConfig?.height;
    }
    if (changes['items'] && changes['items'].currentValue) {
      // Deep copy to prevent shared reference issues
      this.internalItems = JSON.parse(JSON.stringify(this.items));
      this.filteredData = this.internalItems;
    }
  }

  ngOnInit() {
    if (!this.multiple) {
      if (!!Array.isArray(this.ngModel)) {
        this.preselected = [this.ngModel[0]];
      } else if (!isNaN(parseFloat(this.ngModel)) && isFinite(this.ngModel)) {
        this.preselected = [this.ngModel];
      } else if (!isNaN(parseFloat(this.ngModel)) && isFinite(this.ngModel)) {
        this.preselected = [this.ngModel];
      } else if (typeof this.ngModel === 'object' && this.ngModel !== null) {
        this.preselected = [this.ngModel[this.bindValue]];
      }
    } else {
      this.preselected = this.ngModel;
    }
    this.preselectNodesById(this.filteredData, this.preselected);
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchText => {
      this.applyFilter(searchText);
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    !!this.dropdownOpen ? this.open.emit(true) : this.close.emit(true);
  }

  onScrollMenu(event: any) {
    const element = event.target;
    this.scroll.emit(element.scrollTop)
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
      return ('Select Data');
    }
  }

  closeModalOnSelect() {
    if (!!this.closeOnSelect) {
      this.dropdownOpen = false;
      this.close.emit(true);
    }
  }

  getClearAllText() {
    if (!!this.clearAllText && !!this.clearable) {
      return this.clearAllText;
    } else {
      return ('Clear all');
    }
  }

  getDropdownClass(): { [key: string]: boolean } {
    if (!this.dropdownPosition || this.dropdownPosition === 'auto') {
      return this.getAutoPosition(); // Auto-positioning logic
    }

    return {
      'left': this.dropdownPosition === 'left',
      'right': this.dropdownPosition === 'right',
      'top': this.dropdownPosition === 'top',
      'bottom': this.dropdownPosition === 'bottom',
      'center': this.dropdownPosition === 'center',
      'left-bottom': this.dropdownPosition === 'left-bottom',
      'right-bottom': this.dropdownPosition === 'right-bottom',
      'left-top': this.dropdownPosition === 'left-top',
      'right-top': this.dropdownPosition === 'right-top',
      'center-top': this.dropdownPosition === 'center-top',
      'center-bottom': this.dropdownPosition === 'center-bottom'
    };
  }

  getAutoPosition(): { [key: string]: boolean } {
    const dropdownElement = document.querySelector('.dropdown-menu');
    if (!dropdownElement) return { bottom: true }; // Default fallback

    const rect = dropdownElement.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Determine the best position based on screen space
    if (rect.right > windowWidth) {
      return { left: true };  // Move left if overflowing on the right
    } else if (rect.left < 0) {
      return { right: true }; // Move right if overflowing on the left
    } else if (rect.bottom > windowHeight) {
      return { top: true };   // Move up if overflowing at the bottom
    } else {
      return { bottom: true }; // Default to bottom
    }
  }

  onSearch(searchValue: any): void {
    this.searchSubject.next(searchValue?.target?.value.trim());
  }

  applyFilter(searchValue: string): void {
    if (!searchValue) {
      this.filteredData = [...this.internalItems];
      return;
    }
    this.filteredData = this.searchTree(this.internalItems, searchValue);
    this.search.emit({ input: searchValue, data: this.filteredData });
  }

  searchTree(nodes: any[], searchText: string): any[] {
    let result: any[] = [];
    for (let node of nodes) {
      let childrenMatch = this.searchTree(node[this.groupBy] || [], searchText);
      let isMatch = node[this.bindLabel].toLowerCase().includes(searchText.toLowerCase());
      if (isMatch || childrenMatch.length > 0) {
        result.push({
          ...node,
          [this.groupBy]: isMatch ? node[this.groupBy] : childrenMatch,
        });
      }
    }
    return result;
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
      this.filteredData.forEach((node: any) => this.clearSelection(node));
      this.selectedItems = [];
    }
    item.checked = checked;
    this.updateChildren(item, checked);
    this.updateParent(this.filteredData, null);

    if (!!checked) {
      this.select.emit(item);
      this.change.emit(item);
    } else {
      this.clear.emit(item);
      this.change.emit(item);
    }
    if (this.clearSearchOnAdd) {
      this.searchText = "";
      this.filteredData = [...this.internalItems];
    }
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
    traverse(this.filteredData, false); // Start from the root
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
    this.clear.emit(item);
    this.change.emit(item);
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
    removeNode(this.filteredData);
    this.updateParent(this.filteredData, null);
  }

  /** ✅ Removes All Selected Items */
  removeAll() {
    this.selectedItems = []; // Clear all selected filteredData
    this.uncheckAll(this.filteredData); // Uncheck all nodes in data
    this.clearAll.emit(true)
    this.change.emit(true)
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

  ngOnDestroy(): void {
    this.searchSubject.unsubscribe();
  }
}