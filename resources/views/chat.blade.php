<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Realtime CHAT!</title>
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<link rel="stylesheet" type="text/css" href="{{ asset('css/app.css') }}">
	<style>
		.list-group {
			overflow-y: scroll;
			height: 250px;
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="row" id="app">
			<div class="offset-4 col-4 offset-sm-1 col-sm-10">
				<ul class="list-group" v-chat-scroll>
					<li class="list-group-item active">Cras justo odio <span class="badge badge-pill badge-warning">@{{numberOfUsers}}</span></li>
					<div class="badge badge-pill badge-default" v-if="typing">Typing...</div>
					<message
						v-for="(value, index) in chat.message"
						:color="chat.color[index]"
						:user="chat.user[index]"
						:time="chat.time[index]"
					>@{{value}}</message>
				</ul>
				<input 
					type="text" 
					class="form-control" 
					v-model="message"
					@keyup.enter="send()"
					placeholder="Type your message here..."
				/>
			</div>
		</div>
	</div>
	<script src="{{ asset('js/app.js') }}"></script>
</body>
</html>