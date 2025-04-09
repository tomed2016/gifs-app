import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, ObservableInput, tap } from 'rxjs';


const loadFromLocalStorage = () => {
  const gifs = localStorage.getItem('searchHistory') ?? '{}';
  return JSON.parse(gifs);
}

@Injectable({providedIn: 'root'})
export class GifService {

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal<boolean>(false);
  privateTrendingPage = signal<number>(0);
  private trendingPageSize = signal<number>(20);
  private trendingPageSizeSignal = signal<number>(20);
//Implemetancion de Masonry
//[ [Gif, Gif, Gif], [Gif, Gif, Gif], [Gif, Gif, Gif] ]
trendingGifGroup = computed<Gif[][]>(() => {
  const groups = [];
  for (let i = 0; i < this.trendingGifs().length; i += 3) {
    groups.push(this.trendingGifs().slice(i, i + 3));
  }
  console.log(groups);
  return groups;
})


  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  private http = inject(HttpClient);
  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    if (this.trendingGifsLoading()) return;
    this.privateTrendingPage.update(current => current + 1);
    this.trendingPageSize.set(this.trendingPageSizeSignal() + 20);
    this.trendingGifsLoading.set(true);
      this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: this.trendingPageSize(),
          offset: this.privateTrendingPage() * this.trendingPageSizeSignal(),
        },
      })
      .subscribe((response) => {

        const gifs = GifMapper.mapGiphyItemsToGifArray(response.data);
        this.trendingGifs.update(currentGifs => [
          ... currentGifs,
          ... gifs
        ]);
        this.trendingGifsLoading.set(false);
        console.log({gifs});
    });
  }


  searchGifs(query: string): Observable<Gif[]> {
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        q: query,
        limit: this.trendingPageSize(),
        offset: this.privateTrendingPage() * this.trendingPageSizeSignal(),
      },
    })
    .pipe(
      map(({ data }) => data),
      map(( items ) => GifMapper.mapGiphyItemsToGifArray(items)),

      //TODO: HIstorial
      tap( items => {
        this.searchHistory.update( history => ({
          ...history,
          [query.toLowerCase()]: items,
        }));
      })
      );

/*     .subscribe((response) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(response.data);
      console.log({search: gifs});
    });
 */}
 getHistoryGifs(query: string): Gif[] {
  return this.searchHistory()[query] ?? [];

 }

 saveToLocalStorage = effect( () => {
  localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory()));
 })



}
