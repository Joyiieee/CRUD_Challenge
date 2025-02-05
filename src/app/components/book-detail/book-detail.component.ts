import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from './../../service/crud.service';
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})

export class BookDetailComponent implements OnInit {

  getId: any;
  updateForm: FormGroup;
  updateSuccess: boolean = false; // Variable to track update success

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private crudService: CrudService
  ) {
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.crudService.GetBook(this.getId).subscribe(res => {
      this.updateForm.setValue({
        title: res['title'],
        price: res['price'],
        description: res['description'],
        book_type: res['book_type']
      });
    });

    this.updateForm = this.formBuilder.group({
      title: [''],
      price: [''],
      description: [''],
      book_type: ['']
    })
  }

  ngOnInit() { }

  onUpdate(): any {
    this.crudService.updateBook(this.getId, this.updateForm.value)
      .subscribe(() => {
        console.log('Data updated successfully!')
        this.updateSuccess = true; // Set update success to true
        setTimeout(() => {
          this.updateSuccess = false; // Reset update success after 3 seconds
          this.ngZone.run(() => this.router.navigateByUrl('/books-list'))
        }, 3000);
      }, (err) => {
        console.log(err);
      });
  }

}
