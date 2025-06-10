import {
    AfterContentInit,
    Component,
    ContentChildren,
    Directive,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    QueryList,
    TemplateRef,
    ViewChild,
  } from '@angular/core';
  import {
    PageService,
    SortService,
    FilterService,
    ToolbarService,
    EditService,
    GridModule,
    ContextMenuService,
    DataStateChangeEventArgs,
    GridComponent,
    GridLine,
    HeaderCellInfoEventArgs,
    PageSettingsModel,
    RowDataBoundEventArgs,
    RowDeselectEventArgs,
    RowSelectEventArgs,
    SelectionSettingsModel,
    FreezeService,
    InfiniteScrollService,
    SelectionService,
    VirtualScrollService,
  } from '@syncfusion/ej2-angular-grids';
  
  import {
    ToolbarModule,
    SidebarModule,
    DataBoundEventArgs,
  } from '@syncfusion/ej2-angular-navigations';
  import { DialogModule } from '@syncfusion/ej2-angular-popups';
  import { AsyncPipe, CommonModule } from '@angular/common';
  import { Observable, debounceTime, distinctUntilChanged } from 'rxjs';
  
  @Directive({
    selector: '[aditGridDef]',
    standalone: false
  })
  export class AditGridTemplateDirective {
    @Input('aditGridDef') field!: string;
    @Input() type: 'header' | 'column' = 'column'; // Default to column template
  
    constructor(public template: TemplateRef<any>) {
    }
  }
  
  @Component({
    selector: 'app-account-grid',
    templateUrl: 'account-grid.component.html',
    styleUrl: 'account-grid.component.css',
    providers: [
      SortService, FilterService, InfiniteScrollService, SelectionService, FreezeService,
        PageService, AsyncPipe,EditService
    ],
    standalone: true,
    imports: [
      CommonModule,
      GridModule,
      ToolbarModule,
      DialogModule,
      SidebarModule,
    ],
  })
  export class AccountGrid implements AfterContentInit,OnChanges,OnInit{
   // Inputs
   dataSource: any = [];
   // @Input() set dataSourceService(service: Observable<DataStateChangeEventArgs>) {
   //   service.subscribe(res => {
   //     this.dataSource = res
   //   });
   // };
   @Input() set dataSourceService(service: Observable<DataStateChangeEventArgs>) {
     service.pipe(debounceTime(100), distinctUntilChanged()).subscribe(res => {
       this.dataSource = res;
     });
   }
  
   @Input() isStaticData: boolean = false;
   @Input() staticDataSource: any[] = [];
  
   public _columns: {
     field: string,
     "type": string,
     headerText: string,
     isVisible?: boolean,
     isPrimaryKey?: boolean,
     width?: string,
     freeze?: string,
     allowFiltering?: boolean,
     allowSorting?: boolean,
     disableHtmlEncode?: boolean,
     showInColumnChooser?: boolean,
     allowReordering?: boolean,
   }[] = [];
   @Input() set columns(value: any) {
     this.updateColumns(value);
   }
   @Input() enableStickyHeader: boolean = true;
   @Input() gridLines: GridLine = 'Both';
   @Input() allowSorting: boolean = true;
   @Input() pageSettings: PageSettingsModel = { pageSize: 20 };
   @Input() allowSelection: boolean = true;
   @Input() selectionSettings: SelectionSettingsModel = { type: 'Single' };
   @Input() sortSettings: { columns: { field: string, direction: 'Ascending' | 'Descending' }[] } = { columns: [] };
   @Input() enableInfiniteScrolling: boolean = true;
   @Input() isResponsive: boolean = true;
   @Input() allowResizing: boolean = true;
   @Input() enableResponsiveRow: boolean = true;
   @Input() height: string | number = '100%';
   @Input() width: string | number = '100%';
   @Input() isDesktopMode: boolean = true;
   @Input() infiniteScrollSettings = {
     initialBlocks: 1,
     enableCache: false,
     maxBlocks: 1000
   }
   @Input() isShowSkeleton = false;
   @Input() skeletonType: string = 'grid_with_checkbox';
   @Input() isCloseClicked: boolean = false;
   // Outputs
   @Output() onRowDataBound = new EventEmitter<RowDataBoundEventArgs>();
   @Output() onDataBound = new EventEmitter<DataBoundEventArgs>();
   @Output() onRowSelected = new EventEmitter<RowSelectEventArgs>();
   @Output() onRowDeselected = new EventEmitter<RowDeselectEventArgs>();
   @Output() onHeaderCellInfo = new EventEmitter<HeaderCellInfoEventArgs>();
   @Output() onDataStateChange = new EventEmitter<DataStateChangeEventArgs>();
   wrapOption =  { wrapMode: 'Content' };
   @Output() actionBegin  = new EventEmitter<any>();
   @Output() actionComplete  = new EventEmitter<any>();
   @Output() actionFailure  = new EventEmitter<any>();
   columnTemplates: { [key: string]: TemplateRef<any> } | any = {};
   headerTemplates: { [key: string]: TemplateRef<any> } | any= {};
   @ViewChild('grid', { static: false }) grid?: GridComponent;
   @ContentChildren(AditGridTemplateDirective) templates!: QueryList<AditGridTemplateDirective>;
  
   constructor() {}
  
   ngOnInit() {}
  
   ngAfterContentInit(): void {
     // this.dataSource = this.dataSourceService;
     // this.templates.forEach((templateDirective) => {
     //   if (templateDirective.type === 'column') {
     //     this.columnTemplates[templateDirective.field] = templateDirective.template;
     //   } else if (templateDirective.type === 'header') {
     //     this.headerTemplates[templateDirective.field] = templateDirective.template;
     //   }
     // });
     this.templates.forEach(templateDirective => {
       const map = templateDirective.type === 'column' ? this.columnTemplates : this.headerTemplates;
       if (!map[templateDirective.field]) {
         map[templateDirective.field] = templateDirective.template;
       }
     });
     // const gridHeader = document.querySelector('.e-grid .e-headercontent') as HTMLElement;
     // const gridContent = document.querySelector('.e-grid .e-content') as HTMLElement;
   
     // if (gridHeader && gridContent) {
     //   gridContent.addEventListener('scroll', () => {
     //     gridHeader.scrollLeft = gridContent.scrollLeft;
     //   });
     // }
   }
   
   refreshGrid() {
    //  if (this.grid) {
    //    this.grid.refresh();
    //  }
   }
  
   public updateColumns(tempColumns: any): void {
     this._columns = [...tempColumns]; // remove setTimeout
   }
  
   isDisableHtmlEncodePresent(col: any): boolean {
     return 'disableHtmlEncode' in col ? col.disableHtmlEncode : true;
   }
  
   ngOnChanges(): void {
     if (this.isCloseClicked) {
       this.grid?.clearRowSelection();
       this.grid?.clearSelection();
     }
   }
  
   trackByField(index: number, item: any): string {
     return item.field;
   }
   onDataBoundHandler(event: DataBoundEventArgs): void {
     console.log(this.dataSource,this._columns);
     
     this.isShowSkeleton = false;
     this.onDataBound.emit(event);
   }
  }
  
  
  
  