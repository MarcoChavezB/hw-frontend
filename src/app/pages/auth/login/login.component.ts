import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController, LoadingController, IonContent, IonItem, IonLabel, IonInput, IonText, IonButton, IonImg } from "@ionic/angular/standalone";
import { RECAPTCHA_SETTINGS, RecaptchaModule } from 'ng-recaptcha';
import { AuthService } from 'src/app/services/auth/auth-service';
import { DataService } from 'src/app/services/data/data-service';
import { environment } from 'src/environments/environment.prod';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: { siteKey: '6LdkpCIsAAAAABlXRbHBhYjm_GQM_Y89N6lOnEzh' },
        }
    ],
    imports: [IonImg, RecaptchaModule, IonButton, IonText, IonInput, IonLabel, IonItem, IonContent, ReactiveFormsModule, CommonModule],
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    authService = inject(AuthService);
    dataService = inject(DataService);
    deferredPrompt: any = null;
    showInstallButton = true;
    loading: boolean = false;
    recaptchaToken: string | null = null;

    onRecaptchaResolved(token: string | null) {
        this.recaptchaToken = token;
    }

    constructor(private fb: FormBuilder, private alertCtrl: AlertController, private router: Router, private toastCtrl: ToastController,
        private loadingCtrl: LoadingController) { }

    ngOnInit() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
        });

        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.showInstallButton = false;
        } else {
            window.addEventListener('beforeinstallprompt', (event: any) => {
                event.preventDefault();
                this.deferredPrompt = event;
                this.showInstallButton = true;
            });

            window.addEventListener('appinstalled', () => {
                this.showInstallButton = false;
                this.deferredPrompt = null;
            });
        }
    }
    async showLoading(message: string = 'Cargando...') {
        const loading = await this.loadingCtrl.create({
            message: message,
        });

        loading.present();
    }
    async hiddeLoading() {
        await this.loadingCtrl.dismiss();
    }
    login() {
        if (!this.recaptchaToken) {
            this.presentAlert();
            return;
        }

        if (!this.loginForm.valid) {
            return;
        }
        this.showLoading("Iniciando sesión...");
        const { email, password } = this.loginForm.value;
        this.authService.login(email, password, this.recaptchaToken).subscribe({
            next: async (response) => {
                if ((window as any).grecaptcha) {
                    (window as any).grecaptcha.reset();
                }
                this.dataService.guardarUserData(response);
                this.loadingCtrl.dismiss();
                this.loading = false;
                this.goToFyp();
            }, error: async (error) => {
                this.loading = false;

              /*
                if (error.error.requires_email_code && this.recaptchaToken) {
                    this.resentVerifyCode();
                    this.router.navigate(['/verify-code'], { queryParams: { email: this.loginForm.get('email')?.value } });
                    this.hiddeLoading();
                    return;
                }*/
                if ((window as any).grecaptcha) {
                    (window as any).grecaptcha.reset();
                }
                this.recaptchaToken = null;
                const toast = await this.toastCtrl.create({
                    message: 'Error al iniciar sesión. Por favor, verifica tus credenciales.',
                    duration: 3000,
                });
                this.hiddeLoading();
                toast.present();
            }
        });
    }

    resentVerifyCode() {
        this.authService.resendVerifyCode(
            this.loginForm.get('email')?.value,
        ).subscribe({
            next: async (response) => {
                const toast = await this.toastCtrl.create({
                    message: 'Se envio un codigo a tu numero telefonico por favor confirmalo para continuar.',
                    duration: 3000,
                });
                await toast.present();
            }
        });
    }

    goToRegister() {
        this.loginForm.reset();
        if ((window as any).grecaptcha) {
            (window as any).grecaptcha.reset();
        }
        this.recaptchaToken = null;
        this.router.navigate(['/register']);
    }

    goToFyp() {
        this.loginForm.reset();
        this.router.navigate(['']);
    }
    installPWA(): void {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then(async (choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                    const toast = await this.toastCtrl.create({
                        message: 'Se ha iniciado la instalación de la Hidden Ways.',
                        duration: 3000,
                    });
                    await toast.present();
                } else {
                    const toast = await this.toastCtrl.create({
                        message: 'La instalación de la Hidden Ways fue cancelada.',
                        duration: 3000,
                    });
                    await toast.present();
                }
                this.deferredPrompt = null;
            });
        }
    }

    async presentAlert() {
        const alert = await this.alertCtrl.create({
            header: 'Alerta!',
            message: 'Por favor, completa el reCAPTCHA antes de continuar.',
            buttons: [
                {
                    text: 'Aceptar',
                    role: 'cancel',
                    handler: () => {
                    },
                },
            ],
        });

        await alert.present();
    }
}
