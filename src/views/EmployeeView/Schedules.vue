<template>
    <ion-page>
        <ion-header class="header" no-border collapse="fade">
            <ion-toolbar class="main-header">
                <ion-buttons slot="end">
                    <ion-avatar @click="$router.push('/supervisor/profile')">
                        <img src="@/images/profile.svg"/>
                    </ion-avatar>
                </ion-buttons>
                <ion-title>Schedules</ion-title>
            </ion-toolbar>
            <ion-toolbar class="sub-header sub-header2 ion-padding-bottom">
                <ion-datetime presentation="date"></ion-datetime>
            </ion-toolbar>
        </ion-header>
        <ion-content fullscreen="true">

            <ion-modal :is-open="isOpen">
                <ion-header>
                    <ion-toolbar>
                        <ion-title>Option</ion-title>
                        <ion-buttons slot="end">
                            <ion-button @click="isOpen = false" color="light">Close</ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <ion-grid>
                        <ion-row>
                            <ion-col size="6">
                                <ion-button color="primary" shape="round" expand="full">Accept</ion-button>
                            </ion-col>
                            <ion-col size="6">
                                <ion-button color="success" shape="round" expand="full">Change</ion-button>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-content>
            </ion-modal>

            <ion-list class="ion-margin-top">
                <ion-item button lines="none" @click="setOpen">
                    <ion-label>
                        <h1>Morning Shift</h1>
                        <p>Facility 1</p>
                        <p>Render Time: 8 hrs</p>
                    </ion-label>
                </ion-item>
            </ion-list>

        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonHeader, IonToolbar, menuController, IonDatetime, loadingController, actionSheetController, IonTitle, IonModal, IonButtons, IonButton } from '@ionic/vue';
import { apps, map, chatbox, settings, ticket, helpCircle, logOut, alertCircle, warning, menu } from 'ionicons/icons';
import { axios } from '@/functions';

export default defineComponent({
    name: 'SchedulesView',
    components: { IonContent, IonPage, IonHeader, IonToolbar, IonDatetime, IonTitle, IonModal, IonButtons, IonButton },
    setup() {
        const logScrolling2 = (e) => {
            if (e.detail.scrollTop >= 50) {
                document.querySelector('ion-header').classList.add('hidden');
                document.querySelector('.sub-header2').classList.add('hidden');
            } else {                                                                                
                document.querySelector('ion-header').classList.remove('hidden');
                document.querySelector('.sub-header2').classList.remove('hidden');
            }
        }
        return { apps, map, chatbox, settings, ticket, helpCircle, logOut, alertCircle, warning, logScrolling2, menu };
    },
    data() {
        return{
            formLoading1: false,
            task: null,
            message: null,
            availableSchedules: [{}],
            noProfilePic: false,
            user: {},
            facility: '',
            getMonthToday: '',
            isOpen: false,
        }
    },
    mounted() {
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        let month = months[new Date().getMonth()].toUpperCase();
        this.getMonthToday = month;

        this.availableSchedules = [];
        axios.post('users?_batch=true').catch(res=>{
            console.log(res);
        }).then(res=>{
            res.data.result.forEach(el => {
                axios.post("users?id="+el.id+"&_joins=mobile_branchusers,mobile_designation,mobile_branches&_on=mobile_users.id=mobile_branchusers.user_id,mobile_users.designation_id=mobile_designation.id,mobile_branchusers.branch_id=mobile_branches.id&_batch=true").catch(res=>{
                    console.log(res);
                })
                this.availableSchedules.push(el); 
            });
        });
    },
    methods: {
        async openLoader() {
            const loading = await loadingController.create({
                message: 'Logging Out...',
                cssClass: 'custom-loading'
            });
            return loading.present();
        },
        async openActionSheet() {
            const openSheet = await actionSheetController.create({
                header: 'Are you sure you want to log out?',
                buttons: [
                    {
                        text: 'Log Out',
                        role: 'destructive',
                        handler: () => {
                            this.openLoader().then(()=>{
                                this.logout();
                            });
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
            return openSheet.present();
        },
        async presentActionSheet() {
            this.openActionSheet();
        },
        logout() {
            localStorage.clear();
            this.$router.push('/login');
            loadingController.dismiss();
        },
        openMenu() {
            menuController.open('app-menu');
        },
        closeMenu() {
            menuController.close('app-menu');
        },
        setOpen() {
            this.isOpen = true;
        },
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

ion-select {
    width: 100%;
}

.facility_wrap {
    border-radius: 20px;
}

.logout-icon {
    position: absolute;
    top: 35px;
    right: 12px;
    font-size: 25px;
    color: #fff;
    display: block;
}
</style>