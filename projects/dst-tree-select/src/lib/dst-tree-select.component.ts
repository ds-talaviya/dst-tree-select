import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import { configInterface, StoreService } from './store.service';
import { gurukrupa } from './gurukrupa';
import { DstTreeSelectService } from './dst-tree-select.service';

@Component({
  selector: 'dst-tree-select',
  templateUrl: './dst-tree-select.component.html',
  styleUrls: ['./dst-tree-select.component.scss'],
  providers: [TitleCasePipe]
})
export class DstTreeSelectComponent implements OnChanges, OnInit {

  @Input() titleCase = false;
  @Input() bindLabel = 'Name';
  @Input() bindValue = 'Id';
  @Input() config: configInterface = {
    titleCase: false,
    bindLabel: 'Name',
    bindValue: 'Id'
  };

  data = JSON.parse(JSON.stringify(gurukrupa));
  selectedItems: any[] = [];
  preselectedIds: number[] = [1, 100, 101];
  dropdownOpen = false;

  constructor(public titleCasePipe: TitleCasePipe,
    public dstTreeSelectService: DstTreeSelectService,
    private store: StoreService,
    private eRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.config.titleCase = this.titleCase;
    this.config.bindLabel = this.bindLabel;
    this.config.bindValue = this.bindValue;
    this.store.config = this.config;
  }

  ngOnInit() {
    this.preselectNodesById(this.data, this.preselectedIds);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  preselectNodesById(nodeList: any[], preselectedIds: number[]) {
    nodeList.forEach((node) => {
      if (preselectedIds.includes(node.Id)) {
        node.checked = true;
        this.updateChildren(node, true);
      }

      if (node.SubManagers?.length) {
        this.preselectNodesById(node.SubManagers, preselectedIds);
      }
    });

    this.updateSelectedItems();
  }

  handleCheckboxChange(item: any, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    item.checked = checked;
    this.updateChildren(item, checked);
    this.updateParent(this.data, null);
  }

  updateChildren(item: any, checked: boolean) {
    if (item.SubManagers?.length) {
      item.SubManagers.forEach((child: any) => {
        child.checked = checked;
        this.updateChildren(child, checked);
      });
    }
    this.updateSelectedItems();
  }

  updateParent(nodes: any[], parent: any) {
    let allChildrenChecked = true;
    nodes.forEach((node) => {
      if (node.SubManagers?.length) {
        this.updateParent(node.SubManagers, node);
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
          if (node.SubManagers?.length) {
            // If all children are selected, add only the parent
            const allChildrenSelected = node.SubManagers.every((child: any) => child.checked);
            if (allChildrenSelected) {
              this.selectedItems.push({ Name: node.Name, Id: node.Id });
              return; // Stop traversing deeper for this branch
            }
          }

          // If parentChecked is false, we add the current checked item
          if (!parentChecked) {
            this.selectedItems.push({ Name: node.Name, Id: node.Id });
          }
        }

        // Continue traversal if node has children
        if (node.SubManagers?.length) {
          traverse(node.SubManagers, node.checked);
        }
      });
    };

    traverse(this.data, false); // Start from the root
  }

  removeItem(item: { Name: string; Id: number }) {
    const removeNode = (nodes: any[]) => {
      nodes.forEach((node) => {
        if (node.Id === item.Id) {
          node.checked = false;
          this.updateChildren(node, false);
          return;
        }

        if (node.SubManagers?.length) {
          removeNode(node.SubManagers);
        }
      });
    };

    removeNode(this.data);
    this.updateParent(this.data, null);
  }

  /** ✅ Removes All Selected Items */
  removeAll() {
    console.log("called")
    this.selectedItems = []; // Clear all selected items
    this.uncheckAll(this.data); // Uncheck all nodes in data
  }

  /** ✅ Recursive Function to Uncheck All Nodes */
  uncheckAll(nodes: any[]) {
    nodes.forEach(node => {
      node.checked = false; // Uncheck current node
      if (node.SubManagers?.length) {
        this.uncheckAll(node.SubManagers); // Recurse into sub-nodes
      }
    });
  }


}
