import {current_game_time} from './game_time.js';
export function can_work(selected_activity) {
    //if can start at all
    if(!selected_activity.infinite) {
        if(selected_activity.availability_time){
            if(selected_activity.availability_time.end > selected_activity.availability_time.start) {
                //ends on the same day
                if(current_game_time.hour * 60 + current_game_time.minute > selected_activity.availability_time.end*60
                    ||  //too late
                    current_game_time.hour * 60 + current_game_time.minute < selected_activity.availability_time.start*60
                    ) {  //too early
                    
                    return false;
                }
                if(!selected_activity.availability_seasons?.includes(current_game_time.getSeason())) {
                    //can't be done in current season
                    return false;
                }  
            } else { //ends on the next day (i.e. working through the night)
                if(!selected_activity.availability_seasons?.includes(current_game_time.getSeason(1))) {
                    //ends on new season during which it's not available
                    return false;
                }  

                if(current_game_time.hour * 60 + current_game_time.minute > selected_activity.availability_time.start*60
                    //too late
                    ||
                    current_game_time.hour * 60 + current_game_time.minute < selected_activity.availability_time.end*60
                    //too early

                ) {  
                    return false;
                }
            }
        } else {
            if(!selected_activity.availability_seasons?.includes(current_game_time.getSeason())) {
                //can't be done in current season
                return false;
            }  
        }
    }

    return true;
}

/**
 * 
 * @param {} selected_job location job property
 * @returns if there's enough time to earn anything
 */
export function enough_time_for_earnings(selected_job) {

    if(!selected_job.infinite) {
        //if enough time for at least 1 working period
        if(selected_job.availability_time.end > selected_job.availability_time.start) {
            //ends on the same day
            if(current_game_time.hour * 60 + current_game_time.minute + selected_job.gathering_time_needed - selected_job.gathering_time%selected_job.gathering_time_needed > selected_job.availability_time.end*60
                ||  //not enough time left for another work period
                current_game_time.hour * 60 + current_game_time.minute < selected_job.availability_time.start*60
                ) {  //too early to start (shouldn't be allowed to start and get here at all)
                return false;
            }
        } else {
            //ends on the next day (i.e. working through the night)
  
            if(!selected_job.availability_time.includes(current_game_time.getSeason(1))) {
                //ends on new season during which it's not available
                return false;
            } 

            if(current_game_time.hour * 60 + current_game_time.minute > selected_job.availability_time.start*60
                //timer is past the starting hour, so it's the same day as job starts
                && 
                current_game_time.hour * 60 + current_game_time.minute + selected_job.working_period  - selected_job.gathering_time%selected_job.gathering_time_needed > selected_job.availability_time.end*60 + 24*60
                //time available on this day + time available on next day are less than time needed
                ||
                current_game_time.hour * 60 + current_game_time.minute < selected_job.availability_time.start*60
                //timer is less than the starting hour, so it's the next day
                &&
                current_game_time.hour * 60 + current_game_time.minute + selected_job.working_period  - selected_job.gathering_time%selected_job.gathering_time_needed > selected_job.availability_time.end*60
                //time left on this day is not enough to finish
                ) {  
                return false;
            }
        }
    }

    return true;
}
