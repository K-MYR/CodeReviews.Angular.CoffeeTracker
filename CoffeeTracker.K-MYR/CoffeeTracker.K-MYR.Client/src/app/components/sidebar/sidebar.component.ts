import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  imageUrl = 'assets/img/coffee-topdown.jpg';
  recordForm = new FormGroup({
    type: new FormControl(''),
    dateTime: new FormControl('')
  })
}
