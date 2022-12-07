<template>
    <ion-page>
        <BackButton bgColor="transparent"></BackButton>
        <ion-content fullscreen="true">
            <div class="form-container">
                <div class="form-header">
                    <img src="../../images/logo.png" alt="Logo"/>
                    <ion-text color="primary">
                        <h2>Welcome</h2>
                    </ion-text>
                    <p>Sign in to continue!</p>
                </div>
                <div class="form-input">
                    <ion-item>
                        <ion-label position="stacked">Username</ion-label>
                        <ion-input type="email" v-model="loginInput" placeholder="Enter username here"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Password</ion-label>
                        <ion-input type="password" v-model="password" placeholder="Enter password here" id="password"></ion-input>
                        <a class="eyeCon" v-if="password != ''" href="javascript:;" @click="showPass('#password')">
                            <ion-icon :class="{ showIcon : !showIcon }" :icon="eye"></ion-icon>
                            <ion-icon :class="{ showIcon2 : !showIcon2 }" :icon="eyeOff"></ion-icon>
                        </a>
                    </ion-item>
                    <div class="form-input-footer">
                        <ion-item>
                            <ion-checkbox slot="start"></ion-checkbox>
                            <ion-label>Remember Me</ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label><a @click="$router.push('/forgotpassword')">Forgot Password?</a></ion-label>
                        </ion-item>
                    </div>
                </div>
                <ion-button expand="block" size="large" :disabled="formLoading" v-on:click="login">
                    <span v-if="!formLoading">Login</span>
                    <span v-if="formLoading">
                        <ion-spinner name="dots"></ion-spinner>
                    </span>
                </ion-button>

                <ion-text class="privacy">By logging in, I agree to 4Angels Healthcare Staffing's <a @click="setOpen(true)" href="javascript:;">Terms of Service</a> and <a @click="setOpen2(true)" href="javascript:;">Privacy Policy</a></ion-text>
            </div>

            <ion-modal :is-open="isOpen">
                <ion-header>
                    <ion-toolbar>
                        <ion-title>Terms of Service</ion-title>
                        <ion-buttons @click="setOpen(false)" slot="end">
                            <ion-icon :icon="close"></ion-icon>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni illum quidem recusandae ducimus quos reprehenderit. Veniam, molestias quos, dolorum consequuntur nisi deserunt omnis id illo sit cum qui. Eaque,
                    dicta.</p>
                </ion-content>
            </ion-modal>

            <ion-modal :is-open="isOpen2">
                <ion-header>
                    <ion-toolbar>
                        <ion-title>Privacy Policy</ion-title>
                        <ion-buttons @click="setOpen2(false)" slot="end">
                            <ion-icon :icon="close"></ion-icon>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni illum quidem recusandae ducimus quos reprehenderit. Veniam, molestias quos, dolorum consequuntur nisi deserunt omnis id illo sit cum qui. Eaque,
                    dicta.</p>
                </ion-content>
            </ion-modal>

        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonText, IonItem, IonLabel, IonInput, IonButton, IonCheckbox, IonSpinner, IonModal } from '@ionic/vue';
import { axios, validateForm, openToast, lStore } from '@/functions';
import { eye, eyeOff, close } from 'ionicons/icons';
import BackButton from '@/views/BackButton';

export default defineComponent({
    name: 'LoginPage',
    components: { IonContent, IonPage, IonText, IonItem, IonLabel, IonInput, IonButton, IonCheckbox, IonSpinner, BackButton, IonModal },
    setup() {
        return { close };
    },
    data() {
        return{
            loginInput: "",
            password: "",
            formLoading: false,
            showIcon: true,
            showIcon2: false,
            eye,
            eyeOff,
            isOpen: false,
            isOpen2: false,
        };
    },
    methods: {
        setOpen(isOpen) {
            this.isOpen = isOpen;
        },
        setOpen2(isOpen2) {
            this.isOpen2 = isOpen2;
        },
        login() {
            let rules = {password:{isRequired:true}};
            let input = {password:this.password};
            input.email = this.loginInput;
            rules.callback = ()=>{openToast('All fields are required!', 'danger')};
            
            const valid = validateForm(input,rules);
            if(!valid.allValid) return;

            console.log(this.loginInput);
            
            this.formLoading = true;

            axios.post('users/login',null,{
                login: this.loginInput,
                password: this.password
            }).catch(err=>{
                console.log(err.response);
                openToast('Something went wrong...', 'danger');
            }).then(res=>{
                console.log(res.data);
                if(res.data.msg === 'user not found') openToast('User not registered!', 'danger');
                if(res.data.msg === 'wrong password') openToast('Wrong password!', 'danger');
                this.formLoading = false;
                
                if(res.data.success) {
                    lStore.set('user_id',res.data.result.id);
                    lStore.set('user_token',res.data.token);
                    lStore.set('user_info', res.data.result);
                    if(res.data.result.role != 'Employee'){
                        openToast('For Employee login only!', 'danger');
                        return;
                    }
                    openToast('Login Success', 'primary');
                    this.$router.replace('/employee/dashboard');
                }
            });
        },
        showPass(e) {
            document.querySelector("#password input").focus();
            let inType = document.querySelector(e);
            if (inType.type === "password") {
                inType.type = "text";
                this.showIcon2 = true;
                this.showIcon = false;
            } else {
                inType.type = "password";
                this.showIcon = true;
                this.showIcon2 = false;
            }
        },
    }
});
</script>

<style scoped>
ion-header {
    box-shadow: none;
}

ion-modal ion-icon {
    font-size: 20px;
}

ion-title {
    font-size: 19px;
}

.privacy{
    text-align: center;
    margin-top: 60px;
    font-size: 14px;
}
.form-container {
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
	align-items: stretch;
    width: 100%;
    height: auto;
}

.form-container p {
    text-align: center;
}

.form-header {
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
	align-items: center;
    margin-bottom: 30px;
}

.form-header img {
    width: 100%;
    max-width: 200px;
    margin-bottom: 15px;
}

.form-header h2 {
    font-size: 26px;
    font-weight: bold;
    color: #1f94db;
    margin: 0 0 5px;
}

.form-header p {
    margin: 0;
}

.form-input-footer {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
}

.form-input-footer ion-item {
    --border-width: 0;
    --padding-start: 0;
    --padding-end: 0;
    --inner-padding-start: 0;
    --inner-padding-end: 0;
    --background-activated: none;
    --border-radius: 0;
    --background: none !important;
    margin: 0;
}

.form-input-footer ion-label {
    margin: 0 !important;
}

.form-input-footer ion-checkbox {
    margin: 0 10px 0 0 !important;
}

.eyeCon {
	position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    z-index: 999;
    height: 100%;
    display: flex;
    align-items: center;
}

.eyeCon ion-icon {
    width: 20px;
    height: 20px;
}

.showIcon, .showIcon2 {
    display: none;
}
</style>