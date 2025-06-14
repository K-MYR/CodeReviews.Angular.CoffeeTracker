import { AuthService } from '../../../services/auth.service';
import { hasNoNulls, mapKeys } from '../../../helpers/general';
import { CONFIRM_EMAIL_QUERY_PARAM_KEYS } from '../../../route-guards/query-params.guard';
import { ConfirmEmail } from '../../../interfaces/confirm-email';
import { LoadingIndicatorTextPath } from '../../shared/loading-indicator/loading-indicator.component'
import { LoadingIndicatorComponent } from '../../shared/loading-indicator/loading-indicator.component';
import { AnimationService } from '../../../services/animation.service';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, OnInit} from '@angular/core';
import { first,switchMap } from 'rxjs';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [LoadingIndicatorComponent],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private animationService = inject(AnimationService)
  textPaths: LoadingIndicatorTextPath[] = [
    { text: 'Confirming Email .  .  .', startOffset: 0, id: "t1"},
    { text: 'Confirming Email .  .  .', startOffset: 0.5, id: "t2" },
  ];

  ngOnInit() {   
    this.route.queryParams.pipe(      
      first(params => {
        var isValid = hasNoNulls<ConfirmEmail>(params, CONFIRM_EMAIL_QUERY_PARAM_KEYS);
        if (isValid) {
          return true;
        }
        this.textPaths = [
          { text: '⚠️  Error  ⚠', startOffset: 0, id: "t1" },
          { text: '⚠️  Error  ⚠️', startOffset: 0.5, id: "t2" },
        ];
        return false;
      }
      ),
      switchMap((params: unknown) => {
        return this.authService.confirmEmail(
          mapKeys<ConfirmEmail, keyof ConfirmEmail>(params as ConfirmEmail, CONFIRM_EMAIL_QUERY_PARAM_KEYS)
        )
      })
    ).subscribe({
      next: response => {
        this.textPaths = [
          { text: 'Success . . .', startOffset: 0, id: "t1" },
          { text: 'Redirecting . . .', startOffset: 0.5, id: "t2" },
        ];
        this.animationService.$animationFinished.subscribe(() => {
          setTimeout(() => {
            this.router.navigateByUrl("auth/login");
          }, 1000)
        });   
      },
      error: error => { 
        this.textPaths = [
          { text: '⚠️  Error  ⚠', startOffset: 0, id: "t1" },
          { text: '⚠️  Error  ⚠️', startOffset: 0.5, id: "t2" },
        ];
      }
    });
  }    
}


