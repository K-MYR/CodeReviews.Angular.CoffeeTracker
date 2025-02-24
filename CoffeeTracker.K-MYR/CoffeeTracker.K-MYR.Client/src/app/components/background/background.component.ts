import { resizeObserverToObserverable } from '../../helpers/helpers';
import { Hexagon } from '../../interfaces/hexagon';

import { throttleTime, distinctUntilChanged, map, Observable} from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, ElementRef, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-background',
  standalone: true,
  imports: [],
  templateUrl: './background.component.html',
  styleUrl: './background.component.scss'
})
export class BackgroundComponent implements OnInit{
  private platformId = inject(PLATFORM_ID);
  private elementRef: ElementRef = inject(ElementRef);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private hexagonSize: number = 35;
  private hexagonWidth: number = Math.sqrt(3) * this.hexagonSize;
  private hexagonHeight: number = this.hexagonSize * 2;
  private horizontalOffset: number =  this.hexagonWidth * 0.5;
  private verticalOffset: number = 1.5 * this.hexagonSize;  
  private $resizeEntries!: Observable<ResizeObserverEntry[]>;

  private hexagonsMap: Map<string, Hexagon> = new Map();
  hexagons: Hexagon[] = [];
  svgViewBox: string = "0 0 0 0";
  svgWidth: number = 0;
  svgHeight: number = 0;
   
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.$resizeEntries = resizeObserverToObserverable(this.elementRef.nativeElement);
      this.$resizeEntries
        .pipe(
          throttleTime(50, undefined, { trailing: true }),
          distinctUntilChanged((prev, curr) => {
            return prev[0].contentRect.height >= curr[0].contentRect.height
              && prev[0].contentRect.width >= curr[0].contentRect.width
          }),
          map((entries) => {
            return this.getGridDimensions(entries[0].contentRect.height, entries[0].contentRect.width)
          }),
          distinctUntilChanged((prev, curr) => {
            return prev.columns >= curr.columns && prev.rows >= curr.rows
          }),
          takeUntilDestroyed(this.destroyRef)
      ).subscribe(({ rows, columns }) => {
          this.createGrid(rows, columns);
          this.hexagons = Array.from(this.hexagonsMap.values());
          this.setSvgViewbox(rows, columns);
          this.changeDetectorRef.detectChanges();
        });
    }   
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
          translate: this.getTransform(r, c)
        });
      }      
    }
  }

  private getGridDimensions(height: number, width: number): { rows: number, columns: number } {
    var rows = Math.ceil((height - this.hexagonSize) / this.verticalOffset + 1);
    var columns = Math.ceil(width / this.hexagonWidth) | 1;
    return { rows, columns };
  }

  private setSvgViewbox(rows: number, columns: number) {
    var height = (rows-1) * this.hexagonHeight + this.hexagonHeight;
    var width = columns * this.hexagonWidth;
    this.svgViewBox = `${-width * 0.5} ${-height * 0.5} ${width} ${height}`;
    this.svgWidth = width;
    this.svgHeight = height;
  }

  getTransform(row: number, column: number): string {
    return `translate(${column * this.horizontalOffset}, ${row * this.verticalOffset})`;
  }

  func(hex: Hexagon) {
    console.log(hex);
  }
}
