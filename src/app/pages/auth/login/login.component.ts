import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonText, IonButton, IonImg } from "@ionic/angular/standalone";
import { AuthService } from 'src/app/services/auth/auth-service';
import { DataService } from 'src/app/services/data/data-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonImg, IonButton, IonText, IonInput, IonLabel, IonItem, IonContent, ReactiveFormsModule, CommonModule],
})
export class LoginComponent  implements OnInit {
  loginForm!: FormGroup;
  authService = inject(AuthService);
  dataService = inject(DataService);
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login()  {
    if (!this.loginForm.valid) {
        return;
    }
    
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: async (response) => {
        this.dataService.guardarUserData(response);
        
        const cachedData = await this.dataService.obtenerUserData();
        console.log('Datos cacheados en IndexedDB:', cachedData);

        
        this.goToFyp();
      },
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
  
  goToFyp() {
    this.router.navigate(['/fyp']);
  }

}
