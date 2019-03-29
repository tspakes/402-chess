import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app-countdown',
    templateUrl: './countdown.component.html',
    styleUrls: ['./countdown.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class CountdownComponent implements OnInit, OnDestroy {

    public countdownInterval = -1;
    // Holds the timer information
    days = 0;
    hours = 0;
    minutes = 0;
    seconds = 0;
    @Output() expired = new EventEmitter<any>();
    @Input() startingDate: any;
    @Input() endingDate: any = null;
    isExpired = false;

    constructor() {
    }


    ngOnInit() {

        this.countdownInterval = window.setInterval(() => {

            // Get todays date and time
            let now = moment.utc();


            if (this.endingDate != null) {
                now = this.endingDate;
            }

            // Find the distance between now and the count down date
            const distance = moment.duration(moment.utc(this.startingDate).diff(now));

            // Time calculations for days, hours, minutes and seconds
            this.days = distance.days();
            this.hours = distance.hours();
            this.minutes = distance.minutes();
            this.seconds = distance.seconds();


            if (distance.asMilliseconds() < 0) {
                this.isExpired = true;
                clearInterval(this.countdownInterval);
                this.expired.emit();
            }

        }, 0);

    }

    ngOnDestroy(): void {
    }

}
