import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import anime, { AnimeAnimParams, AnimeTimelineInstance } from 'animejs';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private animeTimelineInstance?: AnimeTimelineInstance;
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.animeTimelineInstance = anime.timeline({
        autoplay: false,
        duration: 5000,
        round: 10000,
        easing: 'linear',
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
