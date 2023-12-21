import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search-service.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss'
})

export class SearchBoxComponent implements OnChanges, OnInit, OnDestroy {

  public searchText: string;
  public placeholderValue: string;
  public searchedInfoValue$ = this.searchService.searchedInfoValue;
  // public showInfoIcon: boolean;
  //public showSearchIcon: boolean;
  private searchPlaceholderValueSub: Subscription;
  private resetSearchTextValueSub: Subscription;
  @Input() resetSearchTextToSearchBox: any;
  @Input() placeholderValueInput: string;
  @Input() id: string;
  @Input() isPlaceholderTranslationNotReq: boolean;

  constructor(private searchService: SearchService) {
    this.searchText = '';
    // this.placeholderValue = this.lang.getTranslation('sys.search');
    // this.showInfoIcon = true;
    // this.showSearchIcon = false;
  }

  ngOnInit() {
    this.placeholderValue = this.placeholderValueInput;
    this.searchPlaceholderValueSub = this.searchService.searchPlaceholderValue.subscribe(placeholderValue => {
      if (placeholderValue) {
        this.placeholderValue = placeholderValue;
        this.placeholderValueInput ? (this.placeholderValue = this.placeholderValueInput) : (this.placeholderValue = placeholderValue);
      }
    });
    this.resetSearchTextValueSub = this.searchService.resetSearchTextValue.subscribe(value => {
      if (value !== 0) {
        this.searchText = '';
        ((this.id) ? (this.searchService.sendSearchText(this.searchText, this.id)) : (this.searchService.sendSearchText(this.searchText)));
        // this.searchService.sendSearchText(this.searchText);
      }
    });
  }

  ngOnChanges() {
    if (this.resetSearchTextToSearchBox) {
      // this.showInfoIcon = false;
      // this.showSearchIcon = true;
      if (this.resetSearchTextToSearchBox === '/asset') {
        // this.showInfoIcon = true;
        // this.showSearchIcon = false;
      }
    }
  }

  ngOnDestroy() {
    this.searchPlaceholderValueSub?.unsubscribe();
    this.resetSearchTextValueSub?.unsubscribe();
  }

  searchForSelectedText(event) {
    ((this.id) ? (this.searchService.sendSearchText(event, this.id)) : (this.searchService.sendSearchText(event)));
    // this.searchService.sendSearchText(event);
  }

  clearSearchedText() {
    this.searchText = '';
    (this.id ? (this.searchService.sendSearchText(this.searchText, this.id)) : (this.searchService.sendSearchText(this.searchText)));
    // this.searchService.sendSearchText(this.searchText);
  }

  getLangLabelForSearch(labelCode: string) {
    if (labelCode) {
      if (!this.isPlaceholderTranslationNotReq) {
        const labelCodeArray = labelCode.split(' ');
        if (labelCodeArray.length > 1) {
          // return this.lang.getTranslation(labelCodeArray[1]);
        } else {
          return labelCode;
        }
      } else {
        return labelCode;
      }
    }
  }

}
