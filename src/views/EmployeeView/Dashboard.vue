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
                        <img :src="user.profile_img"/>
                    </ion-avatar>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content fullscreen="true" id="main-content" scroll-events="true" @ionScroll="logScrolling($event)">

            <ion-refresher style="position:relative; z-index:999;" slot="fixed" @ionRefresh="handleRefresh($event)">
                <ion-refresher-content refreshing-spinner="crescent"></ion-refresher-content>
            </ion-refresher>

            <div class="hdr_txt">
                <ion-text class="ion-padding-start ion-margin-top" color="primary">{{ user.firstname }} {{ user.lastname }}</ion-text>
                <p class="ion-padding-start">{{ getMonthToday }} {{ new Date().getDate() }}, {{ new Date().getFullYear() }}</p>
            </div>

            <div id="stopwatch" class="stopwatch ion-margin-top">
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

            <ion-segment class="segment-class" color="primary" @ionChange="scheduleData($event)">
                <ion-segment-button value="todays-schedule">
                    <ion-label>Today's Schedule</ion-label>
                </ion-segment-button>
                <ion-segment-button value="upcoming-schedule">
                    <ion-label>Upcoming Schedule</ion-label>
                </ion-segment-button>
            </ion-segment>
            
            <ion-list class="ion-margin-top ion-margin-bottom" :class="{ today: todays }" v-if="nextSched.id != null">
                <ion-item lines="full">
                    <ion-label color="primary">{{nextSched.title}}<small>{{(this.clockIn != null && this.clockIn != '') ? 'Ongoing' : 'Next'}} Schedule</small></ion-label>
                    <ion-icon color="primary" :icon="reader" slot="end"></ion-icon>
                </ion-item>
                <ion-item lines="none">
                    <ion-label>
                        <p>Date: <span v-if="nextSched.shift_date == ''">-----</span> <span>{{dateFormat('%sm %d',nextSched.shift_date)}} - {{dateFormat('%sm %d',nextSched.shift_date_end)}}</span></p>
                    </ion-label>
                    <ion-label>
                        <p>Time Shift: <span v-if="nextSched.shift_start == '' && nextSched.shift_end == ''">-----</span> <span>{{dateFormat('%h:%i%a',nextSched.shift_date+' '+nextSched.shift_start)}} - {{dateFormat('%h:%i%a',nextSched.shift_date+' '+nextSched.shift_end)}}</span></p>
                    </ion-label>
                </ion-item>
                <ion-item lines="none">
                    <ion-label>
                        <p>Location: <span v-if="nextSched.name == ''">-----</span> <span><strong>({{nextSched.name}} Branch)</strong> {{nextSched.location}}</span></p>
                    </ion-label>
                </ion-item>
                <ion-item lines="none">
                    <ion-label slot="end" class="approved">
                        <ion-icon :icon="checkmarkCircle"></ion-icon> Schedule
                    </ion-label>
                </ion-item>
            </ion-list>

            <ion-list :class="{ upcoming: upcomings }">
                <ion-item v-for="upSchedule in upcoming" :key="upSchedule.user_id">
                    <ion-label>
                        <h1>{{ upSchedule.title }}</h1>
                        <p>{{ upSchedule.name }}</p>
                        <p>{{ dateFormat('%sm %d',upSchedule.shift_date)}} - {{ dateFormat('%sm %d',upSchedule.shift_date_end)}}</p>
                        <p>{{ dateFormat('%h:%i%a',upSchedule.shift_date+' '+upSchedule.shift_start) }} - {{ dateFormat('%h:%i%a',upSchedule.shift_date+' '+upSchedule.shift_end) }}</p>
                        <p></p>
                    </ion-label>
                </ion-item>
            </ion-list>

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
import { IonContent, IonPage, IonHeader, IonToolbar, IonCard, IonCardHeader, IonCardTitle, menuController, actionSheetController, IonButtons, IonMenu, IonMenuButton, IonSegment, IonSegmentButton, IonRefresher, IonRefresherContent } from '@ionic/vue';
import { apps, map, chatbox, settings, ticket, helpCircle, logOut, alertCircle, warning, menu, reader, checkmarkCircle, location, time, calendar, calendarClear, navigate, person } from 'ionicons/icons';
import { lStore, axios, formatDateString,dateFormat, openToast } from '@/functions';
import { Geolocation } from '@capacitor/geolocation';

export default defineComponent({
    name: 'DashboardView',
    components: { IonContent, IonPage, IonHeader, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonButtons, IonMenu, IonMenuButton, IonSegment, IonSegmentButton, IonRefresher, IonRefresherContent },
    setup() {
        const logScrolling = (e) => {
            if (e.detail.scrollTop >= 20) {
                document.querySelector('.ion-head').classList.add('ion-head-style');
            } else {
                document.querySelector('.ion-head').classList.remove('ion-head-style');
            }
        }

        const handleRefresh = (event) => {
            setTimeout(() => {
                window.history.go;
                event.target.complete();
            }, 2000);
        };

        return { handleRefresh, apps, map, chatbox, settings, ticket, helpCircle, logOut, alertCircle, menu, warning, logScrolling, reader, checkmarkCircle, location, time, calendar, calendarClear, navigate, person };
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
            todays: false,
            upcomings: true,
            upcoming: [{}],
            nextSched:{},
            geotest:{long:0,lat:0},
            timesheets:[]
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
            if(this.hours > 12) this.hours = today.getHours() % 12 || 12;
            this.minutes = ("00" + today.getMinutes()).slice(-2); 
            this.seconds = ("00" + today.getSeconds()).slice(-2);
        }

        setInterval(getDataTime, 1000);
        
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
            this.upcoming= [{}];
            this.nextSched={};
        },
        scheduleData(e) {
            if(e.detail.value == 'todays-schedule') {
                this.todays = false;
                this.upcomings = true;
            }

            if(e.detail.value == 'upcoming-schedule') {
                this.todays = true;
                this.upcomings = false;
            }
        },
        async clockedIn(){

            if(this.nextSched.id == null) {
                openToast('Schedule today is empty...', 'danger');
                return;
            }

            if(this.disabled2) return;
            const coordinates = await Geolocation.getCurrentPosition({enableHighAccuracy:true});

            // let dist = calcFlyDist([
            //     coordinates.coords.longitude,
            //     coordinates.coords.latitude
            // ],[
            //     this.nextSched.location_long,
            //     this.nextSched.location_lat
            // ]);

            // if(dist > 0.2) {
            //         openToast('You must be at least 200 meters closer to the location to time out!','warning');
            //         console.log(dist);
            //         return;
            //     }
        

            this.clockIn = new Date().toLocaleTimeString();
            this.disabled = false;
            this.disabled2 = true;
            axios.post('timerecord/create',null,{
                schedule_id: this.nextSched.id,
                user_id: lStore.get('user_id'),
                location: await this.mapFind(coordinates.coords.longitude,coordinates.coords.latitude),
                location_lat:coordinates.coords.latitude,
                location_long:coordinates.coords.longitude,
            }).then(res=>{
                console.log(res.data);
                lStore.set('timerecord_timein',res.data.result);
            })
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
            const coordinates = await Geolocation.getCurrentPosition();
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
                // let dist = calcFlyDist([
                //     coordinates.coords.longitude,
                //     coordinates.coords.latitude
                // ],[
                //     this.nextSched.location_long,
                //     this.nextSched.location_lat
                // ]);

                // if(dist > 0.2) {
                //     openToast('You must be at least 200 meters closer to the location to time out!','warning');
                //     console.log(dist);
                //     return;
                // }

                this.clockOut = new Date().toLocaleTimeString();
                this.disabled = true;
                axios.post('timerecord/update?id='+lStore.get('timerecord_timein').id,null,{
                    time_out:"",
                    location_out: await this.mapFind(coordinates.coords.longitude,coordinates.coords.latitude),
                    location_out_lat:coordinates.coords.latitude,
                    location_out_long:coordinates.coords.longitude,
                }).then(()=>{
                    localStorage.removeItem('timerecord_timein');
                    localStorage.removeItem('timerecord_timeout');

                    window.location.reload();

                })
            }
        },
        fetchScheds(){
            let currentDate = new Date();
            let currentDateString = currentDate.toLocaleDateString().split('/');
            currentDateString = formatDateString(currentDateString[2] + '-' + currentDateString[0] + '-' + currentDateString[1]).replaceAll(' ','');

            let tommDate = new Date();
            tommDate.setDate(tommDate.getDate()+1);
            tommDate = tommDate.toLocaleDateString();
            let tommDateArr = tommDate.split('/');
            tommDate = formatDateString(tommDateArr[2]+'-'+tommDateArr[0]+'-'+tommDateArr[1]).replaceAll(' ','');

            let checkResponse = 0;

            axios.post(`assigned?user_id=${lStore.get('user_id')}
            &_batch=true
            &_joins=mobile_schedule,mobile_branches
            &_on=mobile_assignedusers.schedule_id=mobile_schedule.id,mobile_schedule.branch_id=mobile_branches.id
            &_LSE_mobile_schedule:shift_date=${currentDateString}
            &_GTE_mobile_schedule:shift_date_end=${currentDateString}
            &_orderby=shift__date_ASC,shift__start`).then(res=>{
                this.upcoming = res.data.result;
                checkResponse++;
            });

            axios.post(`timerecord?
            user_id=${lStore.get('user_id')}
            &_batch=true
            &_joins=mobile_schedule
            &_on=mobile_timerecord.schedule_id=mobile_schedule.id
            &_GTE_time_in=${currentDateString}
            &_LSE_time_out=${tommDate}`).then(res=>{
                this.timesheets = res.data.result;
                checkResponse++;
            });

            let resultChecker = setInterval(()=>{
                if(checkResponse == 2){
                    let timesheetsSchedIds = [];
                    let schedIndex = -1;

                    if(this.timesheets != null){
                        this.timesheets.forEach(el => timesheetsSchedIds.push(el.id));
                        for(let i = 0; i < this.upcoming.length; i++){
                            if(!timesheetsSchedIds.includes(this.upcoming[i].schedule_id) && schedIndex == -1){
                                this.nextSched = this.upcoming[i];
                                this.nextSched.id = this.upcoming[i].schedule_id;
                            }
                        }

                        let newUpcoming = [];

                        for(let i = 0; i < this.upcoming.length; i++){
                            if(!timesheetsSchedIds.includes(this.upcoming[i].schedule_id)){
                                newUpcoming.push(this.upcoming[i]);
                            }
                        }
                        this.upcoming = newUpcoming;
                    }else{
                        this.nextSched = this.upcoming[0];
                        this.nextSched.id = this.upcoming[0].schedule_id;
                    }
                    
                    

                    
                    clearInterval(resultChecker);

                }
            },100);

                localStorage.removeItem('async_timerecord_timein');
                localStorage.removeItem('async_timerecord_timeout');

                axios.post(`timerecord?user_id=${lStore.get('user_id')}&_orderby=time__in_DESC`).then(res=>{
                    if(res.data.result == null) return;
                    let obj = res.data.result;

                    if(obj.schedule_id != this.nextSched.id){
                        console.log(this.nextSched.id);
                        if(obj.time_out == null){
                            lStore.set('timerecord_timein',{
                                id:obj.id,
                                time_in:obj.time_in,
                                schedule_id:obj.schedule_id
                            })
                            
                            axios.post(`assigned?_select=mobile_schedule.id,
                            mobile_schedule.title,
                            mobile_schedule.shift_start,
                            mobile_schedule.shift_end,
                            mobile_schedule.shift_date,
                            mobile_schedule.shift_date_end,
                            mobile_branches.name,
                            mobile_branches.location&_joins=mobile_schedule,mobile_branches
                            &_on=mobile_assignedusers.schedule_id=mobile_schedule.id,mobile_schedule.branch_id=mobile_branches.id&schedule_id=${obj.schedule_id}&user_id=${lStore.get('user_id')}`).then(res=>{
                                if(res.data.result != null) {this.nextSched = res.data.result;}
                            });
                        }

                        
                    }else{

                        if(obj.time_out == null) {
                            lStore.set('timerecord_timein',{
                                id:obj.id,
                                time_in:obj.time_in,
                                schedule_id:obj.schedule_id
                            })

                        
                            lStore.set('timerecord_timeout',{
                                id:obj.id,
                                time_out:obj.time_out,
                                schedule_id:obj.schedule_id
                            })
                        }else{
                            this.nextSched = {};
                        }
                    }

                    if(lStore.get('timerecord_timein') != null){
                        this.disabled2 = true;
                        if(lStore.get('timerecord_timeout') == null) this.disabled = false;
                        this.clockIn = new Date(lStore.get('timerecord_timein').time_in).toLocaleTimeString();   
                    }
                    console.log(this.clockOut);
                    
                    if(lStore.get('timerecord_timeout') != null){
                        if(lStore.get('timerecord_timeout').time_out == null) return;
                        this.disabled = true;
                        this.clockOut = new Date(lStore.get('timerecord_timeout').time_out).toLocaleTimeString();
                    }
                });
        }
    }
});
</script>

<style scoped>

.disabled2,.disabled{pointer-events: none;}
.today {display: none;}
.upcoming {display: none;}

ion-menu ion-content {
    background: #fff;
    --background: #fff;
    --padding-top: 60px;
    --padding-bottom: 60px;
    --padding-start: 0;
    --padding-end: 0;
    --inner-padding-start: 0;
    --inner-padding-end: 0;
}

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

ion-card-subtitle {
    color: #999;
    font-weight: bold;
}

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

ion-card-subtitle {
    color: #1f94db;
    font-weight: bold;
}

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

.hdr_txt {
    margin-bottom: 35px;
    margin-top: 6px;
}

.hdr_txt p {
    margin: 10px 0 0;
    font-size: 12px;
    color: #888;
    padding: 0;
}

.hdr_txt ion-text {
    margin: 0;
    padding: 0;
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
}


ion-label small{display: inline-block;margin-left:10px;padding-left: 10px;position: relative;}
ion-label small::before{position: absolute;content: "";background: #1f94db;display: block;left: 0px;width: 1px;height: 12px;top: 1px;}


</style>