<template>
    <ion-page>
        <ion-header class="header" no-border>
            <ion-toolbar class="main-header">
                <ion-text class="title_txt">List of Employee</ion-text>
            </ion-toolbar>
            <ion-toolbar class="sub-header sub-header3">
                <ion-datetime presentation="date" :prefer-wheel="true"></ion-datetime>
            </ion-toolbar>
        </ion-header>
        <ion-content fullscreen="true" id="main" :scroll-events="true" @ionScroll="logScrolling3($event)">

            <ion-text><h2>11 <small>THU</small> <span>TODAY</span></h2></ion-text>

            <ion-list class="ion-margin-top">
                <ion-item button lines="none">
                    <ion-label>
                        <h1>John Doe</h1>
                        <p>Certified Nurse Assistant</p>
                        <p>Clock In: 7:00 am</p>
                        <p>Clock Out: --:--</p>
                    </ion-label>
                </ion-item>
                <ion-item button lines="none">
                    <ion-label>
                        <h1>Peter Swalter</h1>
                        <p>Lead Doctor</p>
                        <p>Clock In: 6:30 am</p>
                        <p>Clock Out: --:--</p>
                    </ion-label>
                </ion-item>
                <ion-item button lines="none">
                    <ion-label>
                        <h1>John Doe</h1>
                        <p>Certified Nurse Assistant</p>
                        <p>Clock In: 7:00 am</p>
                        <p>Clock Out: --:--</p>
                    </ion-label>
                </ion-item>
                <ion-item button lines="none">
                    <ion-label>
                        <h1>Peter Swalter</h1>
                        <p>Lead Doctor</p>
                        <p>Clock In: 6:30 am</p>
                        <p>Clock Out: --:--</p>
                    </ion-label>
                </ion-item>
                <ion-item button lines="none">
                    <ion-label>
                        <h1>John Doe</h1>
                        <p>Certified Nurse Assistant</p>
                        <p>Clock In: 7:00 am</p>
                        <p>Clock Out: --:--</p>
                    </ion-label>
                </ion-item>
                <ion-item button lines="none">
                    <ion-label>
                        <h1>Peter Swalter</h1>
                        <p>Lead Doctor</p>
                        <p>Clock In: 6:30 am</p>
                        <p>Clock Out: --:--</p>
                    </ion-label>
                </ion-item>
            </ion-list>

        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonHeader, IonToolbar, IonItem, menuController, IonDatetime } from '@ionic/vue';
import { apps, map, chatbox, settings, ticket, helpCircle, logOut, alertCircle, warning, menu } from 'ionicons/icons';

export default defineComponent({
    name: 'EmployeeSchedules',
    components: { IonContent, IonPage, IonHeader, IonToolbar, IonItem, IonDatetime },
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
        return { apps, map, chatbox, settings, ticket, helpCircle, logOut, alertCircle, menu, warning, logScrolling3 };
    },
    data() {
        return{
            message: null,
            noProfilePic: false,
            user: {},
        }
    },
    methods: {
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

ion-list ion-item {
    border-left: 6px solid #999999;
    margin-bottom: 6px;
}

ion-list ion-item:nth-child(even) {
    border-left: 6px solid #1f94db  ;
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
    top: -225px;
}

ion-header {
    box-shadow: none;
}

ion-header::after {
    display: none;
}

.ios .sub-header {
    padding-bottom: 0;
}

ion-title {
    display: block;
    font-size: 28px;
    font-weight: bold;
    padding: 0;
    --padding-start: 0;
    --padding-end: 0;
    --min-height: 80px;
}

ion-title span {
    display: block;
    color: #1f94db;
    font-weight: bold;
}

.ios ion-title {
    padding: 0 20px;
    --padding-start: 20px;
    --padding-end: 20px;
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

ion-text h2 {
    font-size: 17px; 
    padding-left: 14px;
}

ion-text h2 {
    font-size: 15px;
    padding-left: 14px;
    color: #4daca8;
    font-weight: 600;
    margin: 0;
}

ion-text h2 span {
    display: block;
}

ion-text h2 small {
    font-size: 10px;
}
</style>