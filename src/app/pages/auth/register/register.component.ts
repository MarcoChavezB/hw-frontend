import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IonContent, IonItem, IonImg, IonLabel, IonInput, IonText, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [IonButton, IonText, IonInput, IonLabel, IonImg, IonContent, IonItem, CommonModule, ReactiveFormsModule, FormsModule]
})
export class RegisterComponent implements OnInit {

  step = 1;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      code: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  nextStep() {
    const control = this.getCurrentControl();
    if (control?.valid) {
      this.step++;
    }
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
    if (this.registerForm.valid) {
      console.log('Datos de registro:', this.registerForm.value);

      const toast = await this.toastCtrl.create({
        message: 'Registro completado!',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      toast.present();

      this.router.navigate(['/home']);
    }
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
