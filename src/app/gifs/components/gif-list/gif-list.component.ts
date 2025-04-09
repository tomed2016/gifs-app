import { AfterViewInit, Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { Gif } from '../../interfaces/gif.interface';
import { GifService } from '../../services/gifs.service';
import { ScrollStateService } from '../../../shared/service/scroll-state.service';

@Component({
  selector: 'gif-list',
  imports: [],
  templateUrl: './gif-list.component.html',
})
export class GifListComponent implements AfterViewInit {
  gifs = input.required<Gif []>();
  gifService = inject(GifService);
  scrollStateService = inject(ScrollStateService);
  scrolDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv')

  ngAfterViewInit(): void {
    const scrollDiv = this.scrolDivRef()?.nativeElement;
    if (!scrollDiv) return;
    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();

  }

  onScroll(event: Event) {
    const scrollDiv = this.scrolDivRef()?.nativeElement;
    if (!scrollDiv) return;

    const scrollTop = scrollDiv.scrollTop;
    const clientHeight = scrollDiv.clientHeight;
    const scrollHeight = scrollDiv.scrollHeight;
    const scrollBottom = scrollHeight - (scrollTop + clientHeight);
    const isAtBottom = scrollTop + clientHeight + 300 >= scrollHeight;
    this.scrollStateService.trendingScrollState.set(scrollTop);

    if (isAtBottom) {
      this.gifService.loadTrendingGifs();
    }
  }

}
