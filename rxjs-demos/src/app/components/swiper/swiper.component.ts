import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    Renderer2,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'app-swiper',
    templateUrl: './swiper.component.html',
    styleUrls: ['./swiper.component.scss'],
})
export class SwiperComponent implements AfterViewInit, OnDestroy {
    list = [
        { text: '中国技术世界领先' },
        { text: '什么才是让人折服的力量' },
        { text: '中国技术世界领先' },
    ];

    private __stop = false;
    @ViewChild('contentBox') private __contentBoxRef!: ElementRef;

    constructor(private __renderer2: Renderer2) {}

    ngAfterViewInit(): void {
        this.startSwiper();
    }

    ngOnDestroy(): void {
        this.__stop = true;
    }

    /**
     * 实现列表向上无限循环滚动
     */
    startSwiper() {
        const itemHeight = 21; // 每项的高度
        const len = this.list.length;
        let index = 0;
        let top = 0;

        const swpier = (delay: number) => {
            const timer = setTimeout(() => {
                if (this.__stop) {
                    clearTimeout(timer);
                    return;
                }
                index++;
                if (index > len - 1) {
                    // 这时表示到了最后一个复制块，直接无动画移动到真实的第一个元素
                    index = 0;
                    top = 0;
                    this.__renderer2.setStyle(
                        this.__contentBoxRef.nativeElement,
                        'transition',
                        'none'
                    );
                    swpier(1000);
                } else {
                    top = -1 * itemHeight * index;
                    this.__renderer2.setStyle(
                        this.__contentBoxRef.nativeElement,
                        'transition',
                        'top 0.5s'
                    );
                    // 如果是最后一个复制块，间隔时间需要修改，加上最上面的替换块，合计2s。
                    index === len - 1 ? swpier(1000) : swpier(2000);
                }

                this.__renderer2.setStyle(
                    this.__contentBoxRef.nativeElement,
                    'top',
                    `${top}px`
                );
            }, delay);
        };

        swpier(2000);
    }
}
