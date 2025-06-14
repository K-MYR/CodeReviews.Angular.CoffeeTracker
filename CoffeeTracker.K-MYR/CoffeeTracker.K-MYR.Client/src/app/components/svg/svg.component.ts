import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, PLATFORM_ID, viewChild } from '@angular/core';
import { AnimationService } from '../../services/animation.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-svg',
  standalone: true,
  imports: [],
  templateUrl: './svg.component.html',
  styleUrl: './svg.component.scss'
})
export class SvgComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private animationService = inject(AnimationService);
  private polygon = viewChild.required<ElementRef>('polygon');
  private turbulence = viewChild.required<ElementRef>('turbulence');
  private displacement = viewChild.required<ElementRef>('displacement');
 ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.animationService.addAnimation(
        this.polygon().nativeElement,
        {
          duration: 2500,
          points: [
            {
              from: '202.437 171.2, 192.379 158.542, 196.059 173.890, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 188 189, 173.019 193.154, 188 194.82, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 197.911 212.042, 193.854 225.457, 204.118 215.763, 212.177 192.5,212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 222.882 213.764, 233.679 225.05, 228.333 212.042, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 236.352 194.820, 251.332 192.326, 236.352 189.018, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 228.333 173.890, 233.679 158.542, 222.882 171.2, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5',
              to: '202.437 171.2, 106.013 8.794, 196.059 173.890, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 188 189, -0 193.154, 188 194.82, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 197.911 212.042, 105.395 375.85, 204.118 215.763, 212.177 192.5,212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 222.882 213.764, 319.107 375.763, 228.333 212.042, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 236.352 194.820, 424.353 192.156, 236.352 189.018, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 228.333 173.890, 318.583 8.934, 222.882 171.2, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5, 212.177 192.5',
              ease: 'linear'
            },
            {
              to: '121.244 0, 106.013 8.794, 90.933 17.5, 90.933 52.5, 60.621 70, 60.621 105, 30.31 122.5, 30.31 157.5, 0 175, -0 193.154, -0 210, 30.31 227.5, 30.31 262.5, 60.621 280, 60.621 315, 90.933 332.5, 90.933 367.5, 105.395 375.85, 121.244 385, 151.555 367.5, 181.865 385, 212.176 367.5, 242.488 385, 272.799 367.5, 303.109 385, 319.107 375.763, 333.42 367.5, 333.42 332.5, 363.730 315, 363.730 280, 394.043 262.5, 394.043 227.5, 424.353 210, 424.353 192.156, 424.353 175, 394.043 157.5, 394.043 122.5, 363.730 105, 363.730 70, 333.420 52.5, 333.420 17.5, 318.583 8.934, 303.109 0, 272.799 17.5, 242.488 0, 212.176 17.5, 181.865 0, 151.555 17.5',
            }
          ],
          ease: 'linear'
        },
        0
      );
      this.animationService.addAnimation(
        this.turbulence().nativeElement,
        {
          targets: [],
          baseFrequency: {
            from: 0.05,
            to: 0.04
          },
          ease: 'linear'
        },
        0
      );
      this.animationService.addAnimation(
        this.displacement().nativeElement,
        {          
          scale: [
            {           
              fromTo: 15,
              duration: 2000
            },
            {
              from: 15,
              to: 1,
            }
          ],
          ease: 'linear'
        },
        0
      );
    }
  }   
}
