<template>
    <ion-page>
        <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <ion-tab-bar slot="bottom">

                <ion-tab-button tab="dashboard" href="/supervisor/dashboard">
                    <ion-icon :icon="home" />
                </ion-tab-button>

                <ion-tab-button tab="employeeschedules" href="/supervisor/employeeschedules">
                    <ion-icon :icon="calendar" />
                </ion-tab-button>

                <ion-tab-button tab="employeelist" href="/supervisor/employeelist">
                    <ion-icon :icon="calendarClear"></ion-icon>
                </ion-tab-button>

                <ion-tab-button tab="profile" href="/supervisor/profile">
                    <ion-icon :icon="person" />
                </ion-tab-button>

            </ion-tab-bar>
        </ion-tabs>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonPage, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton } from '@ionic/vue';
import { home, time, carSport, notifications, person, calendar, calendarClear } from 'ionicons/icons';

export default defineComponent({
    name: 'SupervisorTabs',
    components: { IonPage, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton },
    setup() {
        return { home, time, carSport, notifications, person, calendar, calendarClear };
    }
});
</script>

<style scoped>
ion-tab-button {
    --padding-top: 10px;
    --padding-bottom: 10px;
    --padding-start: 10px;
    --padding-end: 10px;
    border-bottom: 3px solid transparent;
}

ion-tab-button[aria-selected=true] {
    border-bottom: 3px solid #1f94db;
}
</style>
