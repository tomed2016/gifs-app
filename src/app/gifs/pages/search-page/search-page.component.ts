import { Component, inject, signal } from '@angular/core';
import { GifListComponent } from "../../components/gif-list/gif-list.component";
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'gif-search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent {

  gifSservice = inject(GifService);
  gifs = signal<Gif[]>([]);

  onSearch (query: string) {
    this.gifSservice.saarchGif(query)
      .subscribe( resp =>{
        this.gifs.set(resp);
      });
  }
}
