<template>
    <ion-page>
        <ion-header class="header" no-border>
            <ion-toolbar class="main-header"> 
                <ion-buttons slot="end">
                    <ion-avatar @click="$router.push('/supervisor/profile')">
                        <img :src="user.profile_img"/>
                    </ion-avatar>
                </ion-buttons>
                <ion-title>Employee</ion-title>
            </ion-toolbar>
            <ion-toolbar class="sub-header">
                <ion-list>
                    <ion-item lines="none">
                        <ion-select interface="popover" v-model="searchFacility" @ionChange="chooseFacility" placeholder="Select fruit">
                            <IonSelectOption value="">Select Facility</IonSelectOption>
                            <IonSelectOption value="Employee">Employee</IonSelectOption>
                            <IonSelectOption value="Supervisor">Supervisor</IonSelectOption>
                            <IonSelectOption value="Admin">Admin</IonSelectOption>
                        </ion-select>
                    </ion-item>
                </ion-list>
            </ion-toolbar>
        </ion-header>
        <ion-content @ionScroll="logScrolling($event)">

            <!-- <ion-text class="ion-margin-bottom"><h2>{{ new Date().getDate() }} <small>{{ getDayToday }}</small> <span>TODAY</span></h2></ion-text> -->

            <ion-list class="ion-margin-top listEmployee ion-margin-top">
                <ion-item v-for="employeeList in employeeList" :key="employeeList.id" v-show="employeeList.role == role || role == ''" button>
                    <ion-avatar slot="start">
                        <ion-img src="https://i.pravatar.cc/300?u=b"></ion-img>
                    </ion-avatar>
                    <ion-label>
                        <h2>{{ employeeList.firstname }} {{ employeeList.lastname }}</h2>
                        <p>{{ employeeList.role }}</p>
                        <p>{{ employeeList.address }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>

        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonHeader, IonToolbar, IonItem, menuController, IonList, IonLabel, actionSheetController, loadingController, IonAvatar, IonButtons, IonImg, IonSelect, IonSelectOption } from '@ionic/vue';
import { lStore, axios } from '@/functions';

export default defineComponent({
    name: 'EmployeeList',
    components: { IonContent, IonPage, IonHeader, IonToolbar, IonItem, IonList, IonLabel, IonAvatar, IonButtons, IonImg, IonSelect, IonSelectOption },
    data() {
        return{
            message: null,
            noProfilePic: false,
            user: {},
            employeeList: [{}],
            getDayToday: '',
            searchFacility: '',
            role: ''
        }
    },
    created() {
        this.user = lStore.get('user_info');
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
        chooseFacility() {
            if(this.searchFacility == 'Employee') {
                this.role = 'Employee';
            }else if(this.searchFacility == 'Supervisor') {
                this.role = 'Supervisor';
            }else if(this.searchFacility == 'Admin') {
                this.role = 'Admin';
            }else {
                this.role = '';
            }
        }
    },
    
    mounted() {
        this.employeeList = [];
        axios.post('users?_batch=true').catch(res=>{
            console.log(res);
        }).then(res=>{
            res.data.result.forEach(el => {
                this.employeeList.push(el);
            });
        });

        const todays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        let month = todays[new Date().getDay()].toUpperCase();
        this.getDayToday = month;
    },
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

.listEmployee ion-item {
    border-left: 6px solid #1f94db;
    margin-bottom: 6px;
}

.ion-margin-bottom {
    display: block;
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

ion-menu ion-content ion-item ion-label {
    margin: 0;
}

ion-menu ion-content ion-item ion-button {
    width: 100%;
    margin: auto;
}

ion-select {
    width: 100%;
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

.sub-header.hidden {
    top: -84px;
}

.ios .sub-header.hidden {
    top: -80px;
}

.ios .sub-header.hidden {
	padding-bottom: 0;
}

.sub-header ion-list {
    border-radius: 30px;
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

.listEmployee {
    margin-top: 0;
}

.listEmployee ion-item {
    border-left: 6px solid #999999;
    margin-bottom: 6px;
}

.listEmployee ion-item:nth-child(even) {
    border-left: 6px solid #1f94db  ;
}

.facility-wrap {
    display: block;
    width: 100%;
    background: #fff !important;
    border: none;
}

.facility-wrap option {
    display: block;
    width: 100%;
    background: #fff !important;
    border: none;
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