<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script>
import { defineComponent } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  data(){
    return{
      loginPaths: [
        "/home",
        "/splash",
        "/welcome",
        "/register",
        "/registercustomer",
        "/registertechnician",
        "/registerridesharer",
        "/registertowCompany",
        "/login",
        "/verify-email",
        "/forgotpassword",
        "/register",
        "/location-settings",
        "/registerdelivery"
      ],
      interval: null,
      alerted: true,
      alert1: '',
      alert2: '',
      isChecked: false,
      isExecuted: false,
      companyName: 'RentARepair'
    };
  }
});
</script>