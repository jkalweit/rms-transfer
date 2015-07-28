/// <reference path="../typings/tsd.d.ts" />

import moment = require('moment');

export class DbObjectModel {
    _id: string;
    lastModified: Date;
    static collectionName: string;
}

export class InventoryItemModel implements DbObjectModel {
    _id: string
    lastModified: Date;
    name: string;
    note: string;
    count: number;
    static collectionName: string = 'inventory_items';
}

export class VendorModel implements DbObjectModel {
    _id: string
    lastModified: Date;
    name: string;
    note: string;
    static collectionName: string = 'vendors';
}


export class ShiftModel implements DbObjectModel {
    _id: string
    lastModified: Date;
    date: Date
    start: string;
    end: string;
    positions: ShiftPositionModel[];
    static collectionName: string = 'shifts';

    static shiftLength(shift: ShiftModel|ShiftPositionModel) : any {
      var start = moment(shift.date);
      var end = moment(shift.date);
      if(shift.start && shift.end) {
        var startSplit = shift.start.split(':');
        var endSplit = shift.end.split(':');
        start.hour(startSplit[0] as any);
        start.minute(startSplit[1] as any);
        end.hour(endSplit[0] as any);
        end.minute(endSplit[1] as any);
        if(end.diff(start) < 0) { end.add(1, 'days'); };
      }
      var diff = moment.duration(end.diff(start));
      return diff.hours() + ":" + ('0' + diff.minutes()).slice(-2);
    }
}

export class ShiftPositionModel implements DbObjectModel {
    _id: string
    lastModified: Date;
    name: string;
    employee: string;
    date: Date
    start: string;
    end: string;
    static collectionName: string = 'shifts.position';
}
