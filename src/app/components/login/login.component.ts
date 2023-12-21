import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonService } from '../../../app/services/common.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgOptimizedImage, FormsModule, InputTextModule, ButtonModule, HttpClientModule],
  // providers: [ClienteService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginStatus: string;
  email: string;
  password: string;

  constructor(private commonService: CommonService, private router: Router) {

  }
  login() {
    console.log(this.email);
    console.log(this.password);
    const obj = {
      username: this.email,
      password: this.password,
      language: 'en'
    }
    this.commonService.verifyUserDetails(obj).subscribe({
      next: (res) => {
        if (res) {
          localStorage.setItem('token', res?.['token']);
          this.router.navigate(['maestro']).then(_r => null);
        }
      },
      error: (err) => {
        console.error(err);
        this.loginStatus = err?.error?.msg
      }
    })
  }
}
