<template>
    <ion-page>
        <div class="Timesheets_modal" :class="{openModal:openModal}">
                <div class="Timesheets_modal_box">
                    <h2>{{quedTimesheet.title}}</h2>
                    <div class="grid">
                        <p>Schedule Start:</p><div><span>{{dateFormat('%h:%i%a','2022-01-01 '+quedTimesheet.shift_start)}}</span></div>
                        <p>Schedule End:</p><div><span>{{dateFormat('%h:%i%a','2022-01-01 '+quedTimesheet.shift_end)}}</span></div>
                        <p>Clock in:</p><div><span>{{dateFormat('%h:%i%a',quedTimesheet.time_in)}}</span></div>
                        <p>Clock out:</p><div><span>{{dateFormat('%h:%i%a',quedTimesheet.time_out)}}</span></div>
                        <p>Reg. Hours Rendered:</p><div><span>{{quedTimesheet.total_reg_rendered}} hr(s)</span></div>
                        <p>Reg. Hours Pay:</p><div><span>${{quedTimesheet.total_reg_rendered_earned}}</span></div>
                        <p>Late / Undertime:</p><div><span>{{quedTimesheet.reg_late_offset}} min(s)</span></div>
                        <p>Overtime:</p><div><span>{{quedTimesheet.est_overtime}} hr(s)</span></div>
                        <p>Overtime Pay:</p><div><span>${{quedTimesheet.est_overtime_earned}}</span></div>
                        <p>Total Pay:</p><div><span>${{quedTimesheet.total_earned}}</span></div>
                    </div>
                    <ion-button expand="block" @click="openModal=false">Close</ion-button>
                    
            </div>
        </div>

        <ion-header class="header" no-border collapse="fade">
            <ion-toolbar class="main-header">
                <ion-buttons slot="end">
                    <ion-avatar @click="$router.push('/employee/profile')">
                        <img :src="user.profile_img"/>
                    </ion-avatar>
                </ion-buttons>
                <ion-title>Timesheets</ion-title>
            </ion-toolbar>
            <ion-toolbar class="sub-header sub-header3 ion-padding-bottom">
                <ion-datetime @ionChange="setDate" presentation="date"></ion-datetime>
            </ion-toolbar>
        </ion-header>
        <ion-content fullscreen="true">
            <ion-refresher style="position:relative; z-index:999;" slot="fixed" @ionRefresh="handleRefresh($event)">
                <ion-refresher-content refreshing-spinner="crescent"></ion-refresher-content>
            </ion-refresher>

            <div class="noData" v-if="timesheets == ''">
                <img src="@/images/noData.svg" alt="No Data">
            </div>

            <ion-list class="ion-margin-top">
                <ion-item v-for="test in timesheets" :key="test.user_id" @click="quedTimesheet = test;openModal=true" button lines="none">
                    <ion-label>
                        <h2>{{ test.title }}</h2>
                        <p>Clock In: {{ dateFormat('%h:%i%a',test.time_in) }}</p>
                        <p>Clock Out: {{ dateFormat('%h:%i%a',test.time_out) }}</p>
                        <p>Total Pay: ${{test.total_earned}}</p>
                    </ion-label>
                </ion-item>
            </ion-list>

            <ion-modal :is-open="isOpen">
                <ion-header>
                    <ion-toolbar>
                        <ion-buttons>
                            <ion-button @click="setOpen(false)"><ion-icon slot="start" color="light" :icon="arrowBack"></ion-icon></ion-button>
                        </ion-buttons>
                        <ion-card class="ion-text-center attend_profile">
                            <ion-card-header>
                                <ion-avatar>
                                    <img :src="user.profile_img"/>
                                </ion-avatar>
                                <ion-card-title>{{ user.firstname }} {{ user.lastname }}</ion-card-title>
                                <ion-card-subtitle>{{ user.role }}</ion-card-subtitle>
                            </ion-card-header>
                        </ion-card>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <ion-item lines="full">
                        <ion-icon :icon="person" slot="start"></ion-icon>
                        <ion-label>
                            <h3>Name</h3>
                            <p>{{ user.firstname }} {{ user.lastname }}</p>
                        </ion-label>
                    </ion-item>
                    <ion-item lines="full">
                        <ion-icon :icon="briefcase" slot="start"></ion-icon>
                        <ion-label>
                            <h3>Position</h3>
                            <p>{{ user.role }}</p>
                        </ion-label>
                    </ion-item>
                    <ion-item lines="full">
                        <ion-icon :icon="map" slot="start"></ion-icon>
                        <ion-label>
                            <h3>Location</h3>
                            <p>{{ user.address }}</p>
                        </ion-label>
                    </ion-item>
                    <ion-item lines="full">
                        <ion-icon :icon="time" slot="start"></ion-icon>
                        <ion-label>
                            <h3>Time In</h3>
                            <p>11:30 AM</p>
                        </ion-label>
                    </ion-item>
                    <ion-item lines="full">
                        <ion-icon :icon="timer" slot="start"></ion-icon>
                        <ion-label>
                            <h3>Time Out</h3>
                            <p>6:30 AM</p>
                        </ion-label>
                    </ion-item>
                    <ion-button class="ion-margin-top" expand="full" shape="round" @click="setOpen(false)">back</ion-button>
                </ion-content>
            </ion-modal>

        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonHeader, IonToolbar, menuController, IonDatetime, IonModal, IonTitle, IonRefresher, IonRefresherContent, IonButton, IonAvatar, IonLabel, IonItem, IonList, IonIcon, IonButtons, IonCardTitle, IonCardSubtitle, IonCardHeader, IonCard } from '@ionic/vue';
import { lStore, axios, dateFormat, formatDateString } from '@/functions';

export default defineComponent({
    name: 'TmesheetsView',
    components: { IonContent, IonPage, IonHeader, IonToolbar, IonDatetime, IonModal, IonTitle, IonRefresher, IonRefresherContent, IonButton, IonAvatar, IonLabel, IonItem, IonList, IonIcon, IonButtons, IonCardTitle, IonCardSubtitle, IonCardHeader, IonCard },
    setup() {
        const logScrolling3 = (e) => {
            if (e.detail.scrollTop >= 50) {
                document.querySelector('ion-header').classList.add('hidden');
                document.querySelector('.sub-header3').classList.add('hidden');
            } else {                                                                                
                document.querySelector('ion-header').classList.remove('hidden');
                document.querySelector('.sub-header3').classList.remove('hidden');
            }
        }
        return { logScrolling3 };
    },
    data() {
        return{
            message: null,
            noProfilePic: false,
            isOpen: false,
            getDayToday: '',
            user: {},
            timesheets: [],
            selectedDate : '',
            openModal: false,
            quedTimesheet:{}
        }
    },
    created() {
        this.user = lStore.get('user_info');
    },
    mounted() {
        const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        let day = days[new Date().getDay()].toUpperCase();
        this.getDayToday = day;

        let currentDate = new Date();
        let tommDate = new Date();
        tommDate.setDate(tommDate.getDate()+1);
        tommDate = tommDate.toLocaleDateString();
        currentDate = currentDate.toLocaleDateString();
        let currentDateArr = currentDate.split('/');
        let tommDateArr = tommDate.split('/');
        currentDate = formatDateString(currentDateArr[2]+'-'+currentDateArr[0]+'-'+currentDateArr[1]).replaceAll(' ','');
        tommDate = formatDateString(tommDateArr[2]+'-'+tommDateArr[0]+'-'+tommDateArr[1]).replaceAll(' ','');

        axios.post(
            `timerecord?
            user_id=${lStore.get('user_id')}
            &_batch=true
            &_joins=mobile_schedule
            &_on=mobile_timerecord.schedule_id=mobile_schedule.id
            &_GTE_time_in=${currentDate}
            &_GTE_time_in=${tommDate}` 
        ).then(res=>{
            this.timesheets = [];
            if(res.data.result == null) return;
            this.timesheets = res.data.result;
            for(let i = 0; i < this.timesheets.length; i++){
                let totalHours = (new Date(this.timesheets[i].time_out).getTime() -  new Date(this.timesheets[i].time_in).getTime()) / (1000*60*60);
                this.timesheets[i].totalHours = totalHours.toFixed(2);
                this.timesheets[i].total_earned = parseFloat(this.timesheets[i].total_earned).toFixed(2);
            }
            
        })

    },
    methods: {
        dateFormat,
        setOpen(isOpen) {
            this.isOpen = isOpen;
        },
        openMenu() {
            menuController.open('app-menu');
        },
        closeMenu() {
            menuController.close('app-menu');
        },
        handleRefresh(e){
            this.setDate(this.selectedDate);
            e.target.complete();
        },
        setDate(e){
            let date = e;
            if(e.target != null){
                date = e.target.value.match(/^[0-9]+-[0-9]+-[0-9]+/)[0];
                this.selectedDate = date;
            }

            let currentDate = new Date(date).toLocaleDateString();
            let tommDate = new Date(date);
            tommDate.setDate(tommDate.getDate()+1);
            tommDate = tommDate.toLocaleDateString();
            let currentDateArr = currentDate.split('/');
            let tommDateArr = tommDate.split('/');
            currentDate = formatDateString(currentDateArr[2]+'-'+currentDateArr[0]+'-'+currentDateArr[1]).replaceAll(' ','');
            tommDate = formatDateString(tommDateArr[2]+'-'+tommDateArr[0]+'-'+tommDateArr[1]).replaceAll(' ','');
            
            axios.post(
                `timerecord?
                user_id=${lStore.get('user_id')}
                &_joins=mobile_schedule
                &_on=mobile_timerecord.schedule_id=mobile_schedule.id
                &_GTE_time_in=${currentDate}
                &_LSE_time_in=${tommDate}
                &_batch=true`
            ).then(res=>{
                this.timesheets = [];
                if(res.data.result == null) return;
                this.timesheets = res.data.result;
                for(let i = 0; i < this.timesheets.length; i++){
                    let totalHours = (new Date(this.timesheets[i].time_out).getTime() -  new Date(this.timesheets[i].time_in).getTime()) / (1000*60*60);
                    this.timesheets[i].totalHours = totalHours.toFixed(2);
                    this.timesheets[i].total_earned = parseFloat(this.timesheets[i].total_earned).toFixed(2);
                }
            })
        }
    }
});
</script>

<style scoped>

.noData{width: 230px; max-width: 100%; margin: 30px auto 0;}

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
    border: 3px solid #fff;
}

ion-header {
    z-index: 200;
}

ion-header.hidden {
	max-height: 104px;
	margin-bottom: 104px;
}

.ios ion-header.hidden {
	max-height: 88px;
	margin-bottom: 88px;
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
}

.sub-header ion-card {
    margin: 0 auto 8px; 
    padding: 15px 0;
    border-radius: 25px;
}

.sub-header.hidden {
    top: -250px;
}

ion-header {
    box-shadow: none;
}

ion-header::after {
    display: none;
}

ion-datetime {
    min-height: 0 !important;
}

ion-title {
    --text-align: left !important; 
    font-size: 21px; 
    --padding: 0 !important;
}

ion-title span {
    display: block;
    color: #1f94db;
    font-weight: bold;
}

ion-text h3 {
    font-size: 18px;
    margin: 0;
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
}

ion-card-subtitle {
    color: #1f94db;
    font-weight: bold;
}

ion-col h2 {
    font-size: 17px; 
    padding-left: 14px;
}

ion-col h2 {
    font-size: 15px;
    padding-left: 14px;
    color: #4daca8;
    font-weight: 600;
}

ion-col h2 span {
    display: block;
}

ion-col h2 small {
    font-size: 10px;
}

ion-list ion-item {
    border: 1px solid #ddd;
    border-left: 6px solid #999999;
    margin-bottom: 6px;
}

ion-list ion-item:nth-child(even) {
    border-left: 6px solid #1f94db  ;
}

ion-toolbar ion-text {
    text-align: center;
    display: block;
    margin: 0 auto;
}

ion-text h2 {
    font-size: 17px; 
    padding-left: 14px;
}

ion-text h2 {
    font-size: 15px;
    padding-left: 14px;
    color: #4daca8;
    font-weight: 600;
    margin: 0 ;
}

ion-text h2 span {
    display: block;
}

ion-text h2 small {
    font-size: 10px;
}

.info_wrap {
    text-align: center;
}

.info_wrap h2 {
    padding: 0;
    font-size: 35px;
}

.info_wrap h2 span {
    font-size: 20px;
}

.info_wrap ion-avatar {
    text-align: center;
    display: block;
    margin: 0 auto;
    width: 120px;
    height: 120px;
}

.attend_profile {
    background: none;
    box-shadow: none;
    margin: 0;
}

.attend_profile ion-avatar {
    margin: 0 auto 20px;
    width: 120px;
    height: 120px;
}

.attend_profile ion-card-title {
    color: #fff;
}

.attend_profile ion-card-subtitle {
    color: #fff;
}

.Timesheets_modal{
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    width: 100vw;
    height: 100vh;
    transition: 0.4s;
    opacity: 0;
    overflow: auto;
    padding-bottom: 50px;
    align-items:center;
    display:flex;
}

.Timesheets_modal.openModal{
    z-index: 999;
    opacity:1;
}

.Timesheets_modal_box{
    background: #fff;
    color: #000;
    padding: 10px;
    margin: 20px auto;
    border-radius: 10px;
    transition: 0.4s;
    transform: translateY(-100%);
    width: 0%;
    overflow: hidden;
}

.Timesheets_modal.openModal .Timesheets_modal_box{
    transform: translateY(0%);
    width: calc(100% - 40px);
}

.Timesheets_modal.openModal .Timesheets_modal_box{
    transform: translateY(0%);
}

.Timesheets_modal_box h2{
    margin: 0;
    font-size: 20px;
    border-bottom: 1px solid #eee;
    padding: 10px 0;
}

.Timesheets_modal_box .grid{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap:10px;
    margin: 20px 0;
}

.Timesheets_modal_box .grid > p{
    font-weight: normal;
    width:30%;
    color: #555;
    font-size: 15px;
    line-height: 1.5;
    margin: 0;
}



.Timesheets_modal_box .grid > div{
    width:63%;
}

.Timesheets_modal_box .grid > div:nth-child(2n) > span{
    background: #edf8ff;
    border-bottom: 1px solid #c0e7ff;
    padding: 7px;
    line-height: 1.5;
    color: #555;
    font-size: 15px;
    width: 100%;
    display: block;
    border-radius: 10px;
}

</style>