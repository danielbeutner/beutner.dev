import { h, render, Component } from 'preact';
import htm from 'htm';

const html = htm.bind(h);

class Clock extends Component {
    state = { time: Date.now() };
    timer: NodeJS.Timer;

    // Called whenever our component is created
    componentDidMount() {
        // update time every second
        this.timer = setInterval(() => {
            this.setState({ time: Date.now() });
        }, 1000);
    }

    // Called just before our component will be destroyed
    componentWillUnmount() {
        // stop when not renderable
        clearInterval(this.timer);
    }
    render() {
        let time = new Date().toLocaleTimeString();
        return html`<h1>Hello ${time}!</h1>`;
    }
}

render(html`<${Clock} />`, document.getElementById('clock'));