import { resizeObserverToObserverable } from '../../helpers/angular-extensions';
import { GridDimensions, Hexagon } from '../../interfaces/hexagon';
import { VIEWPORT_SIZE, ViewportSize } from '../../tokens/injectionTokens';
import { GRID_DIMENSIONS_STATE_KEY, HEXAGONS_STATE_KEY } from '../../tokens/stateKeys';
import { NAVBAR_HEIGHT } from '../../css.constants';
import { AnimationService } from '../../services/animation.service';
import { doubledWidthDistance } from '../../helpers/hexagon-grid.helpers';

import { throttleTime, distinctUntilChanged, map, Observable} from 'rxjs';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, computed, DestroyRef, ElementRef, inject, OnInit, PLATFORM_ID, signal, TransferState, viewChildren } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-background',
  standalone: true,
  imports: [],
  templateUrl: './background.component.html',
  styleUrl: './background.component.scss'
})
export class BackgroundComponent implements AfterViewInit, OnInit{
  private readonly hexagonElementRefs = viewChildren<ElementRef<HTMLElement>>('hexagon');
  private readonly hexagonElements = computed(() => this.hexagonElementRefs().map((ref) => ref.nativeElement));
  private animationService = inject(AnimationService);
  private viewportHint: ViewportSize = inject(VIEWPORT_SIZE);
  private platformId = inject(PLATFORM_ID);
  private elementRef: ElementRef = inject(ElementRef);
  private changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private transferState: TransferState = inject(TransferState);
  private hexagonSize: number = 35;
  private hexagonWidth: number = Math.sqrt(3) * this.hexagonSize;
  private hexagonHeight: number = this.hexagonSize * 2;
  private horizontalOffset: number =  this.hexagonWidth * 0.5;
  private verticalOffset: number = 1.5 * this.hexagonSize;  
  private $resizeEntries!: Observable<ResizeObserverEntry[]>;
  private hexagonsMap: Map<string, Hexagon> = new Map();
  private grid = signal<GridDimensions>({ rows: 0, columns: 0 })
  svgHeight = computed<number>(() => ((this.grid().rows - 1) * this.hexagonHeight + this.hexagonHeight));
  svgWidth = computed<number>(() => (this.grid().columns * this.hexagonWidth));
  svgViewBox = computed<string>(() => {
    var width = this.svgWidth();
    var height = this.svgHeight();
    return `${-width * 0.5} ${-height * 0.5} ${width} ${height}`
  });
  hexagons: Hexagon[] = [];
   
  ngOnInit(): void {
    if (isPlatformServer(this.platformId) && this.viewportHint.height && this.viewportHint.width) {
      var height = this.viewportHint.height - NAVBAR_HEIGHT;
      var gridDimensions = this.getGridDimensions(height, this.viewportHint.width);
      this.setUpGrid(gridDimensions);
      this.transferState.set(HEXAGONS_STATE_KEY, this.hexagons);
      this.transferState.set(GRID_DIMENSIONS_STATE_KEY, this.grid());
    }
    if (isPlatformBrowser(this.platformId)) {
      var storedHexagons = this.transferState.get(HEXAGONS_STATE_KEY, null);
      var storedGridDimensions = this.transferState.get(GRID_DIMENSIONS_STATE_KEY, null)
      if (storedHexagons && storedGridDimensions) {
        this.hexagons = storedHexagons;
        storedHexagons.forEach((hex) => this.hexagonsMap.set(`${hex.coordinates.x},${hex.coordinates.y}`, hex));
        this.grid.set(storedGridDimensions);
        this.transferState.remove(HEXAGONS_STATE_KEY);
        this.transferState.remove(GRID_DIMENSIONS_STATE_KEY);
      } else {
        var height = window.innerHeight - NAVBAR_HEIGHT;
        var gridDimensions = this.getGridDimensions(height, window.innerWidth);
        this.setUpGrid(gridDimensions);
      }
      this.attachResizeHandler();
    }    
  }

  ngAfterViewInit(): void {    
    this.addStartUpAnimation();
  }

  private attachResizeHandler(): void {
    this.$resizeEntries = resizeObserverToObserverable(this.elementRef.nativeElement);
    this.$resizeEntries
    .pipe(
      throttleTime(50, undefined, { trailing: true }),
      distinctUntilChanged((prev, curr) => prev[0].contentRect.height >= curr[0].contentRect.height
        && prev[0].contentRect.width >= curr[0].contentRect.width),
      map((entries) => this.getGridDimensions(entries[0].contentRect.height, entries[0].contentRect.width)),
      distinctUntilChanged((prev, curr) => prev.columns >= curr.columns && prev.rows >= curr.rows),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({ rows, columns }) => {
      var dimensions = this.grid();
      if (rows === dimensions.rows && columns === dimensions.columns) {
        return;
      }
      this.setUpGrid({ rows, columns });
      this.changeDetector.detectChanges();    
    });
  }

  private addStartUpAnimation() {
    var center = { x: 0, y: 0 };
    this.animationService.addAnimation({
      targets: this.hexagonElements(),
      strokeDashoffset: { value: [210, 0], duration: 500 },
      opacity: { value: [0, 1], duration: 300 },
      delay: (el: any, i: number, l: number) => {
        var key = el.getAttribute('key');
        if (!key) {
          return 0;
        }
        var hex = this.hexagonsMap.get(key);
        if (!hex) {
          return 0;
        }
        var delay = Math.abs(doubledWidthDistance(center, hex.coordinates)) * 150;
        return delay
      }
    }, 0);
    this.animationService.addAnimation({
      targets: this.elementRef.nativeElement,
      opacity: [0, 1],
      duration: 1
    }, 0);
  }

  private setUpGrid(gridDimensions: GridDimensions): void {
    this.createGrid(gridDimensions.rows, gridDimensions.columns);
    this.hexagons = Array.from(this.hexagonsMap.values());
    this.setGridDimensions(gridDimensions);
  }

  private createGrid(rows: number, columns: number ) {
    var maxY = Math.floor(rows / 2);    
    for (var r = -maxY; r <= maxY; r++) {
      var offset = (r ^ 1) & 1;    
      for (var c = -columns+offset; c <= columns; c += 2) {
        this.hexagonsMap.set(`${c},${r}`, {
          coordinates: {
            y: r,
            x: c
          },
          key: `${c},${r}`,
          translate: this.getTransform(r, c),
        });
      }      
    }
  }

  private getGridDimensions(height: number, width: number): GridDimensions {
    var rows = Math.ceil((height - this.hexagonSize) / this.verticalOffset + 1);
    var columns = Math.ceil(width / this.hexagonWidth) | 1;
    return { rows, columns };
  }

  private setGridDimensions(gridDimensions: GridDimensions): void {
    this.grid.set(gridDimensions);
  }

  private getTransform(row: number, column: number): string {
    return `translate(${column * this.horizontalOffset}, ${row * this.verticalOffset})`;
  }
}
