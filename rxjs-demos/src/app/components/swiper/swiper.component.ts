import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    Renderer2,
    ViewChild,
} from '@angular/core';

const INTERVAL = 2000;

@Component({
    selector: 'app-swiper',
    templateUrl: './swiper.component.html',
    styleUrls: ['./swiper.component.scss'],
})
export class SwiperComponent implements AfterViewInit, OnDestroy {
    list = [
        { text: '中国技术世界领先' },
        { text: '什么才是让人折服的力量' },
        { text: '没有神的世界' },
        { text: '中国技术世界领先' },
    ];

    @ViewChild('contentBox') private __contentBoxRef!: ElementRef;
    private __itemHeight = 21; // 每项的高度
    private __stop = false; // 运行状态
    private __index = 0; // 缓存当前位置

    constructor(private __renderer2: Renderer2) {}

    ngAfterViewInit(): void {
        this.start();
    }

    ngOnDestroy(): void {
        this.stop();
    }

    start(): void {
        this.__stop = false;
        this.__swiper();
    }

    stop(): void {
        this.__stop = true;
    }

    /**
     * 实现列表向上无限循环滚动
     */
    private __swiper(delay = INTERVAL): void {
        let interval = delay;
        let transition = '';
        let timer = setTimeout(() => {
            if (this.__stop) {
                clearTimeout(timer);
                return;
            } else {
                ++this.__index;
            }

            if (this.__index > this.list.length - 1) {
                // 位置超出最后一个复制块后，直接无动画移动到真实的第一个元素
                this.__index = 0;
                transition = 'none';
                // 间隔时间修改为正常间隔的一半
                interval = INTERVAL / 2;
            } else {
                transition = 'top 0.5s';
                // 如果是最后一个复制块，间隔时间修改为正常间隔的一半
                interval = this.__index === this.list.length - 1 ? (INTERVAL / 2) : INTERVAL;
            }

            // 滚动
            this.__renderer2.setStyle(
                this.__contentBoxRef.nativeElement,
                'transition',
                transition,
            );
            this.__renderer2.setStyle(
                this.__contentBoxRef.nativeElement,
                'top',
                `${-1 * this.__itemHeight * this.__index}px`,
            );
            // 开始下次滚动
            this.__swiper(interval);
        }, interval);
    }
}
