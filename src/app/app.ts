
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';





import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
  Validators
} from '@angular/forms';


@Component({
  selector: 'app-root',
  

imports: [
  MatButtonModule,
  ReactiveFormsModule,
  FormsModule,
  MatFormFieldModule,
  
MatInputModule,
MatDatepickerModule,
MatNativeDateModule

],


  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('AngularApp4');

  // Angular Material notifications
  private snackBar = inject(MatSnackBar);


  showEventForm = false;

// RSVP form information
rsvp = {
  name: '',
  email: '',
  attending: 'yes'
};

// Store submitted RSVPs
rsvps: { name: string; email: string; attending: string }[] = [];


  // Reactive form with required field validation
  eventForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    

date: new FormControl<Date | null>(null, [
  Validators.required,
  control => {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate < today ? { pastDate: true } : null;
  }
]),

    
location: new FormControl('', [
  Validators.required
])
});


  // Show or hide the event creation form
  toggleEventForm() {
    this.showEventForm = !this.showEventForm;
  }

  // Store events created by the user
  events: { title: string; date: string; location: string }[] = [];

  // Validate and save a new event
  saveEvent() {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      
let message = 'Please complete all required fields.';

if (this.eventForm.controls.date.hasError('pastDate')) {
  message = 'Event date cannot be in the past.';
} else if (this.eventForm.controls.title.hasError('minlength')) {
  message = 'Event title must be at least 3 characters.';
}

this.snackBar.open(message, 'Close', {
  duration: 4000
});

      return;
    }

    const { title, date, location } = this.eventForm.getRawValue();

    // Add the valid event to our list
    this.events.push({
      title: title ?? '',
      
date: date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : '',

      location: location ?? ''
    });

   
this.snackBar.open('Event saved successfully!', 'Close', {
  duration: 3000
});


    // Clear the form and hide it
       this.eventForm.reset();
    this.showEventForm = false;
  }

  // Save a guest's RSVP
  submitRsvp() {
    // Store a copy of the guest's information
    this.rsvps.push({ ...this.rsvp });

    
this.snackBar.open('RSVP submitted successfully!', 'Close', {
  duration: 3000
});


    // Clear the form for the next guest
    this.rsvp = {
      name: '',
      email: '',
      attending: 'yes'
    };
  }

  // Simulate a failed HTTP request and handle the error
  simulateHttpError() {
    try {
      // Simulate a server connection failure
      throw new Error('Server unavailable');
    } catch (error) {
      console.error('Simulated HTTP error:', error);

      this.snackBar.open(
        'Unable to connect to the server. Please try again later.',
        'Close',
        { duration: 4000 }
      );
    }
  }

}
