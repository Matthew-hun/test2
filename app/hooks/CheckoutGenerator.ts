import { CheckoutModeType } from "../types/types";

enum DartType {
  Single = "Single",
  Double = "Double",
  Triple = "Triple",
}

class Dart {
  type: DartType;
  value: number;

  constructor(type: DartType, value: number) {
    this.type = type;
    this.value = value;
  }

  static GetDarts = () => {
    const darts = [];
    darts.push({ type: DartType.Double, value: 50, trueValue: 25 });
    darts.push({ type: DartType.Single, value: 25, trueValue: 25 });
    for (let i = 20; i >= 1; i--) {
      const newTripleDart = {
        type: DartType.Triple,
        value: i * 3,
        trueValue: i,
      };
      const newDoubleDart = {
        type: DartType.Double,
        value: i * 2,
        trueValue: i,
      };
      const newSingleDart = {
        type: DartType.Single,
        value: i,
        trueValue: i,
      };
      darts.push(newTripleDart);
      darts.push(newDoubleDart);
      darts.push(newSingleDart);
    }
    return darts;
  };
}

class Checkout {
  firstDart: Dart | undefined;
  secondDart: Dart | undefined;
  thirdDart: Dart;

  constructor(thirdDart: Dart, secondDart?: Dart, firstDart?: Dart) {
    this.firstDart = firstDart;
    this.secondDart = secondDart;
    this.thirdDart = thirdDart;
  }
}

export class CheckoutGenerator {
  checkouts: Checkout[];
  constructor() {
    this.checkouts = [];
  }

  GenerateCheckouts = (score: number, checkoutMode: CheckoutModeType) => {
    this.checkouts = [];
    const darts = Dart.GetDarts();

    // 1 dart checkout - az egyetlen nyíl lesz a thirdDart
    darts.forEach((d1) => {
      if (
        d1.type.toString() === checkoutMode.toString() &&
        d1.value === score
      ) {
        this.checkouts.push(new Checkout(new Dart(d1.type, d1.trueValue)));
      }
    });

    // 2 dart checkout - d2 lesz a thirdDart (utolsó nyíl)
    darts.forEach((d1) => {
      darts.forEach((d2) => {
        if (
          d2.type.toString() === checkoutMode.toString() &&
          d1.value + d2.value === score
        ) {
          this.checkouts.push(
            new Checkout(
              new Dart(d2.type, d2.trueValue), // thirdDart
              new Dart(d1.type, d1.trueValue) // secondDart
            )
          );
        }
      });
    });

    // 3 dart checkout - d3 lesz a thirdDart (utolsó nyíl)
    darts.forEach((d1) => {
      darts.forEach((d2) => {
        darts.forEach((d3) => {
          if (
            d3.type.toString() === checkoutMode.toString() &&
            d1.value + d2.value + d3.value === score
          ) {
            this.checkouts.push(
              new Checkout(
                new Dart(d3.type, d3.trueValue), // thirdDart
                new Dart(d2.type, d2.trueValue), // secondDart
                new Dart(d1.type, d1.trueValue) // firstDart
              )
            );
          }
        });
      });
    });

    console.log(this.checkouts);
  };
}
