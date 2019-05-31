/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */
/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-no-literals */
/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {FormattedMessage} from 'react-intl';

function Task(props) {
    const timestamp = new Date(props.item.timestamp);
    let status;
    switch (props.item.status) {
    case 0: status = <span style={{color: 'orange'}}>In progress</span>;
        break;
    case 1: status = <span style={{color: 'green'}}>Complete</span>;
        break;
    case 2: status = <span style={{color: 'red'}}>Cancelled</span>;
        break;
    default: status = <span style={{color: 'gray'}}>Error</span>;
    }
    return (
        <tr>
            <td>{props.item.tid}</td>
            <td>{timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString()}</td>
            <td>{props.item.dept}</td>
            <td>{props.item.room}</td>
            <td>{props.item.task}</td>
            <td>{props.item.note}</td>
            <td>{status}</td>
        </tr>);
}

class TaskPanel extends Component {
    constructor(props) {
        super(props);
        let tmp = [{tid: 59, timestamp: '2019-05-21T07:00:33.563Z', dept: 'Housekeeping', room: 503, task: 'Send water', note: '', status: 1}, {tid: 58, timestamp: '2019-05-21T06:47:39.898Z', dept: 'Bellservice', room: 117, task: 'Get luggage', note: '', status: 1}];
        tmp = tmp.map((item) => <Task item={item}/>);
        this.state = {
            taskHistory: tmp,
        };
    }

    fetchTaskHistory() {
        fetch('/api/tasks').then((res) => {
            return res.json();
        }).then((data) => {
            const tmp = data.map((item) => <Task item={item}/>);
            this.setState({
                taskHistory: tmp,
            });
        }).
            catch((err) => console.log(err));
    }

    render() {
        return (
            <div className='card'>
                <div className='card-header'>
                    <FormattedMessage
                        id='root.title'
                        defaultMessage='任务面板'
                    />
                </div>
                <div className='table-responsive'>
                    <table
                        id='TaskHistoryTable'
                        className='table  table-striped'
                    >
                        <thead><tr>
                            <th>
                                <FormattedMessage
                                    id='panel.id'
                                    defaultMessage='任务编码'
                                />
                            </th>
                            <th>
                                <FormattedMessage
                                    id='panel.time'
                                    defaultMessage='时间'
                                />
                            </th>
                            <th>
                                <FormattedMessage
                                    id='panel.dept'
                                    defaultMessage='执行部门'
                                />
                            </th>
                            <th>
                                <FormattedMessage
                                    id='panel.room'
                                    defaultMessage='客房号码'
                                />
                            </th>
                            <th>
                                <FormattedMessage
                                    id='panel.task'
                                    defaultMessage='任务内容'
                                />
                            </th>
                            <th>
                                <FormattedMessage
                                    id='panel.note'
                                    defaultMessage='备注'
                                />
                            </th>
                            <th>
                                <FormattedMessage
                                    id='panel.status'
                                    defaultMessage='状态'
                                />
                            </th>
                        </tr></thead>
                        <tbody>
                            {this.state.taskHistory}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

const Root = ({visible, close, theme}) => {
    if (!visible) {
        return null;
    }

    const style = getStyle(theme);

    // let tmp = [{tid: 59, timestamp: '2019-05-21T07:00:33.563Z', dept: 'Housekeeping', room: 503, task: 'Send water', note: '', status: 1}, {tid: 58, timestamp: '2019-05-21T06:47:39.898Z', dept: 'Bellservice', room: 117, task: 'Get luggage', note: '', status: 1}];
    // tmp = tmp.map((item) => <Task item={item}/>);

    return (
        <div
            style={style.backdrop}
            onClick={close}
        >
            <div style={style.modal}>
                <TaskPanel/>
                {/* <TaskPanel2 taskHistory={tmp}/> */}
            </div>
        </div>
    );
};

Root.propTypes = {
    visible: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
};

const getStyle = (theme) => ({
    backdrop: {
        position: 'absolute',
        display: 'flex',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.50)',
        zIndex: 2000,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        height: '750px',
        width: '1200px',
        padding: '1em',
        color: theme.centerChannelColor,
        backgroundColor: theme.centerChannelBg,
    },
});

export default Root;
