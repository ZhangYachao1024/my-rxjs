import { Component, OnInit } from '@angular/core';
import { RxjsOperatorsService, RxjsSubjectsService } from './services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(
        private __rxjsSubjectsService: RxjsSubjectsService,
        private __rxjsOperatorsService: RxjsOperatorsService,
    ) {}

    ngOnInit(): void {

    }


}
