import { Injectable } from '@angular/core';
import { combineLatest, concat, forkJoin, from, fromEvent, interval, merge, of, race, range, throwError, timer, zip } from 'rxjs';
import { combineAll, concatAll, map, mapTo, mergeAll, mergeMap, pairwise, take, tap, withLatestFrom } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class RxjsOperatorsService {

    // 领悟到的道理：
    // 1.操作符可以自动将Promise转换为Observable。
    // 2.如果操作符的入参是数组，则发出的值也是数组。

    constructor() { this.cancatMapFn(); }

    /********************************** 创建  ************************************/

    /**
     * 1.按顺序发出任意数量的值
     */
    ofFn() {
        const source1 = of(1, 2, 3); // 按顺序依次发出1,2,3
        const source2 = of(); // 没有发出值，则不执行subscribe
        source2.subscribe(val => { console.log(val); });
    }

    /**
     * 1.将数组、promise 或迭代器转换成 observable 。
     */
    fromFn() {
        const source1 = from([1, 2, 3]); // 和of(1, 2, 3)相同
        const source2 = from(new Promise(resolve => resolve(4))); // 4
        source2.subscribe(val => { console.log(val); });
    }

    /**
     * 1.将事件转换成 observable 。
     */
    fromEventFn() {
        const source1 = fromEvent(document, 'click');
        source1.pipe(
            map((event) => {
                return `Event timeStamp: ${event.timeStamp}`;
            })
        ).subscribe(val => { console.log(val); });
    }

    /**
     * 1.基于给定时间间隔发出数字序列。
     * 2.第一次发射不是立即发送的，而是在第一个周期过去之后才发送。
     */
    intervalFn() {
        const source1 = interval(); // 以极快间隔持续发出数字
        const source2 = interval(3000); // 与timer(3000, 3000)差不多
        source1.subscribe(val => { console.log(`time: ${Date()} value: ${val}`); });
    }

    /**
     * 1.给定持续时间后，再按照指定间隔时间依次发出数字。
     */
    timerFn() {
        const source1 = timer(); // 直接发出0，然后结束
        const source2 = timer(3000); // 3秒后发出0， 然后结束，因为没有第二个参数
        const source3 = timer(3000, 1000); // 等待3秒，间隔1秒（只有前4个数是间隔1秒）
        source1.subscribe(val => { console.log(`time: ${Date()} value: ${val}`); });
    }

    /**
     * 1.依次发出给定区间内的数字。
     */
    rangeFn() {
        const source1 = range(); // 不发出值
        const source2 = range(1, 10); // 极快的速度发出1-10
        source2.subscribe(val => { console.log(`time: ${Date()} value: ${val}`); });
    }

    /**
     * 1.在订阅上发出错误
     */
    throwErrorFn() {
        const source1 = throwError('这是一个错误'); // 必须有参数
        source1.subscribe({
            error: val => { console.log(`value: ${val}`); }
        });
    }

    /********************************** 组合  ************************************/

    /**
     * 静态方法。
     * * 当任意 observable 发出值时，依次发出每个 observable 的最新值(数组）。
     * * 数组形式传参，每次发出的值都是所有源observable发出的值的数组。
     * * 注意，combineLatest 直到每个 observable 都至少发出一个值后才会发出初始值(陷阱)
     */
    combineLatestFn() {
        const firstTimer = timer(0, 1000);
        const secondTimer = timer(500, 1000);
        const combinedTimers1 = combineLatest([]); // 传空数组或不传参，不发出值
        const combinedTimers2 = combineLatest([firstTimer, secondTimer]);
        combinedTimers2.subscribe(value => console.log(value));
    }

    /**
     * 实例方法
     * 1.当源 observable 【完成】时，对收集的 observables 使用 combineLatest 。
     * 2.注意，必须源observable【完成】并发出值，才有效
     */
    combineAllFn() {
        from([1, 2]).pipe(
            map(val => of(val + '-new')),
            combineAll(),
        ).subscribe(value => console.log(value)); // ['1-new', '2-new']
    }

    /**
     * 静态方法
     * * 当所有 observables 【完成】时，发出每个 observable 的最新值
     * * 当有一组 observables，但你只关心每个 observable 最后发出的值时，此操作符是最适合的。
     */
    forkJoinFn() {
        forkJoin([
            interval(1000).pipe(take(2)),
            interval(1500).pipe(take(1)),
        ]).subscribe(value => console.log(value));
    }

    /**
     * * 组合多个可观测对象以创建一个可观测对象，该可观测对象的值是根据其每个输入可观测对象的值按顺序计算出来的。
     * * 入参是序列，出参是数组
     * @memberof RxjsOperatorsService
     */
    zipFn() {
        let age$ = of(27, 25, 29);
        let name$ = of('Foo', 'Bar', 'Beer');
        let isDev$ = of(true, true, false);

        zip(age$, name$, isDev$).subscribe(x => console.log(x))
    }

    /**
     * 静态方法
     * * 将多个 observables 的值混合成一个 observable。任意源obserable发出值，都将触发订阅行为。
     * * 可以理解为多个源 observable 并行
     * * 可添加参数（number）表示最多并发执行的observable的个数
     * @memberof RxjsOperatorsService
     */
    mergeFn() {
        const first = interval(1000).pipe(take(2), mapTo('second!'));
        const second = interval(2000).pipe(take(2), mapTo('first'));
        const third = interval(3000).pipe(take(2), mapTo('third'));

        // 静态方法
        const source1 = merge(
            second,
            first,
            third,
        );
        // 会打印6次
        source1.subscribe(val => console.log(val));
    }

    /**
     * 实例方法：（注意，mergeAll是用来打平高阶可观察对象的，并非merge的操作符版本）
     * * 将一个高阶可观察对象转换为一个一阶可观察对象，该可观察对象并发地传递所有内部可观察对象发出的值。
     * * 一个发出Observable的Observable，也被称为高阶Observable。
     * * 可添加参数（number）表示最多并发执行的observable的个数
     */
    mergeAllFn() {
        const clicks = fromEvent(document, 'click');
        const higherOrder = clicks.pipe(map(() => interval(1000)));
        const firstOrder = higherOrder.pipe(mergeAll());
        firstOrder.subscribe(x => console.log(x));
    }

    /**
     * 实例方法：实际上等于map + mergeAll
     */
    mergeMapFn() {
        const clicks = fromEvent(document, 'click');
        const firstOrder = clicks.pipe(mergeMap(() => interval(1000)));
        firstOrder.subscribe(x => console.log(x));
    }

    /**
     * 静态方法
     * * 按照顺序，前一个 observable 完成了再订阅下一个 observable 并发出值。
     * * 可以理解为多个源 observable 并行，前一个完成，再订阅下一个。
     * * 实际上，concat是将并发参数设为1的merge操作符的等价。
     * @memberof RxjsOperatorsService
     */
    concatFn() {
        const timer = interval(1000).pipe(take(4));
        const sequence = range(1, 10).pipe(map(val => val + 's'));
        const result = concat(timer, sequence);
        result.subscribe(x => console.log(x));
    }

    /**
     * 实例方法：（注意，cancatAll是用来打平高阶可观察对象的，并非cancat的操作符版本）
     * * 通过将内部的可观察对象按顺序串联起来，将一个高阶可观察对象转换为一阶可观察对象。
     * * 实际上，concatAll等价于将并发参数设置为1的mergeAll。
     */
    cancatAllFn() {
        const clicks = fromEvent(document, 'click');
        const higherOrder = clicks.pipe(
            map(ev => interval(1000).pipe(take(4))),
        );
        const firstOrder = higherOrder.pipe(concatAll());
        firstOrder.subscribe(x => console.log(x));
    }

    /**
     * 实例方法：实际上等于map + cancatAll
     */
    cancatMapFn() {
        const clicks = fromEvent(document, 'click');
        const firstOrder = clicks.pipe(mergeMap(() => interval(1000).pipe(take(4))));
        firstOrder.subscribe(x => console.log(x));
    }

    /**
     * * 返回一个可观察对象(Observable)，它映射第一个发出对象的源可观察对象。
     *
     * @memberof RxjsOperatorsService
     */
    raceFn() {
        const obs1 = interval(1000).pipe(mapTo('fast one'));
        const obs2 = interval(3000).pipe(mapTo('medium one'));
        const obs3 = interval(5000).pipe(mapTo('slow one'));

        race(obs3, obs1, obs2)
            .subscribe(
                winner => console.log(winner)
            );
    }

    /**
     * * 将源observable发出的前一个值和当前值作为数组发出
     * @memberof RxjsOperatorsService
     */
    pairwiseFn() {
        const clicks = fromEvent(document, 'click');
        const pairs = clicks.pipe(pairwise());
        const distance = pairs.pipe(
            map((pair: any) => {
                const x0 = pair[0].clientX;
                const y0 = pair[0].clientY;
                const x1 = pair[1].clientX;
                const y1 = pair[1].clientY;
                return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
            }),
        );
        distance.subscribe(x => console.log(x));
    }

    /**
     * * 将源可观测对象与其他可观测对象组合以创建一个可观测对象，该可观测对象的值仅在源发射时才根据每个对象的最新值进行计算。
     * @memberof RxjsOperatorsService
     */
    withLatestFromFn() {
        const clicks = fromEvent(document, 'click');
        const timer = interval(1000);
        const result = clicks.pipe(withLatestFrom(timer));
        result.subscribe(x => console.log(x));
    }

    /************************ 过滤操作符 ************************/
    // debounce 根据一个选择器函数，舍弃掉在两次输出之间小于指定时间的发出值。
    // debounceTime 舍弃掉在两次输出之间小于指定时间的发出值
    // distinctUntilChanged 只有当当前值与之前最后一个值不同时才将其发出。
    // filter 发出符合给定条件的值。
    // first 发出第一个值或第一个通过给定表达式的值。
    // ignoreElements 忽略所有通知，除了 complete 和 error 。
    // last 根据提供的表达式，在源 observable 完成时发出它的最后一个值。
    // sample 当提供的 observable 发出时从源 observable 中取样。
    // single 发出通过表达式的第一项。
    // skip 跳过起始的N个(由参数提供)发出值。
    // skipUntil 跳过源 observable 发出的值，直到提供的 observable 发出值。
    // skipWhile 跳过源 observable 发出的值，直到提供的表达式结果为 false 。
    // take 接收起始的N个(由参数提供)发出值。
    // takeUntil 发出值，直到提供的 observable 发出值后停止。
    // takeWhile 发出值，直到提供的表达式结果为 false 。
    // throttle 根据函数节流
    // throttleTime 根据时间节流

    /************************ 转换操作符 ************************/
    // buffer 收集输出值，直到提供的 observable 发出才将收集到的值作为数组发出。
    // bufferCount 收集发出的值，直到收集完提供的数量的值才将其作为数组发出。
    // bufferTime 收集发出的值，直到经过了提供的时间才将其作为数组发出。
    // bufferToggle 设置缓冲区，手机开启时间内发出的值，将其作为数组发出。
    // bufferWhen 收集值，直到关闭选择器发出值后，才将缓冲的值作为数组发出。
    //
    //
    //
    //
    //
    //
    //
    //
}
