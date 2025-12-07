import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IonContent, IonItem, LoadingController ,IonImg, IonLabel, IonInput, IonText, IonButton, IonLoading } from "@ionic/angular/standalone";
import { AuthService } from 'src/app/services/auth/auth-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [IonLoading, IonButton, IonText, IonInput, IonLabel, IonImg, IonContent, IonItem, CommonModule, ReactiveFormsModule, FormsModule]
})
export class RegisterComponent implements OnInit {
  authService = inject(AuthService);
  step = 1;
  registerForm: FormGroup; 
  namesTaken: string[] = [];
  isLoading = false;
  isNameTaken = false;
  isPasswordMismatch = false;  
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      code: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      preferredName: ['', Validators.required],
    });
  }

  async showLoading(message: string = 'Cargando...') {
    const loading = await this.loadingCtrl.create({
      message: message,
    });

    loading.present();
  }
  
  ngOnInit() {
    this.getUserNamesList();
  }

  getUserNamesList(){
    this.authService.getUserNamesList().subscribe({
        next: (response) => {
            this.namesTaken = response;
        },
        error: (error) => {
            console.error('Error fetching user names list:', error);
        }
    })
  }

  nextStep() {
    const control = this.getCurrentControl();
    if (control?.valid) {
      this.step++;
    }
  }
  
  checkNamedTaken(){
    const preferredName = this.registerForm.get('preferredName')?.value.toLowerCase();
    if (this.namesTaken.includes(preferredName)){
        this.registerForm.get('preferredName')?.setErrors({ taken: true });
    } else {
        this.registerForm.get('preferredName')?.setErrors(null);
    }
    this.isNameTaken = this.registerForm.get('preferredName')?.hasError('taken') || false;
  }

  getCurrentControl() {
    switch (this.step) {
      case 1: return this.registerForm.get('name');
      case 2: return this.registerForm.get('email');
      case 3: return this.registerForm.get('code');
      case 4: return this.registerForm.get('password');
      default: return null;
    }
  }

  async register() {
    this.isPasswordMismatch = this.registerForm.get('password')?.value !== this.registerForm.get('confirmPassword')?.value;
    if (this.isPasswordMismatch) {
      return;
    }
  
    await this.showLoading('Enviando codigo...');
    this.authService.register(
        this.registerForm.get('name')?.value,
        this.registerForm.get('email')?.value,
        this.registerForm.get('password')?.value,
        this.registerForm.get('confirmPassword')?.value,
        this.registerForm.get('preferredName')?.value
    ).subscribe({
      next: async (response) => {
        this.loadingCtrl.dismiss();
        this.toastCtrl.create({
          message: response.message,
          duration: 3000,
        }).then(toast => toast.present());
        this.nextStep();
      },
      error: async (error) => {
        const toast = await this.toastCtrl.create({
          message: error.error.errors?.email ? error.error.errors.email[0] : 'Error al registrar. Por favor, intenta de nuevo.',
          duration: 3000,
        });
        await toast.present();    
        this.loadingCtrl.dismiss();
    } 
    });
  }
  
  verifyEmail(){
    this.showLoading('Verificanto correo solo un momento mas...');
    this.authService.verifyEmail(
        this.registerForm.get('email')?.value,
        this.registerForm.get('code')?.value
    ).subscribe({
      next: async (response) => {
        const toast = await this.toastCtrl.create({
          message: 'Correo verificado correctamente. Ya puedes iniciar sesión.',
          duration: 3000,
          color: 'success'
        });
        await toast.present();
        this.goToLogin();
        this.loadingCtrl.dismiss();
      },
      error: async (error) => {
        const toast = await this.toastCtrl.create({
          message: 'Error al verificar el correo. Por favor, intenta de nuevo.',
          duration: 3000,
          color: 'danger'
        });
        this.loadingCtrl.dismiss();
        await toast.present();
        } 
    });
  }
    prevStep() {
      if (this.step > 1) {
        this.step--;
      }
    }
    
    goToLogin() {
      this.router.navigate(['/login']);
    }

}
