import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, ObservableInput, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class GifService {

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal<boolean>(true);
  searchHistory = signal<Record<string, Gif[]>>({})

  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  private http = inject(HttpClient);
  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
      this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
        },
      })
      .subscribe((response) => {

        const gifs = GifMapper.mapGiphyItemsToGifArray(response.data);
        this.trendingGifs.set(gifs)
        this.trendingGifsLoading.set(false);
        console.log({gifs});
    });
  }


  saarchGif(query: string): Observable<Gif[]> {
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        q: query,
        limit: 20,
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
        }))
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
}
