import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

declare var Stripe: any;

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.css']
})

export class StripePaymentComponent implements OnInit {
  stripe: any;
  elements: any;
  paymentFormGroup: FormGroup;
  // show cost details
  showCost: boolean = false;

  // money to cost
  costMoney: number = 22.22;
  cardNumber: any;
  cardExpDate: any;
  cardCvc: any;

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.paymentFormGroup = this.fb.group({
      cardHolder: ['']
    });
  }

  ngAfterViewInit() {
    this.stripe = Stripe('pk_test_QnlLgcUVpanU1ADbqEhtHzcf');
    this.elements = this.stripe.elements({
      fonts: [
        {weight: 'bold'}
      ]
    });
    this.populatePaymentForm();
  }

  showCostDetails() {
    this.showCost = !this.showCost;
  }

  // collect payment form info
  collectPayInfo() {
    console.log(this.paymentFormGroup.value);
  }

  onSubmit() {
    console.log("Test Submit!!");
  }

  // populate payment form
  populatePaymentForm() {
    const style = {
      base: {
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        letterSpacing: '4px',
        ':-webkit-autofill': {
          color: '#fce883',
        },
        '::placeholder': {
          color: '#A9A9A9'
        },
      }
    };

    // card number field
    const cardNumber = this.elements.create('cardNumber', { style: style, placeholder: "1234 1234 1234 1234" });
    // card expiry date
    const cardExpDate = this.elements.create('cardExpiry', { style: style });
    // card cvc
    const cardCvc = this.elements.create('cardCvc', { style: style });

    cardNumber.mount('#payment-cardnumber');
    cardExpDate.mount('#payment-cardexp');
    cardCvc.mount('#payment-cardcvc');

    // Handle real-time validation errors from the card Element.
    cardNumber.addEventListener('change', (event) => {
      let displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    cardExpDate.addEventListener('change', (event) => {
      let displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    cardCvc.addEventListener('change', (event) => {
      let displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    let form = document.getElementById('payment-form');
    let cardStripe = this.stripe;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      cardStripe.createToken(cardNumber, {
        name: document.getElementById('card-holder')['value']
      }).then((result)=> {
        if (result.error) {
          // Inform the user if there was an error.
          let errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          // Send the token to your server.
          console.log("result is: ");
          console.log(result);
          console.log(result['token']['id']);
        }
      });
    });
  }
}