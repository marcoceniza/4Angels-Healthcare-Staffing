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
                    <ion-item button lines="full" @click="$router.push('/supervisor/schedules')">
                        <ion-label>Schedules</ion-label>
                        <ion-icon :icon="calendarClear" slot="start" color="primary"></ion-icon>
                    </ion-item>
                    <ion-item button lines="full" @click="$router.push('/supervisor/schedules')">
                        <ion-label>Employee</ion-label>
                        <ion-icon :icon="navigate" slot="start" color="primary"></ion-icon>
                    </ion-item>
                    <ion-item button lines="full" @click="$router.push('/supervisor/profile')">
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
                    <ion-avatar @click="$router.push('/supervisor/profile')">
                        <img :src="user.profile_img"/>
                    </ion-avatar>
                </ion-buttons>
            </ion-toolbar>
            <ion-toolbar>
                <ion-text class="ion-padding-start ion-margin-top" color="primary">{{ user.firstname }} {{ user.lastname }}</ion-text>
                <p class="ion-padding-start">{{ getMonthToday }} {{ new Date().getDate() }}, {{ new Date().getFullYear() }}</p>
            </ion-toolbar>
        </ion-header>
        <ion-content fullscreen="true" id="main-content" scroll-events="true" @ionScroll="logScrolling($event)">

            <div class="stopwatch ion-margin-top">
                <p>HOURS <span>{{ hours }}</span></p>
                <p>MINUTES <span>{{ minutes }}</span></p>
                <p>SECONDS <span>{{ seconds }}</span></p>
            </div>

            <ion-list class="ion-text-center ion-margin-top time-wrap ion-margin-bottom">
                <ion-item lines="none" class="ion-margin-bottom">
                    <ion-label :class="{ disable2 : disabled2 }" color="primary" @click="clockedIn">
                        <p>Time In <span v-if="clockIn == ''">--:-- --</span> <span>{{ clockIn }}</span> </p>
                    </ion-label>
                    <ion-label :class="{ disable : disabled }" @click="presentActionSheet();">
                        <p>Time Out <span v-if="clockOut == ''">--:-- --</span> <span>{{ clockOut }}</span></p>
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
                        <ion-card @click="$router.push('/supervisor/employeeschedules')" button="true">
                            <img class="ion-padding" src="@/images/customer_service1.svg"/>
                            <ion-card-header>
                                <ion-card-title>Schedules</ion-card-title>
                            </ion-card-header>
                        </ion-card>
                    </ion-col>
                    <ion-col size="4">
                        <ion-card @click="$router.push('/supervisor/employeelist')" button="true">
                            <img class="ion-padding" src="@/images/customer_service2.svg"/>
                            <ion-card-header>
                                <ion-card-title>Facilities</ion-card-title>
                            </ion-card-header>
                        </ion-card>
                    </ion-col>
                    <ion-col size="4">
                        <ion-card @click="$router.push('/supervisor/profile')" button="true">
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
import { IonContent, IonPage, IonHeader, IonToolbar, IonCard, IonCardHeader, IonCardTitle, menuController, IonText, actionSheetController, IonMenu, IonMenuButton, IonGrid, IonRow, IonCol } from '@ionic/vue';
import { lStore, axios } from '@/functions';
import { personCircle, menu, calendarClear, navigate, person, calendar } from 'ionicons/icons';

export default defineComponent({
    name: 'SupervisorDashboard',
    components: { IonContent, IonPage, IonHeader, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonText, IonMenu, IonMenuButton, IonGrid, IonRow, IonCol },
    setup() {
        const logScrolling = (e) => {
            if (e.detail.scrollTop >= 20) {
                document.querySelector('.ion-head').classList.add('ion-head-style');
            } else {
                document.querySelector('.ion-head').classList.remove('ion-head-style');
            }
        }

        return { logScrolling, personCircle, menu, calendarClear, navigate, person, calendar };
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
            getDayToday: ''
        }
    },
    created() {
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

        if(lStore.get('timerecord_timein') != null){
            this.disabled2 = true;
            if(lStore.get('timerecord_timeout') == null) this.disabled = false;
            this.clockIn = new Date(lStore.get('timerecord_timein').time_in).toLocaleTimeString();   
        }
        
        if(lStore.get('timerecord_timeout') != null){
            this.disabled = true;
            this.clockOut = new Date(lStore.get('timerecord_timeout').time_out).toLocaleTimeString();
        }

    },
    methods: {
        clockedIn(){
            if(this.disabled2) return;
            this.clockIn = new Date().toLocaleTimeString();
            this.disabled = false;
            this.disabled2 = true;
            axios.post('timerecord/create',null,{
                user_id: lStore.get('user_id'),
                location_lat:0,
                location_long:0,
            }).then(res=>{
                lStore.set('timerecord_timein',res.data.result);
            })
        },
        openMenu() {
            menuController.open('app-menu');
        },
        closeMenu() {
            menuController.close('app-menu');
        },
        async presentActionSheet(){
            if(this.disabled) return;
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
                axios.post('timerecord/update?id='+lStore.get('timerecord_timein').id,null,{
                    time_out:"",
                    location_out_lat:0,
                    location_out_long:0,
                }).then(res=>{
                    lStore.set('timerecord_timeout',res.data.result);
                })
            }
        }
    }
});
</script>

<style scoped>
.disabled2,.disabled{pointer-events: none;}

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
    margin: 0 auto;
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

ion-card-header ion-avatar {
    width: 85px;
    height: 85px;
}

.logout-icon {
    position: absolute;
    top: 35px;
    right: 12px;
    font-size: 25px;
    color: #fff;
    display: block;
}

ion-text {
    font-size: 30px;
    display: block;
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

ion-card-header {
    padding: 0 4px 4px;
    text-align: center;
}

ion-title {
    color: #fff;
}

.categories {
    font-weight: bold;
    color: #1f94db;
    font-size: 20px;
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

.time-wrap {
    margin-bottom: 30px;
}

.time-wrap ion-item ion-label:first-child {
    background: #1f94db;
    border-radius: 30px 0 0 30px;
    color: #fff;
}

ion-item p span {
    display: block;
    color: #999999;
    margin-top: 2px;
    font-weight: normal;
}

.time-wrap ion-item ion-label:last-child {
    color: #1f94db;
    background: #eaeaea;
    border-radius: 0 30px 30px 0 !important;
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
    font-weight: bold;
    color: #1f94db;
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
    border-radius: 30px;
}

.time-wrap ion-item .item-inner {
    --padding-end: 0;
}

.title {
    margin-top: 45px;
}

</style>