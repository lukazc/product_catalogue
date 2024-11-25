import { Component } from '@angular/core';
import { UserStateService } from '../../state/user-state.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss'],
    imports: [CommonModule]
})
export class LogoutComponent {
    user: User | null = null;

    constructor(private userStateService: UserStateService) {
        this.userStateService.user$.subscribe(user => {
            this.user = user;
        });
    }

    /**
     * Logs out the current user.
     */
    onLogout(): void {
        this.userStateService.logout();
    }
}