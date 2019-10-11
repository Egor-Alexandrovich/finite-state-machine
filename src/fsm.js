class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.initial = config.initial;
        this.states = config.states;
        this.statesStack = [this.initial]
        this.undoStack = [];
        this.redoStack =[];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        let  currentState = this.statesStack[this.statesStack.length-1]
      return currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
            this.state = state;
        if (this.state in this.states ) {
        this.statesStack.push(this.state);
        this.redoStack = [];
        this.undoStack = [];
        }
        else {
        throw new Error('Error: state do not exist');
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        this.event = event;
        let currentState = this.getState();
        if (this.event in this.states[currentState].transitions){
          this.statesStack.push(this.states[currentState].transitions[this.event]);
          this.redoStack = [];
          this.undoStack = [];

          return this.getState();
        }
        else {
          throw new Error('Error: event do not exist');
          } 
      }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.statesStack = [this.initial];
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        this.event = event;
        this.result = [];
        if (this.event == undefined) {
            for (let key in this.states){ this.result.push(key)}
        }
        else {
            for (let key in this.states){ 
                if (this.states[key].transitions[this.event] !== undefined){
                    this.result.push(key)
                }
            }
        }
        return this.result;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        let currentStateValue;
        if (this.getState() == this.initial) {
            return false
        }
        else {
            currentStateValue = this.statesStack.pop();
            this.undoStack.push(currentStateValue);
            this.redoStack.push(currentStateValue);
            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.redoStack == 0) {
            return false
        }
        else {
            this.statesStack.push(this.redoStack.pop());
            this.undoStack.pop();
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.statesStack = [this.initial];
        this.undoStack = [];
        this.redoStack =[];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
