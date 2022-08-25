import { io } from 'socket.io-client';

export default class MultiplayerGame {
    start() {
        console.log('Multiplayer is started');

        const socket = io('http://localhost:3000/');

        socket.on('connect', function () {
            console.log('...connect');
        });
        socket.on('disconnect', function () {
            console.log('...disconnect');
        });


    }
}
