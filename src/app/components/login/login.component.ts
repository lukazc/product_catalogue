import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserStateService } from '../../state/user-state.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [ReactiveFormsModule]
})
export class LoginComponent {
    loginForm: FormGroup;

    constructor(private fb: FormBuilder, private userStateService: UserStateService) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    /**
     * Handles the form submission for login.
     */
    onSubmit(): void {
        if (this.loginForm.valid) {
            const { username, password } = this.loginForm.value;
            this.userStateService.login(username, password);
        }
    }
}
