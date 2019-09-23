'use strict';
/*!
 * dateFormat.js v1.0.0
 * 日期格式化工具类
 *
 * Author: liaoxm
 * Date: 2016-06-16
 *
 */
const YMD_FORMAT = 'yyyy-MM-dd';
const ISO8601_FORMAT = 'yyyy-MM-dd hh:mm:ss.SSS';
const ISO8601_WITH_TZ_OFFSET_FORMAT = 'yyyy-MM-ddThh:mm:ssO';
const DATETIME_FORMAT = 'dd MM yyyy hh:mm:ss.SSS';
const ABSOLUTETIME_FORMAT = 'hh:mm:ss.SSS';

/**
 * 补0
 * @private
 */
function padWithZeros(vNumber, width) {
    var numAsString = vNumber + '';
    while (numAsString.length < width) {
        numAsString = '0' + numAsString;
    }
    return numAsString;
}
/**
 * 补0
 * @private
 */
function addZero(vNumber) {
    return padWithZeros(vNumber, 2);
}

/**
 * 时区
 * @private
 */
function offset(timezoneOffset) {
    // Difference to Greenwich time (GMT) in hours
    var os = Math.abs(timezoneOffset);
    var h = String(Math.floor(os / 60));
    var m = String(os % 60);
    if (h.length === 1) {
        h = '0' + h;
    }
    if (m.length === 1) {
        m = '0' + m;
    }
    return timezoneOffset < 0 ? '+' + h + m : '-' + h + m;
}
/**
 * 时间格式化
 * @param {Date|String|timestamp}  date 需要格式化的对象
 * @public
 */
const dateFormat = function(date, format, timezoneOffset) {
    if (typeof (date) === 'string' || typeof (date) === 'number') {
        date = new Date(arguments[0]);
        format = arguments[1];
        timezoneOffset = arguments[2];
    }
    if (format === undefined) {
        format = ISO8601_FORMAT;
    }
    if (timezoneOffset === undefined) {
        timezoneOffset = date.getTimezoneOffset();
    }
    date.setUTCMinutes(date.getUTCMinutes() - timezoneOffset);
    var vDay = addZero(date.getUTCDate());
    var vMonth = addZero(date.getUTCMonth() + 1);
    var vYearLong = addZero(date.getUTCFullYear());
    var vYearShort = addZero(date.getUTCFullYear().toString().substring(2, 4));
    var vYear = (format.indexOf('yyyy') > -1 ? vYearLong : vYearShort);
    var vHour = addZero(date.getUTCHours());
    var vMinute = addZero(date.getUTCMinutes());
    var vSecond = addZero(date.getUTCSeconds());
    var vMillisecond = padWithZeros(date.getUTCMilliseconds(), 3);
    var vTimeZone = offset(timezoneOffset);
    date.setUTCMinutes(date.getUTCMinutes() + timezoneOffset);
    var formatted = format
        .replace(/dd/g, vDay)
        .replace(/MM/g, vMonth)
        .replace(/y{1,4}/g, vYear)
        .replace(/hh/g, vHour)
        .replace(/HH/g, vHour)
        .replace(/mm/g, vMinute)
        .replace(/ss/g, vSecond)
        .replace(/SSS/g, vMillisecond)
        .replace(/O/g, vTimeZone);
    return formatted;
};
/**
 * 时间计算，暂时只支持天
 * @param {Date|Number}  date 需要格式化的对象
 * @public
 */
const dateAdd = function(date, dadd) {
    if (typeof (date) === 'string' || typeof (date) === 'number') {
        date = new Date(arguments[0]);
    }
    date = date || new Date();
    date = date.valueOf()
    date = date + dadd * 24 * 60 * 60 * 1000
    return new Date(date)
};
/**
 * 格式化时间与当前时间差
 * @param {String} item 一个由逗号连接的包含一个或多个CSS选择器的字符串
 * @return {NodeList} 一个non-live的 NodeList 类型的对象
 * @public
 */
const diffTime = item => {
    var nowTime = new Date().getTime();
    var secondTime = 1000;
    var minuteTime = 60 * 1000;
    var hourTime = 60 * minuteTime;
    var dayTime = 24 * hourTime;
    var monthTime = dayTime * 30;
    var yearTime = monthTime * 12;

    var publishTime = new Date(item).getTime();
    var historyTime = parseInt(nowTime) - parseInt(publishTime);
    var descTime;
    if (historyTime >= yearTime) {
        // 按年算
        descTime = parseInt(historyTime / yearTime) + '年前';
    } else if (historyTime < yearTime && historyTime >= monthTime) {
        // 按月算
        descTime = parseInt(historyTime / monthTime) + '月前';
    } else if (historyTime < monthTime && historyTime >= dayTime) {
        // 按天算
        descTime = parseInt(historyTime / dayTime) + '天前';
    } else if (historyTime < dayTime && historyTime >= hourTime) {
        // 按小时算
        descTime = parseInt(historyTime / hourTime) + '小时前';
    } else if (historyTime < hourTime && historyTime >= minuteTime) {
        // 按分钟算
        descTime = parseInt(historyTime / minuteTime) + '分钟前';
    } else {
        descTime = parseInt(historyTime / secondTime) + '秒前'; ;
    }
    return descTime;
};

export default {
    dateAdd,
    diffTime,
    dateFormat,
    YMD_FORMAT,
    ISO8601_FORMAT,
    ISO8601_WITH_TZ_OFFSET_FORMAT,
    DATETIME_FORMAT,
    ABSOLUTETIME_FORMAT
};
