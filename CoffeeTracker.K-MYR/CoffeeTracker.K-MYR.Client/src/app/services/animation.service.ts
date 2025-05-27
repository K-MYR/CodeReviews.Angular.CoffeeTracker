import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import anime, { AnimeAnimParams, AnimeTimelineInstance } from 'animejs';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private animeTimelineInstance?: AnimeTimelineInstance;
  private platformId = inject(PLATFORM_ID);
  private animationFinished = new ReplaySubject<void>(1);
  $animationFinished = this.animationFinished.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.animeTimelineInstance = anime.timeline({
        autoplay: false,
        duration: 3000,
        round: 10000,
        easing: 'linear',
        complete: () => {
          this.animationFinished.next();
        }
      });
    }    
  }

  addAnimation(params: AnimeAnimParams, timelineOffset?: string | number): void {
    this.animeTimelineInstance?.add(params, timelineOffset);

  }

  play(): void {
    if (this.animeTimelineInstance?.paused) {
      this.animeTimelineInstance.play();
    }
  }
}
