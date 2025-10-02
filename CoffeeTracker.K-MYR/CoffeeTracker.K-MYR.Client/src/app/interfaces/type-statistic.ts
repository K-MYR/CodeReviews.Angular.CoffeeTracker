export class TypeStatistic {
  coffeeType: string;
  allTime: number = 0;
  yearCount: number = 0;
  monthCount: number = 0;
  weekCount: number = 0;
  dayCount: number = 0;

  constructor(coffeetype: string) {
    this.coffeeType = coffeetype;
  }
}
