<template>
    <ion-page>
        <ion-header class="header" no-border collapse="fade">
            <ion-toolbar class="main-header">
                <ion-buttons slot="end">
                    <ion-avatar @click="$router.push('/supervisor/profile')">
                        <img :src="user.profile_img"/>
                    </ion-avatar>
                </ion-buttons>
                <ion-title>Schedules</ion-title>
            </ion-toolbar>
            <ion-toolbar>
                <ion-card>
                    <ion-searchbar class="searchField" type="text" v-model="searchInput" placeholder="Search Employee..."></ion-searchbar>
                </ion-card>
            </ion-toolbar>
        </ion-header>
        <ion-content fullscreen="true" scroll-events="true">
            <ion-list class="data-list">
                <ion-item v-for="schedule in filteredFacility" :key="schedule" button @click="setOpen(true); selectedEmployee = schedule">
                    <ion-avatar slot="start">
                        <ion-img :src="schedule.profile_img"></ion-img>
                    </ion-avatar>
                    <ion-label>
                        <h2>{{ schedule.firstname }} {{ schedule.lastname }}</h2>
                        <p>{{ schedule.role }}</p>
                        <p>{{ schedule.address }}</p>
                    </ion-label>
                </ion-item>
                <ion-item v-if="searchInput && !filteredFacility.length">
                    <p>No results found!</p>
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
                                    <img :src="selectedEmployee.profile_img"/>
                                </ion-avatar>
                                <ion-card-title>{{ selectedEmployee.firstname }} {{ selectedEmployee.lastname }}</ion-card-title>
                                <ion-card-subtitle>{{ selectedEmployee.role }}</ion-card-subtitle>
                            </ion-card-header>
                        </ion-card>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <ion-item lines="full">
                        <ion-icon :icon="person" slot="start"></ion-icon>
                        <ion-label>
                            <h3>Name</h3>
                            <p>{{ selectedEmployee.firstname }} {{ selectedEmployee.lastname }}</p>
                        </ion-label>
                    </ion-item>
                    <ion-item lines="full">
                        <ion-icon :icon="briefcase" slot="start"></ion-icon>
                        <ion-label>
                            <h3>Position</h3>
                            <p>{{ selectedEmployee.role }}</p>
                        </ion-label>
                    </ion-item>
                    <ion-item lines="full">
                        <ion-icon :icon="map" slot="start"></ion-icon>
                        <ion-label>
                            <h3>Location</h3>
                            <p>{{ selectedEmployee.address }}</p>
                        </ion-label>
                    </ion-item>
                    <ion-item lines="full">
                        <ion-icon :icon="time" slot="start"></ion-icon>
                        <ion-label>
                            <h3>Time In</h3>
                            <p>--:-- --</p>
                        </ion-label>
                    </ion-item>
                    <ion-item lines="full">
                        <ion-icon :icon="timer" slot="start"></ion-icon>
                        <ion-label>
                            <h3>Time Out</h3>
                            <p>--:-- --</p>
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
import { IonContent, IonPage, IonHeader, IonToolbar, menuController, IonSearchbar, IonAvatar, IonIcon, IonButtons, IonImg, IonModal, IonTitle } from '@ionic/vue';
import { axios } from '@/functions';
import { search, logOut, arrowBack, person, briefcase, time, timer, map } from 'ionicons/icons';
import { lStore } from '@/functions';

export default defineComponent({
    name: 'EmployeeSchedules',
    components: { IonContent, IonPage, IonHeader, IonToolbar, IonSearchbar, IonAvatar, IonIcon, IonButtons, IonImg, IonModal, IonTitle },
    setup() {
        return { search, logOut, arrowBack, person, briefcase, time, timer, map };
    },
    data() {
        return{
            message: null,
            noProfilePic: false,
            user: {},
            employeeSchedules: [{}],
            selectedEmployee:{profile_img:'',firstname:'',lastname:'',role:''},
            searchInput: '',
            hideImg: false,
            isOpen: false
        }
    },
    mounted() {
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        let month = months[new Date().getMonth()].toUpperCase();
        this.getMonthToday = month;

        this.employeeSchedules = [];
        axios.post('users?_batch=true').catch(res=>{
            console.log(res);
        }).then(res=>{
            res.data.result.forEach(el => {
                axios.post("users?id="+el.id+"&_joins=mobile_branchusers,mobile_designation,mobile_branches&_on=mobile_users.id=mobile_branchusers.user_id,mobile_users.designation_id=mobile_designation.id,mobile_branchusers.branch_id=mobile_branches.id&_batch=true").catch(res=>{
                    console.log(res);
                })
                this.employeeSchedules.push(el); 
            });
        });
    },
    created() {
        this.user = lStore.get('user_info');
    },
    methods: {
        openMenu() {
            menuController.open('app-menu');
        },
        closeMenu() {
            menuController.close('app-menu');
        },
        setOpen(isOpen) {
            this.isOpen = isOpen;
        },
    },
    computed: {
        filteredFacility() {
            if(Object.keys(this.employeeSchedules).length <= 1) return;

            return this.employeeSchedules.filter(data => (data.firstname.toLowerCase().includes(this.searchInput.toLowerCase()) ||
                    this.searchInput.toLowerCase().includes(data.firstname.toLowerCase()) ||
                    data.lastname.toLowerCase().includes(this.searchInput.toLowerCase()) ||
                    this.searchInput.toLowerCase().includes(data.lastname.toLowerCase())));
        },
    }
});
</script>

<style scoped>

.searchbar-input-container.sc-ion-searchbar-ios {
    height: 55px !important;
}

ion-searchbar {
    --border-radius: 30px;
}

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

ion-searchbar {
    padding: 0;
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
    font-size: 22px; 
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
    margin: 0;
    background: none;
    box-shadow: none;
}

ion-card img {
    display: table;
    width: 100%;
    max-width: 200px;
    height: 100%;
    object-fit: contain;
    margin: auto;
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
    margin: 0                                       ;
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

ion-searchbar {
    --background: #fff;
}

ion-searchbar div {
    height: 50px !important;
}

.hide {
    display: none;
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