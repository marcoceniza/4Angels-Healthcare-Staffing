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
            <ion-toolbar class="sub-header sub-header2 ion-padding-bottom">
                <ion-datetime @ionChange="setDate" presentation="date"></ion-datetime>
            </ion-toolbar>
        </ion-header>
        <ion-content fullscreen="true">

            <ion-list class="ion-margin-top" v-for="st in schedulesToday" :key="st.id" :class="{schedTaken: takenSchedulesToday.includes(st.id)}">
                <ion-item button lines="none" @click="openActionSheet(st.id)">
                    <ion-label>
                        <h1>{{st.title}}</h1>
                        <p>{{st.name}}</p>
                        <p>Start Time: {{dateFormat('%h:%i%a',selectedDate+' '+st.shift_start)}}</p>
                        <p>End Time: {{dateFormat('%h:%i%a',selectedDate+' '+st.shift_end)}}</p>
                        <p>Date: {{dateFormat('%lm %d, %y',selectedDate)}}</p>
                    </ion-label>
                </ion-item>
            </ion-list>

        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonHeader, IonToolbar, IonDatetime, actionSheetController, IonTitle, IonButtons } from '@ionic/vue';
import { apps, map, chatbox, settings, ticket, helpCircle, logOut, alertCircle, warning, menu } from 'ionicons/icons';
import { axios, lStore,dateFormat } from '@/functions';

export default defineComponent({
    name: 'SchedulesView',
    components: { IonContent, IonPage, IonHeader, IonToolbar, IonDatetime, IonTitle, IonButtons },
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
            schedulesToday:[],
            takenSchedulesToday: [],
            noProfilePic: false,
            selectedDate:'2022-01-01',
            user: {},
            facility: '',
            getMonthToday: '',
            isOpen: false,
        }
    },
    created() {
        this.user = lStore.get('user_info');
    },
    mounted() {
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        let month = months[new Date().getMonth()].toUpperCase();
        this.getMonthToday = month;
        this.selectedDate = new Date().toLocaleDateString();

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
        dateFormat,
        async openActionSheet(id) {
            const openSheet = await actionSheetController.create({
                header: 'Schedule Action',
                buttons: [
                    {
                        text: 'Apply Shift',
                        role: 'destructive',
                        data: {
                            action: 'apply',
                        },
                    },
                    {
                        text: 'Request Change',
                        role: 'destructive',
                        data: {
                            action: 'request change',
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

            await openSheet.present();
            openSheet.onDidDismiss().then(res=>{
                if(res.data == null) return;
                if(res.data.action == 'cancel') return;
                if(res.data.action == 'apply') {
                    axios.post('assigned/create',null,{
                        user_id: lStore.get('user_id'),
                        schedule_id: id
                    }).then(res2=>{
                        console.log(res2.data);
                    })
                }
            });

        },
        setOpen() {
            this.isOpen = true;
        },
        setDate(e){
            let date = e.target.value.match(/^[0-9]+-[0-9]+-[0-9]+/)[0];
            this.selectedDate = date;
            axios.post(`schedule?_LSE_shift_date=${date}&_GTE_shift_date_end=${date}&_batch=true&_joins=mobile_branches&_on=mobile_schedule.branch_id=mobile_branches.id
            &_select=mobile_schedule.id,
            mobile_schedule.title,
            mobile_schedule.shift_start,
            mobile_schedule.shift_end,
            mobile_schedule.shift_date,
            mobile_schedule.shift_date_end,
            mobile_branches.name`).then(res=>{
                if(res.data.result == null) {
                    this.schedulesToday = [];
                    return;
                }
                this.schedulesToday = res.data.result;
                
                this.takenSchedulesToday = [];
                this.schedulesToday.forEach(el=>{
                    axios.post('assigned?user_id='+lStore.get('user_id')+'&schedule_id='+el.id,null,null).then(res=>{
                        if(res.data.result == null) return;
                        this.takenSchedulesToday.push(el.id);
                    })
                })

                this.takenSchedulesToday = this.schedulesToday.filter(el=>this.takenSchedulesToday.includes(el.id));
                console.log(this.takenSchedulesToday);
            })
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
    color: #1f94db;
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

.schedTaken{
    pointer-events: none;
    opacity: 0.5;
}
</style>