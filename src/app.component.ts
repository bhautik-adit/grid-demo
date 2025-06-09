import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    viewChild,
    ViewChild,
  } from '@angular/core';
  
  
  import { CommonModule } from '@angular/common';
  import { DataStateChangeEventArgs, GridLine, PageSettingsModel, SelectionSettingsModel } from '@syncfusion/ej2-grids';
  import { Observable } from 'rxjs';
  import { TabModule } from '@syncfusion/ej2-angular-navigations';
  import { SkeletonModule } from '@syncfusion/ej2-angular-notifications'
  
  import { TooltipModule } from '@syncfusion/ej2-angular-popups'
import { AccountGrid } from './app/accountGrid/account-grid.component';
import { OrdersService } from './app/accountGrid/order.service';
  @Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrl: 'app.component.scss',
    standalone: true,
    imports: [CommonModule, AccountGrid, TabModule, SkeletonModule, TooltipModule],
  })
  export class AppComponent {
    public data: Observable<DataStateChangeEventArgs> | any;
    public pageOptions?: Object;
    public state?: DataStateChangeEventArgs;
    public virtualState: any;
    @Input() enableStickyHeader: boolean = true;
    @Input() gridLines: GridLine = 'Both';
    @Input() allowSorting: boolean = true;
    @Input() pageSettings: PageSettingsModel = { pageSize: 10 };
    @Input() allowSelection: boolean = true;
    @Input() selectionSettings: SelectionSettingsModel = { type: 'Single' };
    @Input() sortSettings: { columns: { field: string, direction: 'Ascending' | 'Descending' }[] } = { columns: [] };
    @Input() enableInfiniteScrolling: boolean = true;
    @Input() isResponsive: boolean = true;
    @Input() allowResizing: boolean = true;
    @Input() enableResponsiveRow: boolean = true;
    @Input() height: string | number = '500px';
    @Input() width: string | number = '100%';
    @Input() isDesktopMode: boolean = true;
    isShowSkeleton = false
    @Input() infiniteScrollSettings = {
      initialBlocks: 1,
      enableCache: false,
      maxBlocks: 1000
    }
    @ViewChild('grid') gridInstance: AccountGrid | any;
    public gridCols: any =
      [
        { field: 'OrderID', headerText: 'Order ID', width: 130, allowGrouping: false, freeze: 'Left' },
        { field: 'CustomerID', headerText: 'Customer Name', visible: false, width: 150, freeze: 'Left' },
        { field: 'EmployeeID', headerText: 'Employee ID', width: 130, textAlign: 'Right', freeze: 'Left' },
        { field: 'OrderDate', headerText: 'Order Date', width: 150, format: 'yMd', type: 'date' },
        { field: 'RequiredDate', headerText: 'Required Date', width: 150, format: 'yMd', type: 'date' },
        { field: 'ShippedDate', headerText: 'Shipped Date', width: 150, format: 'yMd', type: 'date' },
        { field: 'ShipVia', headerText: 'Ship Via', width: 120, textAlign: 'Right' },
        { field: 'Freight', headerText: 'Freight', width: 120, textAlign: 'Right', format: 'C2', type: 'number' },
        { field: 'ShipName', headerText: 'Ship Name', width: 200 },
        { field: 'ShipAddress', headerText: 'Ship Address', width: 200 },
        { field: 'ShipCity', headerText: 'Ship City', width: 150 },
        { field: 'ShipRegion', headerText: 'Ship Region', width: 150 },
        { field: 'ShipPostalCode', headerText: 'Postal Code', width: 130 },
        { field: 'ShipCountry', headerText: 'Country', width: 120, freeze: 'Right' }
      ]
  
    constructor(private service: OrdersService, private cdt: ChangeDetectorRef) {
  
      this.data = service;
    }
  
    public dataStateChange(state: DataStateChangeEventArgs): void {
      console.log(state);
      this.isShowSkeleton = true
      this.virtualState = state;
      this.service.execute(state);
      this.isShowSkeleton = false
    }
  
    public ngOnInit(): void {
      this.isShowSkeleton = true
      const state = { skip: 0, take: 10 };
      this.virtualState = state;
      this.service.execute(state);
      this.isShowSkeleton = false
    }
  
    one() {
      const shrinkTo = ['ShipName']; // Only show these fields
      const visibleFields = ['ShipName']; // Only show this
      this.toggleColumns(visibleFields);
  
    }
    two() {
      const visibleFields = ['OrderID', 'ShipName', 'CustomerID', 'EmployeeID', 'OrderDate', 'Freight', 'ShipCountry'];
      this.toggleColumns(visibleFields);
    }
  
    toggleColumns(visibleFields: string[]) {
      const gridObj = this.gridInstance.grid;
      if (!gridObj) return;
  
      gridObj.columns.forEach((col: any) => {
        col.visible = visibleFields.includes(col.field);
      });
  
      gridObj.refreshColumns(); // ✅ No full refresh, scroll and data are preserved
    }
  }
  