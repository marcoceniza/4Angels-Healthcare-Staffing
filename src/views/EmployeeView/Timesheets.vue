<template>
    <ion-page>
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
                <ion-datetime presentation="date"></ion-datetime>
            </ion-toolbar>
        </ion-header>
        <ion-content fullscreen="true">

            <ion-list class="ion-margin-top">
                <ion-item button lines="none" @click="setOpen(true)">
                    <ion-label>
                        <h1>Facility 1</h1>
                        <p>Clock In: 7:00 am</p>
                        <p>Clock Out: 6:30 pm</p>
                    </ion-label>
                </ion-item>

                <ion-item button lines="none" @click="setOpen(true)">
                    <ion-label>
                        <h1>Facility 2</h1>
                        <p>Clock In: 7:00 am</p>
                        <p>Clock Out: 6:30 pm</p>
                    </ion-label>
                </ion-item>

                <ion-item button lines="none" @click="setOpen(true)">
                    <ion-label>
                        <h1>Facility 3</h1>
                        <p>Clock In: 7:00 am</p>
                        <p>Clock Out: 6:30 pm</p>
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
import { IonContent, IonPage, IonHeader, IonToolbar, menuController, IonDatetime, IonModal, IonTitle } from '@ionic/vue';
import { apps, map, chatbox, settings, ticket, helpCircle, logOut, alertCircle, warning, menu, close, arrowBack, person, briefcase, time, timer } from 'ionicons/icons';
import { lStore } from '@/functions';

export default defineComponent({
    name: 'TmesheetsView',
    components: { IonContent, IonPage, IonHeader, IonToolbar, IonDatetime, IonModal, IonTitle },
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
        return { apps, map, chatbox, settings, ticket, helpCircle, logOut, alertCircle, warning, logScrolling3, menu, close, arrowBack, person, briefcase, time, timer };
    },
    data() {
        return{
            message: null,
            noProfilePic: false,
            isOpen: false,
            getDayToday: '',
            user: {}
        }
    },
    created() {
        this.user = lStore.get('user_info');
    },
    mounted() {
        const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        let day = days[new Date().getDay()].toUpperCase();
        this.getDayToday = day;
    },
    methods: {
        setOpen(isOpen) {
            this.isOpen = isOpen;
        },
        openMenu() {
            menuController.open('app-menu');
        },
        closeMenu() {
            menuController.close('app-menu');
        }
    }
});
</script>

<style scoped>
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

ion-menu ion-content ion-item {
    font-size: 18px;
    color: #aa0927;
    --padding-start: 30px;
    --padding-end: 30px;
    --padding-top: 15px;
    --padding-bottom: 15px;
    --inner-padding-start: 0;
    --inner-padding-end: 0;
    --inner-border-width: 0;
    padding: 0;
    margin: 0;
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
    z-index: 999;
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

</style>