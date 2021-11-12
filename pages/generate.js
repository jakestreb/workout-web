import Head from 'next/head'
import React from 'react'
import * as api from '../api/controller';

export default class Generate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      target: {
        name: 'back_day',
        intensity: 5,
        timeMinutes: 45
      },
      isRunning: false,
      workouts: [],
      progress: [],
      selected: [],
    };
  }

  render() {
    return <div className="container">
      <Head>
        <title>Workout</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="horizontal">
          <select value={this.state.target.name} onChange={e => this.handleTargetNameChange(e)}>
            <option value="chest_day">Chest</option>
            <option value="back_day">Back</option>
            <option value="leg_day">Leg</option>
            <option value="arm_day">Arm</option>
            <option value="chest_back_day">Chest/Back</option>
            <option value="shoulder_day">Shoulder</option>
          </select>
          <input
            type="number"
            label="Intensity"
            value={this.state.target.intensity}
            onChange={e => this.handleIntensityChange(e)}
          />
          <input
            type="number"
            label="Time in minutes"
            value={this.state.target.timeMinutes}
            onChange={e => this.handleTimeChange(e)}
          />
        </div>
        <div className="horizontal">
          <div className="vertical">
            {
              !this.state.isRunning ? <button onClick={() => this.startGenerator()} type="button">
              Start
              </button> : null
            }
            {
              this.state.isRunning ? this.state.workouts.map((_, i) => this.renderWorkout(i)) : null
            }
          </div>
          {
            this.state.isRunning && this.state.workouts[0] ? <div className="vertical">
              {
                renderWorkoutStats(this.state.workouts[0], this.state.progress[0])
              }
            </div> : null
          }
        </div>
      </main>

      <style jsx>{`
        .horizontal {
          flex: 1 1 0;
          display: flex;
        }

        .vertical {
          flex: 1 1 0;
          display: flex;
        }
      `}</style>
    </div>;
  }

  renderWorkout(i) {
    return <span>
      {
        this.state.isRunning ? <button
          onClick={async () => {
            const workout = await api.generateNext(i);
            if (workout) {
              const workoutObj = {
                time: timeString(workout.time),
                intensity: workout.intensity.toFixed(1),
                sets: workout.sets.map(s => `${s.exercise} ${s.sets}x${s.reps}`),
                activity: workout.activity
              };
              this.state.workouts.splice(i, 1, workoutObj);
              this.setState({
                workouts: this.state.workouts
              });
            }
          }}
          type="button"
        >
        Next
        </button> : null
      }
      {
        this.state.workouts[i] ? this.renderWorkoutSets(i) : null
      }
    </span>;
  }

  renderWorkoutSets(i) {
    return <ol key="{i}">
      {
        this.state.workouts[i].sets.map((s, i) => <li key="{i}">{ s }</li>)
      }
    </ol>;
  }

  async startGenerator() {
    const { name, intensity, timeMinutes } = this.state.target;
    const workoutCount = await api.startGenerator(name, intensity, timeMinutes);
    this.setState({
      isRunning: true,
      workouts: new Array(workoutCount).fill(null)
    });
    this.getProgress();
  }

  async stopGenerator() {
    if (!this.state.isRunning) {
      return;
    }
    this.setState({ isRunning: false });
    const { name, intensity, timeMinutes } = this.state.target;
    await api.stopGenerator(name, intensity, timeMinutes);
  }

  async getProgress() {
    if (!this.state.isRunning) {
      return;
    }
    const progress = await api.getProgress();
    this.setState({ progress });
    setTimeout(() => this.getProgress(), 500);
  }

  handleTargetNameChange(event) {
    this.stopGenerator();
    const { value } = event.target;
    this.setState({ target: { ...this.state.target, name: value } });
  }

  handleIntensityChange(event) {
    this.stopGenerator();
    const { value } = event.target;
    this.setState({ target: { ...this.state.target, intensity: value } });
  }

  handleTimeChange(event) {
    this.stopGenerator();
    const { value } = event.target;
    this.setState({ target: { ...this.state.target, timeMinutes: value } });
  }
}

function renderWorkoutStats(workout, progress) {
  return <ul>
    <li>{ workout.time }</li>
    <li>{ workout.intensity }</li>
    <li></li>
    {
      activityToList(workout.activity).map(a => <li>{ a }</li>)
    }
    <li></li>
    <li>{ `generated${progress.isDone ? ' all' : ''} ${progress.generated}` }</li>
    <li>{ `remaining ${progress.filtered}` }</li>
  </ul>;
}

function activityToList(activity) {
  return Object.keys(activity)
    .sort((a, b) => activity[b] - activity[a])
    .map(key => `${key}: ${activity[key]}`);
}

function timeString(timeSeconds) {
  const min = Math.floor(timeSeconds / 60);
  let s = `0${Math.floor(timeSeconds % 60)}`;
  s = s.slice(s.length - 2);
  return `${min}:${s}`;
}
