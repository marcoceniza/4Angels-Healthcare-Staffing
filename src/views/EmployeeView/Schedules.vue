<template>
    <ion-page>
        <div class="Timesheets_modal" :class="{openModal:openModal}">
            <div class="Timesheets_modal_box">
                <h2>{{openedSchedule.title}}</h2>
                <div class="grid">
                    <p>Schedule Date:</p><div><span>{{dateFormat('%lm %d, %y','2022-01-01 '+openedSchedule.shift_date)}}</span></div>
                    <p>Schedule Start:</p><div><span>{{dateFormat('%h:%i%a','2022-01-01 '+openedSchedule.shift_start)}}</span></div>
                    <p>Schedule End:</p><div><span>{{dateFormat('%h:%i%a','2022-01-01 '+openedSchedule.shift_end)}}</span></div>
                    <p>Branch:</p><div><span>{{openedSchedule.name}}</span></div>
                    <p>Branch Location:</p><div><span>{{openedSchedule.location}}</span></div>
                    <p>Description:</p><div><span>{{openedSchedule.description}}</span></div>
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
                <ion-title>Schedules</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content fullscreen="true">
            <ion-refresher style="position:relative; z-index:999;" slot="fixed" @ionRefresh="handleRefresh($event)">
                <ion-refresher-content refreshing-spinner="crescent"></ion-refresher-content>
            </ion-refresher>

            <div class="sub-header sub-header2 ion-padding-bottom">
                <ion-datetime @ionChange="setDate" presentation="date"></ion-datetime>
            </div>

            <ion-list class="ion-margin-top" v-for="st in schedulesToday" :key="st.id">
                <ion-item button lines="none" @click="openActionSheet(st.id)" :style="'border-left: 6px solid '+st.color">
                    <ion-label>
                        <h1>{{st.title}}</h1>
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
import { IonContent, IonPage, IonHeader, IonToolbar, IonDatetime, actionSheetController, IonTitle, IonButtons, IonRefresher, IonRefresherContent } from '@ionic/vue';
import { apps, map, chatbox, settings, ticket, helpCircle, logOut, alertCircle, warning, menu } from 'ionicons/icons';
import { axios, lStore,dateFormat, openToast } from '@/functions';

export default defineComponent({
    name: 'SchedulesView',
    components: { IonContent, IonPage, IonHeader, IonToolbar, IonDatetime, IonTitle, IonButtons, IonRefresher, IonRefresherContent },
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

        const handleRefresh = (event) => {
            setTimeout(() => {
                window.location.reload();
                event.target.complete();
            }, 2000);
        };

        return { handleRefresh, apps, map, chatbox, settings, ticket, helpCircle, logOut, alertCircle, warning, logScrolling2, menu };
    },
    data() {
        return{
            formLoading1: false,
            task: null,
            message: null,
            schedulesToday:[],
            takenSchedulesToday: [],
            noProfilePic: false,
            selectedDate:'2022-01-01',
            user: {},
            facility: '',
            getMonthToday: '',
            isOpen: false,
            openModal: false,
            openedSchedule:{}
        }
    },
    created() {
        this.user = lStore.get('user_info');
    },
    mounted() {
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        let month = months[new Date().getMonth()].toUpperCase();
        this.getMonthToday = month;

        let date = new Date().toLocaleDateString();
        date = date.split('/')[2]+'-'+date.split('/')[0]+'-'+date.split('/')[1];
        this.selectedDate = date;
        axios.post(`assigned/joint?range=${date}&_batch=true&exclude_timerecord`).then(res=>{
            if(res.data.result == null) {
                this.schedulesToday = [];
                return;
            }
            this.schedulesToday = res.data.result;
            
            // this.takenSchedulesToday = [];
            // this.schedulesToday.forEach(el=>{
            //     axios.post('assigned?user_id='+lStore.get('user_id')+'&schedule_id='+el.id,null,null).then(res=>{
            //         if(res.data.result == null) return;
            //         this.takenSchedulesToday.push(el.id);
            //     })
            // })

            // this.takenSchedulesToday = this.schedulesToday.filter(el=>this.takenSchedulesToday.includes(el.id));
            // console.log(this.takenSchedulesToday);
        })
    },
    methods: {
        dateFormat,
        async openActionSheet(id) {
            let selectedSched = this.schedulesToday.filter(el=>el.id == id);
            selectedSched = selectedSched[0];
            let actionSheetButtons = [
                {
                    text: 'View Schedule Details',
                    data: {
                        action: 'view',
                    },
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    data: {
                        action: 'cancel',
                    },
                }
            ];

            if(!this.hasAlreadyApplied(selectedSched)){
                actionSheetButtons.push({
                    text: 'Apply Shift',
                    data: {
                        action: 'apply',
                    }
                });
            }else{
                actionSheetButtons.push({
                    text: 'Request Change',
                    data: {
                        action: 'request change',
                    }
                });
            }

            const openSheet = await actionSheetController.create({
                header: 'Schedule Action',
                buttons: actionSheetButtons,
            });

            await openSheet.present();
            openSheet.onDidDismiss().then(res=>{
                if(res.data == null) return;
                if(res.data.action == 'cancel') return;
                if(res.data.action == 'apply') {
                    

                    let schedEnd = new Date(selectedSched.shift_date+' '+selectedSched.shift_end).getTime();
                    let curDateTime = new Date().getTime();
                    if(curDateTime >= schedEnd) {
                        openToast('You cannot apply for a schedule that\'s already finished!','warning');
                        return;
                    }
                    axios.post('assigned/create',null,{
                        user_id: lStore.get('user_id'),
                        schedule_id: id
                    }).then(()=>{
                        window.location.reload();
                    })
                }else if(res.data.action == 'view'){
                    this.openedSchedule = selectedSched;
                    this.openModal = true;
                }
            });

        },
        setOpen() {
            this.isOpen = true;
        },
        hasAlreadyApplied(sched){
            let emp = [];
            if(sched.assignedEmps != null) emp = sched.assignedEmps.filter(el=>el.user_id == lStore.get('user_id'))
            return emp.length > 0
        },
        setDate(e){
            let date = e.target.value.match(/^[0-9]+-[0-9]+-[0-9]+/)[0];
            this.selectedDate = date;
            axios.post(`assigned/joint?range=${date}&_batch=true&exclude_timerecord`).then(res=>{
                if(res.data.result == null) {
                    this.schedulesToday = [];
                    return;
                }
                this.schedulesToday = res.data.result;
            })
        }
    }
});
</script>

<style scoped>

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

.schedTaken ion-item{
    border-left: 6px solid #f44;
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
    display:flex;
    align-items:center;
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