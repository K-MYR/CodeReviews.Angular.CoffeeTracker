import { Component, OnInit } from '@angular/core';
import { CoffeeConsumption } from '../coffee-consumption';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CoffeeService } from '../coffee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent implements OnInit {
  id!: number;
  coffeeConsumption!: CoffeeConsumption;
  form!: FormGroup;

  constructor(
    public coffeeService: CoffeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['coffeeId'];
    this.coffeeService.find(this.id).subscribe((data) => {
      this.coffeeConsumption = data;
    });
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
    let coffee: CoffeeConsumption = (this.coffeeConsumption = this.form.value);
    coffee.id = this.id;
    this.coffeeService.update(coffee).subscribe((res: any) => {
      console.log('updated');
      this.router.navigateByUrl('/coffee/index');
    });
  }
}
