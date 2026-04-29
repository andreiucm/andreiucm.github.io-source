import { Component } from "@angular/core";
import {
	FormBuilder,
	FormGroup,
	Validators,
	ReactiveFormsModule,
} from "@angular/forms";

import { Router } from "@angular/router";
import { UserService } from "./user.service";
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardComponent } from '@/shared/components/card';
import { ZardInputDirective } from '@/shared/components/input';

@Component({
	selector: "signup",
	standalone: true,
	imports: [ReactiveFormsModule, ZardButtonComponent, ZardCardComponent, ZardInputDirective],
	template: `
    <z-card class="signup-container" zTitle="Sign Up" zDescription="Create an account">
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
            <label for="name">Name</label>
            <input z-input id="name" type="text" formControlName="name" required />
            @if (signupForm.get('name')?.invalid && signupForm.get('name')?.touched) {
                <div class="error">Name is required</div>
            }
        </div>
        <div class="form-group">
            <label for="email">Email</label>
            <input z-input id="email" type="email" formControlName="email" required />
            @if (signupForm.get('email')?.invalid && signupForm.get('email')?.touched) {
                <div class="error">Valid email is required</div>
            }
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input z-input id="password" type="password" formControlName="password" required />
            @if (signupForm.get('password')?.invalid && signupForm.get('password')?.touched) {
                <div class="error">Password is required</div>
            }
        </div>
        <button z-button zFull type="submit" [zDisabled]="signupForm.invalid">Sign Up</button>
        </form>
    </z-card>
    `,
	styles: `
    .signup-container {
        max-width: 350px;
        margin: 5rem auto;
    }
    .form-group {
        margin-bottom: 1.5rem;
        display: flex;
        flex-direction: column;
    }
    label {
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    .error {
        color: #d32f2f;
        font-size: 0.85rem;
        margin-top: 0.25rem;
    }
    `,
})
export class SignupComponent {
	signupForm: FormGroup;

	constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
    ) {
    this.signupForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });
	}

	onSubmit() {
		if (this.signupForm.valid) {
			this.userService.signUp({
                name: this.signupForm.value.name,
				email: this.signupForm.value.email,
				password: this.signupForm.value.password,
			}).subscribe({
                next: () => {
                    this.router.navigate(["/login"]);
                }
            });
		} else {
			this.signupForm.markAllAsTouched();
		}
	}
}
