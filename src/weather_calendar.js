// Shared native 13-day rain calendar. Pure so simulated intervals can query
// historical weather without mutating the live calendar or inventing a timer.
export const rainCycle=Object.freeze({0:0,1:0,2:0,3:0,4:-1,5:-2,6:-2,7:-2,8:0,9:0,10:0,11:-1,12:0});
export const isRainingOnDay=day=>rainCycle[((Math.floor(day)%13)+13)%13]<0;
export const isRainingAtMinute=minute=>isRainingOnDay(Math.floor(minute/1440));

// Native weather uses elapsed day_count; service calendars use year/month/day.
export const weatherClockMinute=t=>t.day_count*1440+t.hour*60+t.minute;

// Map a root-clock interval onto the native played calendar. `until` is an
// exclusive root-clock boundary; callers need not guess where midnight falls.
// Optional E1 weather and P23 gusts are separate sources, not inputs here.
export function nativeRainAtClock(calendar,calendarClock,clock) {
    if(!calendar)return {raining:false,source:'unavailable',until:Infinity};
    const minute=weatherClockMinute(calendar)+clock-calendarClock;
    if(!Number.isFinite(minute))return {raining:false,source:'unavailable',until:Infinity};
    return {raining:isRainingAtMinute(minute),source:'native-rain-calendar',until:clock+(Math.floor(minute/1440)+1)*1440-minute};
}
