import { Component } from '@angular/core';

import { SportPage } from '../sport/sport';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = SportPage;

  constructor() {

  }
}
