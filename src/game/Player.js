class Player {
    constructor(socket) {
        this.$socket = socket;
        this.$selectedGesture = null;
        this.$winner = false;
        this.init();
    }
    init() {
        // Set default username
        this.$socket.username = 'Anonymous';
    }
    get username() {
        return this.$socket.username;
    }
    get id() {
        return this.$socket.id;
    }
    set selectedGesture(gesture) {
        this.$selectedGesture = gesture;
    }
    get selectedGesture() {
        return this.$selectedGesture;
    }
}

export default Player;