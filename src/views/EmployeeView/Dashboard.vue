<template>
    <ion-page>
        <ion-router-outlet></ion-router-outlet>
        <ion-menu content-id="main-content">
            <ion-header>
                <ion-toolbar color="primary">
                    <ion-title>Menu</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content>
                <ion-list>
                    <ion-item button lines="full" @click="$router.push('/employee/schedules')">
                        <ion-label>Schedules</ion-label>
                        <ion-icon :icon="calendarClear" slot="start" color="primary"></ion-icon>
                    </ion-item>
                    <ion-item button lines="full" @click="$router.push('/employee/timesheets')">
                        <ion-label>Timesheets</ion-label>
                        <ion-icon :icon="navigate" slot="start" color="primary"></ion-icon>
                    </ion-item>
                    <ion-item button lines="full" @click="$router.push('/employee/profile')">
                        <ion-label>Profile</ion-label>
                        <ion-icon :icon="person" slot="start" color="primary"></ion-icon>
                    </ion-item>
                </ion-list>
            </ion-content>
        </ion-menu>
        <ion-header class="ion-head">
            <ion-toolbar class="ion-padding-top">
                <ion-menu-button slot="start"></ion-menu-button>
                <ion-buttons slot="end">
                    <ion-avatar @click="$router.push('/employee/profile')">
                        <img :src="user.employee_profilepicture"/>
                    </ion-avatar>
                </ion-buttons>
            </ion-toolbar>
            <ion-toolbar>
                <ion-text class="ion-padding-start ion-margin-top" color="primary">{{ user.employee_firstname }} {{ user.employee_lastname }}</ion-text>
                <p class="ion-padding-start">{{ getMonthToday }} {{ new Date().getDate() }}, {{ new Date().getFullYear() }}</p>
            </ion-toolbar>
        </ion-header>
        <ion-content fullscreen="true" id="main-content" scroll-events="true" @ionScroll="logScrolling($event)">
            <ion-refresher style="position:relative; z-index:999;" slot="fixed" @ionRefresh="handleRefresh($event)">
                <ion-refresher-content refreshing-spinner="crescent"></ion-refresher-content>
            </ion-refresher>

            <div class="stopwatch ion-margin-top">
                <p>HOURS <span>{{ hours }}</span></p>
                <p>MINUTES <span>{{ minutes }}</span></p>
                <p>SECONDS <span>{{ seconds }}</span></p>
            </div>

            <ion-list class="ion-text-center ion-margin-top time-wrap">
                <ion-item lines="none">
                    <ion-label :class="{ disable2 : disabled2 }" color="primary" @click="clockedIn">
                        <p>Time In <span v-if="clockIn == ''">--:-- --</span> <span>{{ clockIn }}</span> </p>
                    </ion-label>
                    <ion-label :class="{ disable : disabled }" @click="presentActionSheet();">
                        <p>Time Out <span v-if="clockOut == ''">--:-- --</span> <span>{{ clockOut }}</span></p>
                    </ion-label>
                </ion-item>
            </ion-list>

            <ion-segment :value="segmentMode" class="segment-class" color="primary">
                <ion-segment-button @click="segmentMode='todays-schedule'" value="todays-schedule">
                    <ion-label>Today's Schedule</ion-label>
                </ion-segment-button>
                <ion-segment-button @click="segmentMode='upcoming-schedule'" value="upcoming-schedule">
                    <ion-label>Upcoming Schedule</ion-label>
                </ion-segment-button>
            </ion-segment>

            <div v-if="segmentMode == 'todays-schedule'">
                <p class="noData" v-if="nextSched.id == null">No Today's Schedule...</p>
                <ion-list class="ion-margin-top ion-margin-bottom" v-if="nextSched.id != null">
                    <ion-item lines="full">
                        <ion-label color="primary">{{nextSched.title}}<small>{{(this.clockIn != null && this.clockIn != '') ? 'Ongoing' : 'Next'}} Schedule</small></ion-label>
                        <ion-icon color="primary" :icon="reader" slot="end"></ion-icon>
                    </ion-item>
                    <ion-item lines="none">
                        <ion-label>
                            <p>Date: <span>{{dateFormat('%sm %d, %y',nextSched.shift_date)}}</span></p>
                        </ion-label>
                        <ion-label>
                            <p>Time Shift: <span>{{dateFormat('%h:%i%a',nextSched.shift_date+' '+nextSched.shift_start)}} - {{dateFormat('%h:%i%a',nextSched.shift_date+' '+nextSched.shift_end)}}</span></p>
                        </ion-label>
                    </ion-item>
                    <ion-item lines="none">
                        <ion-label>
                            <p>Location: <span><strong>({{nextSched.name}} Branch)</strong> {{nextSched.location}}</span></p>
                        </ion-label>
                    </ion-item>
                    <ion-item lines="none">
                        <ion-label slot="end" class="approved">
                            <ion-icon :icon="checkmarkCircle"></ion-icon> Schedule
                        </ion-label>
                    </ion-item>
                </ion-list>
            </div>

            <div v-if="segmentMode == 'upcoming-schedule'">
                <p class="noData" v-if="upcoming == ''">No Upcoming Schedule...</p>
                <ion-list>
                    <ion-item v-for="upSchedule in upcoming" :key="upSchedule.user_id">
                        <ion-label>
                            <h1>{{ upSchedule.title }}</h1>
                            <p><strong>Location:</strong> {{ upSchedule.name }}</p>
                            <p><strong>Date:</strong> {{ dateFormat('%sm %d, %y',upSchedule.shift_date)}}</p>
                            <p><strong>Time:</strong> {{ dateFormat('%h:%i%a',upSchedule.shift_date+' '+upSchedule.shift_start) }} - {{ dateFormat('%h:%i%a',upSchedule.shift_date+' '+upSchedule.shift_end) }}</p>
                        </ion-label>
                    </ion-item>
                </ion-list>
            </div>

            <div style="clear:both; overflow:hidden;"></div>

            <ion-grid class="title">
                <ion-row class="ion-text-center">
                    <ion-col class="categories">Quick Links</ion-col>
                </ion-row>
            </ion-grid>

            <ion-grid>
                <ion-row>
                    <ion-col size="4">
                        <ion-card @click="$router.push('/employee/schedules')" button="true">
                            <img class="ion-padding" src="@/images/customer_service1.svg"/>
                            <ion-card-header>
                                <ion-card-title>Schedules</ion-card-title>
                            </ion-card-header>
                        </ion-card>
                    </ion-col>
                    <ion-col size="4">
                        <ion-card @click="$router.push('/employee/timesheets')" button="true">
                            <img class="ion-padding" src="@/images/customer_service2.svg"/>
                            <ion-card-header>
                                <ion-card-title>Timesheets</ion-card-title>
                            </ion-card-header>
                        </ion-card>
                    </ion-col>
                    <ion-col size="4">
                        <ion-card @click="$router.push('/employee/profile')" button="true">
                            <img class="ion-padding" src="@/images/customer_service3.svg"/>
                            <ion-card-header>
                                <ion-card-title>Profile</ion-card-title>
                            </ion-card-header>
                        </ion-card>
                    </ion-col>
                </ion-row>
            </ion-grid>
            
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonHeader, IonToolbar, IonCard, IonCardHeader, IonCardTitle, menuController, actionSheetController, IonButtons, IonMenu, IonMenuButton, IonSegment, IonSegmentButton, IonRefresher, IonRefresherContent, IonIcon, IonRouterOutlet, IonTitle, IonLabel, IonItem, IonList, IonAvatar, IonCol, IonRow, IonGrid, IonText } from '@ionic/vue';
import { apps, map, chatbox, settings, ticket, helpCircle, logOut, alertCircle, warning, menu, reader, checkmarkCircle, location, time, calendar, calendarClear, navigate, person } from 'ionicons/icons';
import { lStore, axios, formatDateString,dateFormat, openToast } from '@/functions';
// import { Geolocation } from '@capacitor/geolocation';

export default defineComponent({
    name: 'DashboardView',
    components: { IonContent, IonPage, IonHeader, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonButtons, IonMenu, IonMenuButton, IonSegment, IonSegmentButton, IonRefresher, IonRefresherContent, IonIcon, IonRouterOutlet, IonTitle, IonLabel, IonItem, IonList, IonAvatar, IonCol, IonRow, IonGrid, IonText },
    setup() {
        const logScrolling = (e) => {
            if (e.detail.scrollTop >= 20) {
                document.querySelector('.ion-head').classList.add('ion-head-style');
            } else {
                document.querySelector('.ion-head').classList.remove('ion-head-style');
            }
        }
        return { apps, map, chatbox, settings, ticket, helpCircle, logOut, alertCircle, menu, warning, logScrolling, reader, checkmarkCircle, location, time, calendar, calendarClear, navigate, person, IonRefresher, IonRefresherContent };
    },
    data() {
        return{
            message: null,
            clockIn: '',
            clockOut: '',
            disabled: true,
            disabled2: false,
            facility: '',
            user: {},
            clockTimer: 1,
            startTimer: false,
            timeData: '',
            hours: '',
            minutes: '',
            seconds: '',
            todaySchedule: true,
            upcomingSchedule: false,
            upcoming: [{}],
            nextSched:{},
            geotest:{long:0,lat:0},
            timesheets:[],
            segmentMode: 'todays-schedule'
        }
    },
    created() {
        this.clear();
        this.user = lStore.get('user_info');
    },
    mounted() {
        const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        let day = days[new Date().getDay()].toUpperCase();
        this.getDayToday = day;

        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        
        let month = months[new Date().getMonth()].toUpperCase();
        this.getMonthToday = month;

        let getDataTime = () => {
            let today = new Date();

            this.hours = ("00" + today.getHours()).slice(-2);
            if(this.hours > 12 || this.hours < 1) this.hours = today.getHours() % 12 || 12;
            this.minutes = ("00" + today.getMinutes()).slice(-2); 
            this.seconds = ("00" + today.getSeconds()).slice(-2);
        }

        setInterval(() => {
            getDataTime();
        }, 1000);

        this.fetchScheds();
    },
    watch:{
        $route(to){
            if(to.path == '/employee/dashboard'){
                this.fetchScheds();
            }
        }
    },
    methods: {
        dateFormat,
        handleRefresh(event){
            this.fetchScheds();
            setTimeout(() => {
                event.target.complete();
            }, 2000);
        },
        clear(){
            this.message = null;
            this.clockIn = '';
            this.clockOut = '';
            this.disabled = true;
            this.disabled2 = false;
            this.facility= '';
            this.user= {};
            this.clockTimer= 1;
            this.startTimer= false;
            this.timeData= '';
            this.hours= '';
            this.minutes= '';
            this.seconds= '';
            this.todays= false;
            this.upcomings= true;
            this.upcoming= [];
            this.nextSched={};
        },
        async clockedIn(){

            if(this.nextSched.id == null) {
                openToast('Schedule today is empty...', 'danger');
                return;
            }

            if(this.disabled2) return;
            // const coordinates = await Geolocation.getCurrentPosition({enableHighAccuracy:true});

            this.clockIn = new Date().toLocaleTimeString();
            this.disabled = false;
            this.disabled2 = true;
            // axios.post('timerecord/create',null,{
            //     schedule_id: this.nextSched.id,
            //     user_id: lStore.get('user_id'),
            //     location: await this.mapFind(coordinates.coords.longitude,coordinates.coords.latitude),
            //     location_lat:coordinates.coords.latitude,
            //     location_long:coordinates.coords.longitude,
            // }).then(res=>{
            //     lStore.set('timerecord_timein',res.data.result);
            // })
        },
        openMenu() {
            menuController.open('app-menu');
        },
        async mapFind(long,lat){
            let accessToken = "pk.eyJ1Ijoic3BlZWR5cmVwYWlyIiwiYSI6ImNsNWg4cGlzaDA3NTYzZHFxdm1iMTJ2cWQifQ.j_XBhRHLg-CcGzah7uepMA";
            let returnVal = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${accessToken}`)
            return returnVal.data.features[0].place_name;
        },
        closeMenu() {
            menuController.close('app-menu');
        },
        async presentActionSheet(){
            // const coordinates = await Geolocation.getCurrentPosition();
            const actionSheet = await actionSheetController.create({
                header: 'Are you sure you want to Clock Out?',
                buttons: [
                {
                    text: 'Yes',
                    role: 'destructive',
                    data: {
                        action: 'confirm',
                    },
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    data: {
                        action: 'cancel',
                    },
                },
                ],
            });

            await actionSheet.present();
            const result = await actionSheet.onDidDismiss();
            if(result.data.action == 'confirm') {

                this.clockOut = new Date().toLocaleTimeString();
                this.disabled = true;
                // axios.post('timerecord/update?id='+lStore.get('timerecord_timein').id,null,{
                //     time_out:"",
                //     location_out: await this.mapFind(coordinates.coords.longitude,coordinates.coords.latitude),
                //     location_out_lat:coordinates.coords.latitude,
                //     location_out_long:coordinates.coords.longitude,
                // }).then(()=>{
                //     localStorage.removeItem('timerecord_timein');
                //     localStorage.removeItem('timerecord_timeout');

                //     window.location.reload();

                // })
            }
        },
        async fetchScheds(){
            let currentDate = new Date();
            let currentDateString = currentDate.toLocaleDateString().split('/');
            currentDateString = formatDateString(currentDateString[2] + '-' + currentDateString[0] + '-' + currentDateString[1]).replaceAll(' ','');

            let weekDate = new Date();
            weekDate.setDate(weekDate.getDate()+7);
            weekDate = weekDate.toLocaleDateString();
            let weekDateArr = weekDate.split('/');
            let weekDateString = formatDateString(weekDateArr[2]+'-'+weekDateArr[0]+'-'+weekDateArr[1]).replaceAll(' ','');

            let resp = await axios.post(`assigned/joint?_GTE_schedules_dates=${currentDateString}&_LSE_schedules_dates=${weekDateString}&_batch=true&assigned_assigndesignation:assigndesignation_employeeid=${lStore.get('user_id')}`);
            console.log(resp.data.result);
            if(resp.data == null || !resp.data.success) return;
            let updatedAssignedResults = [];
            let unfinishedTimerecords = [];
            let timerecordIds = {};
            if(resp.data != null && resp.data.success) {
                resp.data.result.forEach(el=>{
                    timerecordIds[el.assignschedules_id] = el;
                    lStore.set('timerecord_timein',el);
                });
                for(let t in timerecordIds)
                if(resp.data.result.filter(el=>el.id==t).length == 0)
                    if(timerecordIds[t].assignschedules_timeout == null)
                        unfinishedTimerecords.push(t);
            }

            resp.data.result.forEach(el=>{
                let elementDateTime = new Date(el.shift_date+' '+el.shift_end);
                let elementDateTime2 = new Date(el.shift_date+' '+el.shift_start);
                if(elementDateTime2.getTime() > elementDateTime.getTime())
                    elementDateTime =  new Date(el.shift_date+' '+el.shift_end).getTime() + 86400000;
                else 
                    elementDateTime =  new Date(el.shift_date+' '+el.shift_end).getTime();
                let currentDateTime = currentDate.getTime();

                if(elementDateTime > currentDateTime){
                    
                    if(timerecordIds[el.id] != null){
                        if(timerecordIds[el.id].time_out == null) updatedAssignedResults.push(el);
                    }else{
                        updatedAssignedResults.push(el);
                    }
                }
            });

            // let finishedPendingTimerecord = false;
            // unfinishedTimerecords.forEach(async (el)=>{
            //     let resp3 = await axios.post(`schedule?_select=
            //     mobile_schedule.id,
            //     title,
            //     description,
            //     max_employees,
            //     shift_start,
            //     shift_end,
            //     shift_date,
            //     status,
            //     branch_id,
            //     color,
            //     mobile_branches.location,
            //     mobile_branches.name&id=${el}&_joins=mobile_branches&_on=mobile_schedule.branch_id=mobile_branches.id`);
            //     if(resp3.data == null || !resp3.data.success) return;
            //     updatedAssignedResults = [resp3.data.result,...updatedAssignedResults];
            //     if(new Date(updatedAssignedResults[0].shift_date) <= new Date(currentDateString) && (this.nextSched == null || !finishedPendingTimerecord)) this.nextSched = updatedAssignedResults[0];
            //     finishedPendingTimerecord = true;
            //     this.upcoming = updatedAssignedResults;
            //     this.clockIn = new Date(timerecordIds[el].time_in).toLocaleTimeString();
                
            // });

            if(updatedAssignedResults.length > 0) 
                if(new Date(updatedAssignedResults[0].shift_date) <= new Date(currentDateString)) this.nextSched = updatedAssignedResults[0];
            this.upcoming = updatedAssignedResults;
        }
    }
});
</script>

<style scoped>

.item.sc-ion-label-ios-h, .item .sc-ion-label-ios-h{white-space: unset;}

.noData{text-align: center; color: #959595; font-weight: bold;}

.disabled2,.disabled{pointer-events: none;}
.today {display: none;}
.upcoming {display: none;}

ion-menu ion-content {
    background: #fff;
    --background: #fff;
    --padding-top: 20px;
    --padding-bottom: 60px;
    --padding-start: 0;
    --padding-end: 0;
    --inner-padding-start: 0;
    --inner-padding-end: 0;
}

ion-label h1{color: #555;margin-bottom: 9px; border-left: 12px groove #1f94db; padding-left: 6px; text-transform: capitalize;font-size: 18px !important;}

ion-item p strong{color: #999;}

.ion-head-style {
    background: linear-gradient(to top, #fff, #6cbcf0);
    padding-bottom: 10px;
}

ion-menu ion-list {
    padding: 0;
}

ion-menu ion-content ion-item ion-label {
    margin: 0;
}

ion-menu ion-content ion-item ion-button {
    width: 100%;
    margin: auto;
}

ion-avatar img {
    padding: 3px;
    border: 3px solid #1f94db;
}

ion-header {
    z-index: 999;
}

ion-header {
    box-shadow: none;
}

ion-header::after {
    display: none;
}

ion-card {
    margin: 24px auto;
}

ion-card img {
    display: table;
    width: 100%;
    max-width: 200px;
    height: 100%;
    object-fit: contain;
    margin: auto;
    padding: 3px;
}

ion-card-title {
    font-size: 15px;
    margin: 6px auto 4px;
    color: #1f94db;
}

/* ion-card-subtitle {
    color: #999;
    font-weight: bold;
} */

ion-text {
    font-size: 30px;
    display: block;
}

ion-text p {
    font-size: 18px;
}

ion-card-header {
    padding: 0 4px 4px;
    text-align: center;
}

.main-header {
    position: relative;
    z-index: 2;
}

.sub-header {
    position: relative;
    top: 0;
    --padding-top: 0;
    transition: top ease-in-out 500ms;
    z-index: 1;
    border-radius: 0 0 30px 30px;
}

.sub-header ion-card {
    margin: 0 auto 8px; 
    padding: 15px 0;
    border-radius: 25px;
}

.sub-header.hidden {
    top: -200px;
}

ion-header {
    box-shadow: none;
}

ion-header::after {
    display: none;
}

ion-text h3 {
    font-size: 18px;
    margin: 0;
}

ion-card {
    margin: 0 auto;
}

ion-card img {
    display: table;
    width: 100%;
    max-width: 200px;
    height: 100%;
    object-fit: contain;
    margin: auto;
}

/* ion-card-subtitle {
    color: #1f94db;
    font-weight: bold;
} */

.time-wrap {
    border-radius: 30px;
}

.time-wrap ion-item ion-label:first-child {
    background: #1f94db;
    border-radius: 30px 0 0 30px;
    color: #fff;
}

.time-wrap ion-item ion-label:last-child {
    color: #1f94db;
    background: #eaeaea;
    border-radius: 0 30px 30px 0;
}

.time-wrap ion-item ion-label {
    cursor: pointer;
    height: 100%;
    margin: 0;
}
.time-wrap ion-item ion-label p {
    margin: 4px 0;
    text-align: center;
    font-size: 17px;
}

.time-wrap ion-item ion-label:first-child p {
    margin: 4px 0;
    color: #fff;
}

.time-wrap ion-item ion-label p span {
    display: block;
    color: #000;
    font-size: 16px;
}

.time-wrap ion-item {
    --padding-start: 0;
    --padding-end: 0;
}

.time-wrap ion-item .item-inner {
    --padding-end: 0;
}

ion-item p {
	color: #1f94db;
    font-weight: bold;
}

ion-item p span {
    display: block;
    color: #999999;
    margin-top: 2px;
    font-weight: normal;
}

ion-list {
    border-radius: 12px;
}

.approved {
    font-size: 13px;
    font-weight: bold;
    color: #999;
}

.approved ion-icon {
    position: relative;
    top: 2px;
    left: 1px;
}

.categories {
    font-weight: bold;
    color: #1f94db;
    font-size: 20px;
}

ion-toolbar {
    background: none;
    color: #000;
}

ion-toolbar p {
    margin: 4px 0 0;
    font-size: 12px;
    color: #888;
}

ion-title {
    color: #fff;
}

.stopwatch {
    position: relative;
    text-align: center;
    display: flex;
    justify-content: center;
}

.stopwatch span {
    position: relative;
    padding: 8px 15px;
    font-size: 35px;
    background: #555;
    margin: 4px 10px;
    color: #fff;
    border-radius: 6px;
    display: block;
}

.stopwatch span::after {
    background: #555;
    width: 6px;
    height: 6px;
    position: absolute;
    content: '';
    border-radius: 50%;
    bottom: 20px;
    right: -13px;
}

.stopwatch p:last-child span::after {
    display: none;
}

.stopwatch span::before {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 50%;
    bottom: 50%;
    content: "";
    background: #232323;
    opacity: .4;
    height: 2px;
}

.stopwatch p {
    font-size: 11px;
    color: #605f5f;
    font-weight: bold;
}

ion-title {
    color: #fff;
}

ion-menu ion-item {
    padding-bottom: 12px;
}

.title {
    margin-top: 45px;
}

.segment-class {
    margin-top: 25px;
    margin-bottom: 20px;
}


ion-label small{display: inline-block;margin-left:10px;padding-left: 10px;position: relative;}
ion-label small::before{position: absolute;content: "";background: #1f94db;display: block;left: 0px;width: 1px;height: 12px;top: 1px;}


</style>