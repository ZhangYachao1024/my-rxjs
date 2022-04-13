import { Component, OnInit } from '@angular/core';
import { Observable, interval, Subject, Subscription, BehaviorSubject, ReplaySubject, AsyncSubject, of } from 'rxjs';
import { multicast, refCount } from 'rxjs/operators';

@Component({
    selector: 'app-subjects',
    templateUrl: './subjects.component.html',
    styleUrls: ['./subjects.component.scss'],
})
export class SubjectsComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}

    // 引用计数主体
    refcountSubject() {
        const source: Observable<number> = interval(500);
        const subject: Subject<number> = new Subject();
        const refcount = source.pipe(multicast(subject), refCount());
        let subscription1: Subscription, subscription2: Subscription;

        setTimeout(() => {
            subscription1 = refcount.subscribe((num: number): void => {
                console.log(`subscription1 -> ${num}`);
            });
        }, 1000);

        setTimeout(() => {
            subscription2 = refcount.subscribe((num: number): void => {
                console.log(`subscription2 -> ${num}`);
                subscription1.unsubscribe();
            });
        }, 2000);

        setTimeout(() => {
            subscription2.unsubscribe();
        }, 5000);
    }

    // 一般主体行为
    commonSubject(): void {
        const subject: Subject<number> = new Subject();
        // 定义初始值
        subject.next(0);
        subject.subscribe({
            next: (val) => console.log(`observeA: ${val}`),
        });
        subject.next(1);
        subject.next(2);
    }

    // behavior主体
    behaviorSubject(): void {
        const subject: BehaviorSubject<number> = new BehaviorSubject(0);
        // 定义初始值
        subject.subscribe({
            next: (val) => console.log(`observeA: ${val}`),
        });
        subject.next(1);
        subject.next(2);
        subject.subscribe({
            next: (val) => console.log(`observeB: ${val}`),
        });
    }

    // replay主体
    replaySubject(): void {
        const subject: ReplaySubject<any> = new ReplaySubject(2);

        subject.subscribe({
            next: (val) => console.log(`observerA: ${val}`),
        });

        subject.next(0);
        subject.next(1);
        subject.next(2);
        subject.next(3);

        subject.subscribe({
            next: (val) => console.log(`observerB: ${val}`),
        });
    }

    // async主体
    asyncSubject(): void {
        const subject: AsyncSubject<number> = new AsyncSubject();

        subject.subscribe((val: number) => {
            console.log(`observerA: ${val}`);
        });

        subject.next(0);
        subject.next(1);
        subject.next(2);
        subject.next(3);

        subject.subscribe({
            next: (val) => console.log(`observerB: ${val}`),
        });

        subject.complete();
    }

    // void主体
    voidSubject(): void {
        // RxJS v6+
    }
}
