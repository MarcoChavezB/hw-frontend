import { AuthService } from 'src/app/services/auth/auth-service';
import { IonImg } from '@ionic/angular/standalone';
import { IonInput } from '@ionic/angular/standalone';
import { IonLabel } from '@ionic/angular/standalone';
import { IonButton } from '@ionic/angular/standalone';
import { IonText } from '@ionic/angular/standalone';
import { IonItem, ToastController } from '@ionic/angular/standalone';
import { IonContent } from '@ionic/angular/standalone';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RECAPTCHA_SETTINGS, RecaptchaModule } from 'ng-recaptcha';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-code',
    templateUrl: './code.component.html',
    styleUrls: ['./code.component.scss'],
    providers: [
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: { siteKey: '6LdkpCIsAAAAABlXRbHBhYjm_GQM_Y89N6lOnEzh' },
        }
    ],
    imports: [RecaptchaModule, IonImg, IonContent, IonItem, IonText, IonButton, IonLabel, IonInput, ReactiveFormsModule, FormsModule, CommonModule]
})
export class CodeComponent implements OnInit {
    codeForm: FormGroup;
    recaptchaTokenCode: string | null = null;
    authService = inject(AuthService)
    email: string | null = null;
    route = inject(ActivatedRoute)
    router = inject(Router)

    constructor(private fb: FormBuilder, private toastCtrl: ToastController) {
        this.codeForm = this.fb.group({
            code: ['', Validators.required],
        });
    }


    ngOnInit() {
        this.route.queryParamMap.subscribe(params => {
            this.email = params.get('email');
        });
    }


    onRecaptchaResolved(token: string | null) {
        this.recaptchaTokenCode = token;
    }

    submitCode() {
        if (!this.codeForm.valid) {
            return;
        }

        this.authService.verifyEmail(
            this.email || '',
            this.codeForm.get('code')?.value.toString() || '',
            this.recaptchaTokenCode || ''
        ).subscribe({
            next: async (response) => {
                const toast = await this.toastCtrl.create({
                    message: 'Codigo confirmado, ahora puedes iniciar sesion.',
                    duration: 3000,
                });
                toast.present();
                this.router.navigate(['/login'], { replaceUrl: true, state: { animation: { direction: 'forward' } } });
            },
            error: async (error) => {
                const toast = await this.toastCtrl.create({
                    message: 'Error al verificar el código. Por favor, inténtalo de nuevo.',
                    duration: 3000,
                });
                toast.present();
            }
        }

        )
    }
}