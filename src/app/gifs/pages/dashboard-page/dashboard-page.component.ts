import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GifsSideMenuComponent } from "../../components/gifs-side-menu/gifs-side-menu.component";
import { GifService } from '../../services/gifs.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterOutlet, GifsSideMenuComponent],
  templateUrl: './dashboard-page.component.html',

})
export default class DashboardPageComponent {

  gifsService = inject(GifService);

}
