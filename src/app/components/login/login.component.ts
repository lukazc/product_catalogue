import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserStateService } from '../../state/user-state.service';

/**
 * LoginComponent is responsible for handling the login form.
 */
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [ReactiveFormsModule]
})
export class LoginComponent {
    loginForm: FormGroup;

    /**
     * Initializes the login form with form controls for username and password.
     * @param fb - FormBuilder instance to create form controls.
     * @param userStateService - Service to handle user state and login.
     */
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
