import { Component, OnInit } from '@angular/core';
import { CoffeeConsumption } from '../coffee-consumption';
import { CoffeeService } from '../coffee.service';

@Component({
  selector: 'app-index',
  imports: [],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  sizeOfList: number = 10;
  page: number = 1;
  coffeeList: CoffeeConsumption[] = [];
  constructor(private coffeeService: CoffeeService) {}

  ngOnInit(): void {
    this.coffeeService
      .getPaginatedResult(this.page, this.sizeOfList)
      .subscribe((data: CoffeeConsumption[]) => {
        this.coffeeList = data;
        console.log(data);
      });
  }
  deleteCoffee(id: number) {
    this.coffeeService.delete(id).subscribe((response) => {
      this.coffeeList = this.coffeeList.filter((item) => item.id != id);
      console.log('deleted');
    });
  }
}
