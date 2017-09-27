
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');
import Vue from 'vue';

// For auto scroll
import VueChatScroll from 'vue-chat-scroll';
Vue.use(VueChatScroll);

import Toaster from 'v-toaster';
import 'v-toaster/dist/v-toaster.css'

Vue.use(Toaster, {timeout: 5000});
/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('message', require('./components/Message.vue'));

const app = new Vue({
    el: '#app',
    data: {
    	message: '',
    	chat: {
    		message: [],
    		user: [],
    		color: [],
    		time: []
    	},
    	typing: false,
    	numberOfUsers: 0
    },
    watch: {
    	message() {
    		Echo.private('chat')
    			.whisper('typing', {
    				message: this.message
    			});
    	}
    },
    methods: {
    	send() {
    		if (this.message.length) {
	    		console.log(this.message);
    			this.chat.message.push(this.message);
    			this.chat.user.push('You');
    			this.chat.color.push('default');
    			this.chat.time.push(this.getTime());
    			const data = {
	    			message: this.message
	    		};
	    		this.message = '';

	    		axios.post('/send', data)
	    		.then((response) => {
	    			console.log(response, 'Message send.');
	    		})
	    		.catch((error) => {
	    			console.log(error.response, 'Failed to send message.');
	    		})
    		}
    	},
    	getTime() {
    		const time = new Date();
    		return time.getHours() + ':' + time.getMinutes();
    	}
    },
    mounted() {
		console.log('Listening to chatEvent...');
    	Echo.private('chat')
    		.listen('ChatEvent', (e) => {
    			this.chat.message.push(e.message);
    			this.chat.user.push(e.user.name);
    			this.chat.color.push('warning');
    			this.chat.time.push(this.getTime());
    			console.log(e, 'CHANNEL CHAT');
    		})
    		.listenForWhisper('typing', (e) => {
    			if (e.message) {
    				this.typing = true;
    			} else {
    				this.typing = false;
    			}
    			console.log(this.typing, 'Is typing...');
    		});
    	//
    	Echo.join('chat')
    		.here((users) => {
    			console.log(users, 'USERS');
    			this.numberOfUsers = users.length;
    		})
    		.joining((user) => {
    			this.numberOfUsers++;
    			this.$toaster.success(user.name + ' is join the chat room.');
    			console.log(user, 'JOINING USER');
    		})
    		.leaving((user) => {
    			this.numberOfUsers--;
    			this.$toaster.warning(user.name + ' is leave chat room.');
    			console.log(user, 'LEAVING USER');
    		});

    }
});
