import {  Component } from '@angular/core';
import { GifListComponent } from "../../components/gif-list/gif-list.component";

@Component({
  selector: 'gif-trending-page',
  imports: [GifListComponent],
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent { }
