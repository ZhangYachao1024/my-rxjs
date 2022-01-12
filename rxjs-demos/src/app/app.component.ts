import { Component } from '@angular/core';
import { RxjsOperatorsService, RxjsSubjectsService } from './services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent {

    constructor(
        private __rxjsSubjectsService: RxjsSubjectsService,
        private __rxjsOperatorsService: RxjsOperatorsService,
    ) {}

    getBc() {
        const abc = 'ad';
        return 123;
    }

}
