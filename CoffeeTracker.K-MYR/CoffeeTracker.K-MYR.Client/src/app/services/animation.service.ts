import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AnimationParams, createTimeline, TargetsParam, Timeline} from 'animejs';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private animeTimelineInstance?: Timeline;
  private platformId = inject(PLATFORM_ID);
  private animationFinished = new ReplaySubject<void>(1);
  $animationFinished = this.animationFinished.asObservable();
  readonly animationDuration: number = 2000;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.animeTimelineInstance = createTimeline({
        duration: this.animationDuration,
        autoplay: false,
        onComplete: () => {
          this.animationFinished.next();
        }
      });
    }    
  }

  addAnimation(targetsParams: TargetsParam, animationParams: AnimationParams, timelineOffset?: number | string): void {
    this.animeTimelineInstance?.add(targetsParams, animationParams, timelineOffset);

  }

  play(): void {
    if (this.animeTimelineInstance?.paused) {
      this.animeTimelineInstance.play();
    }
  }

  complete(): void {
    if (this.animeTimelineInstance) {
      this.animeTimelineInstance.complete();
    }
  }
}
