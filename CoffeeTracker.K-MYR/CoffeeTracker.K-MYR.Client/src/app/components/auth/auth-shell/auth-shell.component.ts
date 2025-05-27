import { BackgroundComponent } from '../../background/background.component';
import { SvgComponent } from '../../svg/svg.component';
import { AnimationService } from '../../../services/animation.service';

import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ApplicationRef, Component, ElementRef, inject, PLATFORM_ID, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { first } from 'rxjs';

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [ RouterOutlet, BackgroundComponent, SvgComponent ],
  templateUrl: './auth-shell.component.html',
  styleUrl: './auth-shell.component.scss'
})
export class AuthShellComponent implements AfterViewInit {
  private applicationRef = inject(ApplicationRef);
  private platformId = inject(PLATFORM_ID);
  private animationService = inject(AnimationService);
  private routerElement = viewChild.required<ElementRef<HTMLElement>>('router');

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.animationService.addAnimation({
        targets: this.routerElement().nativeElement,
        opacity: { value: [0,1], delay: 2500, duration: 1000}
      }, 0)
      this.applicationRef.isStable.pipe(first(isStable => isStable)).subscribe(() => {
        this.animationService.play();
      });
    }
  }
}
