import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CrudService } from './../../service/crud.service';
import { PageEvent, MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit, AfterViewInit {
  Books: any = [];
  filteredBooks: any = [];
  pagedBooks: any = [];
  searchTitle: string = '';
  searchDescription: string = '';
  minPrice: number | undefined;
  maxPrice: number | undefined;
  pageSize: number = 10;
  pageIndex: number = 0;
  deletionMessage: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
    this.crudService.GetBooks().subscribe(res => {
      this.Books = res;
      this.applyFilters();
    });
  }

  ngAfterViewInit(): void {
    this.applyPagination();
  }

  delete(id: any, i: any) {
    if (window.confirm('Are you sure you want to delete it permanently?')) {
      this.crudService.deleteBook(id).subscribe(() => {
        this.Books.splice(i, 1);
        this.applyFilters();
        this.showDeletionMessage(); // Show deletion message kagaya ng ginawa ko po sa update
      });
    }
  }

  applyFilters() {
    this.filteredBooks = this.Books.filter((book: any) => this.bookMatches(book));
    this.applyPagination();
  }

  applyPagination() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedBooks = this.filteredBooks.slice(startIndex, endIndex);
  }

  handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyPagination();
  }

  bookMatches(book: any): boolean {
    if (!this.searchTitle && !this.searchDescription && !this.minPrice && !this.maxPrice) return true;

    let titleMatch = !this.searchTitle || book.title.toLowerCase().includes(this.searchTitle.toLowerCase());
    let descriptionMatch = !this.searchDescription || book.description.toLowerCase().includes(this.searchDescription.toLowerCase());
    let priceMatch = (!this.minPrice || book.price >= this.minPrice) && (!this.maxPrice || book.price <= this.maxPrice);

    return titleMatch && descriptionMatch && priceMatch;
  }

  showDeletionMessage() {
    this.deletionMessage = 'Book deleted successfully';
    setTimeout(() => {
      this.deletionMessage = '';
    }, 3000);
  }
}
