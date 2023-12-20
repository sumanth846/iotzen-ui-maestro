import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class SearchService {

  // messages: Subject<any>;
  public searchText: Subject<any> = new BehaviorSubject<any>('');
  public searchPlaceholderValue: Subject<any> = new BehaviorSubject<any>('');
  public resetSearchTextValue: Subject<any> = new BehaviorSubject<any>(0);
  public searchedInfoValue: Subject<any> = new BehaviorSubject<any>('all');
  public isSearchBarNeeded: Subject<any> = new BehaviorSubject<any>(false);
  public isCancelBtnClickedInPopup: Subject<any> = new BehaviorSubject<any>(false);


  // Our constructor calls our wsService connect method
  constructor() { }

  showSearchBar(isSearchBarNeeded: boolean) {
    setTimeout(() => {
      this.isSearchBarNeeded.next(isSearchBarNeeded);
    }, 0)
  }
  sendSearchText(text, id?) {
    if (id) {
      const obj = {
        text: text,
        id: id
      };
      this.searchText.next(obj);
    } else {
      this.searchText.next(text);
    }
  }
  sendSearchPlaceholderValue(placeholder) {
    this.searchPlaceholderValue.next(placeholder);
  }
  sendSearchedInfoValue(value) {
    this.searchedInfoValue.next(value);
  }
  resetSearchTextInSearchBox() {
    this.resetSearchTextValue.next(Math.random());
  }

  sendCancelBtnInPopupClickedEvent(value) {
    this.isCancelBtnClickedInPopup.next(value);
  }


}
