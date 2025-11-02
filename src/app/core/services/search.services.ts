import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private searchSubject = new Subject<string>();

  setSearchTerm(term: string) {
    this.searchSubject.next(term);
  }

  getSearchTerm(debounceMs = 300): Observable<string> {
    return this.searchSubject.asObservable().pipe(debounceTime(debounceMs), distinctUntilChanged());
  }
}
