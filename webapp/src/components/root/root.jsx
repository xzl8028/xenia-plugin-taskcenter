/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */
/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-no-literals */
/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {FormattedMessage} from 'react-intl';

function Task(props) {
    const createAt = new Date(props.item.create_at);
    let status;
    switch (props.item.status) {
    case 0: status = <span style={{color: 'blueviolet'}}>等待接收</span>;
        break;
    case 1: status = <span style={{color: 'blue'}}>执行中</span>;
        break;
    case 2: status = <span style={{color: 'green'}}>已完成</span>;
        break;
    case 3: status = <span style={{color: 'gray'}}>已取消</span>;
        break;
    case 4: status = <span style={{color: 'orange'}}>已超时</span>;
        break;
    default: status = <span style={{color: 'red'}}>错误</span>;
    }
    return (
        <tr>
            <td>{props.item.task_id}</td>
            <td>{createAt.toLocaleDateString() + ' ' + createAt.toLocaleTimeString()}</td>
            <td>{props.item.send_dept}</td>
            <td>{props.item.receive_dept}</td>
            <td>{props.item.room_id}</td>
            <td>{props.item.task_type}</td>
            <td>{props.item.note}</td>
            <td>{status}</td>
        </tr>);
}




class TaskPanel extends Component {
    constructor(props) {
        super(props);

        // let tmp = [{tid: 1001, timestamp: '2019-05-21T07:00:33.563Z', dept: '客房部', room: 503, task: '运送矿泉水', note: '', status: 2},
        //     {tid: 1002, timestamp: '2019-05-21T06:47:39.898Z', dept: '礼宾部', room: 117, task: '搬运行李', note: '', status: 2},
        //     {tid: 1003, timestamp: '2019-05-21T06:47:39.898Z', dept: '工程部', room: 302, task: '维修空调', note: '', status: 2},
        //     {tid: 1004, timestamp: '2019-05-21T06:47:39.898Z', dept: '客房部', room: 506, task: '运送毛巾', note: '', status: 3},
        //     {tid: 1005, timestamp: '2019-05-21T06:47:39.898Z', dept: '礼宾部', room: 711, task: '搬运行李', note: '', status: 4},
        //     {tid: 1006, timestamp: '2019-05-21T06:47:39.898Z', dept: '礼宾部', room: 309, task: '预订车辆', note: '今天7pm前往萧山机场', status: 1},
        //     {tid: 1007, timestamp: '2019-05-21T06:47:39.898Z', dept: '客房部', room: 401, task: '运送牙具', note: '', status: 1},
        //     {tid: 1008, timestamp: '2019-05-21T06:47:39.898Z', dept: '工程部', room: 912, task: '维修马桶', note: '', status: 1},
        //     {tid: 1009, timestamp: '2019-05-21T06:47:39.898Z', dept: '客房部', room: 811, task: '运送沐浴露', note: '', status: 0},
        //      {tid: 1010, timestamp: '2019-05-21T06:47:39.898Z', dept: '客房部', room: 509, task: '运送充电器', note: 'iPhone X', status: 0}];

        let tmp = [];
        tmp = tmp.map((item) => <Task item={item}/>);
        this.state = {
            taskHistory: tmp,
        };
        this.fetchTaskHistory = this.fetchTaskHistory.bind(this);
        this.fetchTaskHistory();
    }

    fetchTaskHistory() {
        fetch('/api/v4/tasks').then((res) => {
            return res.json();
        }).then((data) => {
            const tmp = data.map((item) => <Task item={item}/>);
            this.setState({
                taskHistory: tmp,
            });
        }).
            catch((err) => console.log(err));
    }

    handleCreateTask

    render() {
        return (
            <div className='card'>
                <div className='card-header'>
                    <FormattedMessage
                        id='root.title'
                        defaultMessage='任务中心'
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
                                    id='panel.send_dept'
                                    defaultMessage='发单部门'
                                />
                            </th>
                            <th>
                                <FormattedMessage
                                    id='panel.receive_dept'
                                    defaultMessage='收单部门'
                                />
                            </th>
                            <th>
                                <FormattedMessage
                                    id='panel.room'
                                    defaultMessage='客房号'
                                />
                            </th>
                            <th>
                                <FormattedMessage
                                    id='panel.task'
                                    defaultMessage='任务类别'
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
                <div>
                    <button class="btn btn-primary btn-sm mr-3" onClick={handleCreateTask}> 创建任务单 </button>
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
    return (
        <div
            style={style.backdrop}
            onClick={close}
        >
            <div style={style.modal}>
                <TaskPanel/>
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
