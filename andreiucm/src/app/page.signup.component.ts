import { Component } from "@angular/core";
import {
	FormBuilder,
	FormGroup,
	Validators,
	ReactiveFormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { UserService } from "./user.service";

@Component({
	selector: "signup",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	template: `
    <div class="signup-container">
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
        <h2>Sign Up</h2>
        <div class="form-group">
            <label for="name">Name</label>
            <input id="name" type="text" formControlName="name" required />
            @if (signupForm.get('name')?.invalid && signupForm.get('name')?.touched) {
                <div class="error">Name is required</div>
            }
        </div>
        <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" formControlName="email" required />
            @if (signupForm.get('email')?.invalid && signupForm.get('email')?.touched) {
                <div class="error">Valid email is required</div>
            }
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" formControlName="password" required />
            @if (signupForm.get('password')?.invalid && signupForm.get('password')?.touched) {
                <div class="error">Password is required</div>
            }
        </div>
        <button type="submit" [disabled]="signupForm.invalid">Sign Up</button>
        </form>
    </div>
    `,
	styles: `
    .signup-container {
        max-width: 350px;
        margin: 5rem auto;
        padding: 2rem;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 16px rgba(0,0,0,0.07);
    }
    h2 {
        text-align: center;
        margin-bottom: 2rem;
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
    input {
        padding: 0.5rem 1rem;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-size: 1rem;
    }
    .error {
        color: #d32f2f;
        font-size: 0.85rem;
        margin-top: 0.25rem;
    }
    button {
        width: 100%;
        padding: 0.75rem;
        background: #1976d2;
        color: #fff;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
    }
    button:disabled {
        background: #b0b0b0;
        cursor: not-allowed;
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
