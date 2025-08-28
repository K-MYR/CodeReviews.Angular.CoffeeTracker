import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CoffeeService } from '../coffee.service';
import { Router, RouterLink } from '@angular/router';
import { title } from 'process';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-create',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class CreateComponent implements OnInit {
  form!: FormGroup;

  constructor(public coffeeService: CoffeeService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      typeOfCoffee: new FormControl('', [Validators.required]),
      consumedAt: new FormControl('', Validators.required),
      amount: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(100000),
      ]),
      caffeine: new FormControl('', [Validators.required, Validators.min(0)]),
    });
  }
  get f() {
    return this.form.controls;
  }
  submit() {
    console.log(this.form.value);
    this.coffeeService.create(this.form.value).subscribe((res: any) => {
      console.log('Coffee created');
      this.router.navigateByUrl('/coffee/index');
    });
  }
}
