<template>
    <ion-page>
        <ion-toolbar class="ion-padding-top ion-padding-bottom">
            <ion-buttons class="create-icon">
                <ion-icon :icon="create" slot="end"></ion-icon>
            </ion-buttons>
            <ion-header>Profile</ion-header>
            <ion-avatar>
                <img :src="user.profile_img"/>
                <ion-buttons class="camera-icon">
                    <ion-icon :icon="camera"></ion-icon>
                </ion-buttons>
            </ion-avatar>
            <h2 class="title_name">{{ user.firstname }} {{ user.lastname }}<span>{{ user.role }}</span></h2>
        </ion-toolbar>
        <ion-content fullscreen="true">
            <ion-list class="ion-margin-top">
                <ion-item lines="full">
                    <ion-icon :icon="mail" slot="start" color="primary"></ion-icon>
                    <ion-label>{{ user.email_address }}</ion-label>
                </ion-item>
                <ion-item lines="full">
                    <ion-icon :icon="call" slot="start" color="primary"></ion-icon>
                    <ion-label>{{ user.phonenumber }}</ion-label>
                </ion-item>
                <ion-item lines="full">
                    <ion-icon :icon="location" slot="start" color="primary"></ion-icon>
                    <ion-label>{{ user.address }}</ion-label>
                </ion-item>
            </ion-list>
            <ion-grid>
                <ion-row>
                    <ion-col>
                        <ion-button expand="block" color="dark" size="large" @click="presentActionSheet">Logout</ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonAvatar, IonItem, IonIcon, IonLabel, IonButtons, actionSheetController, loadingController, IonHeader, IonToolbar, IonList, IonCol, IonRow, IonGrid } from '@ionic/vue';
import { mail, call, location, create, home, camera } from 'ionicons/icons';
import { lStore } from '@/functions';

export default defineComponent({
    name: 'SupervisorProfile',
    components: { IonContent, IonPage, IonAvatar, IonItem, IonIcon, IonLabel, IonButtons, IonHeader, IonToolbar, IonList, IonCol, IonRow, IonGrid },
    setup() {
        return { mail, call, location, create, home, camera };
    },
    data() {
        return {
            user: {}
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
    }
});
</script>

<style scoped>
ion-toolbar {
    min-height: 88px;
}

ion-header {
    box-shadow: none; 
    text-align: center; 
    font-size: 22px;
}

ion-avatar {
    width: 150px;
    height: 150px;
    position: relative;
    margin: 20px auto 0;
    text-align: center;
}

ion-avatar img {
    width: 100%;
    max-width: 220px;
    height: 100%;
    padding: 3px;
    border: 5px solid #fff;
}

ion-content {
    text-align: center;
}

ion-content h2 {
    font-size: 26px;
    font-weight: bold;
    color: #1f94db;
    text-align: center;
    margin: 24px 0 30px;
}

.title_name {
    text-align: center;
}

.title_name span {
    display: block;
    font-size: 15px;
    color: #fff;
}

ion-title {
    color: #1f94db !important;
}

ion-list {
    background: none;
    margin-bottom: 30px;
}

ion-item {
    --background: none;
    padding: 12px 0 !important;
    margin-bottom: 6px;
    border-radius: 4px;
}

ion-row {
    background: none;
}

.create-icon {
    position: absolute;
    top: 34px;
    right: 12px;
    font-size: 25px;
    color: #fff;
    display: block;
}

.camera-icon {
    position: absolute;
    bottom: 0;
    font-size: 25px;
    color: #fff;
    display: block;
    right: 0;
}

ion-toolbar {
    background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(58,174,245,1) 30%, rgba(20,139,210,1) 65%); 
}

</style>