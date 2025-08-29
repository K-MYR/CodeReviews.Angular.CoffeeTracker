import { Component, OnInit } from '@angular/core';
import { CoffeeConsumption } from '../coffee-consumption';
import { CoffeeService } from '../coffee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view',
  imports: [DatePipe],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css',
})
export class ViewComponent implements OnInit {
  id!: number;
  coffeeConsumption!: CoffeeConsumption;

  constructor(
    public coffeeService: CoffeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['coffeeId'];
    this.coffeeService.find(this.id).subscribe((res: any) => {
      this.coffeeConsumption = res;
    });
  }
}
