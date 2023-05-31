import { Component, computed, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent {
  private readonly authService = inject(AuthService);

  public user = computed(() => this.authService.currentUser());

  public logout() {
    this.authService.logout();
  }
}
