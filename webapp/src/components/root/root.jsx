// import "bootstrap/dist/css/bootstrap.css";
import "flatpickr/dist/themes/airbnb.css";
import "./root.css";
/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */
/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-no-literals */
/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

import Joi from "joi-browser";
import Flatpickr from "react-flatpickr";
import axios from "axios";
import Select from "./components/select";

function Task(props) {
    const createAt = new Date(props.item.create_at);
    const dueAt = new Date(props.item.due_at);
    let status, notion, showButton;

    // if (props.sortNotion === "只看发单信息") {
    //   showButton = true;
    // } else {
    //   showButton = false;
    // }

    switch (props.item.status) {
        case 0:
            status = <span style={{ color: "blueviolet" }}>等待接收</span>;
            showButton = true;
            if (props.sortNotion === "只看发单信息") {
                notion = "确认接收";
            } else {
                notion = "取消任务";
            }
            break;
        case 1:
            status = <span style={{ color: "blue" }}>执行中</span>;
            showButton = true;
            if (props.sortNotion === "只看发单信息") {
                notion = "确认完成";
            } else {
                notion = "取消任务";
            }
            break;
        case 2:
            status = <span style={{ color: "green" }}>已完成</span>;
            showButton = false;
            break;
        case 3:
            status = <span style={{ color: "gray" }}>已取消</span>;
            showButton = false;
            break;
        case 4:
            status = <span style={{ color: "orange" }}>已超时</span>;
            showButton = true;
            if (props.sortNotion === "只看发单信息") {
                notion = "确认完成";
            } else {
                notion = "取消任务";
            }
            break;
        default:
            status = <span style={{ color: "red" }}>错误</span>;
            showButton = false;
    }

    return (
        <tr>
            <td>{props.item.task_id}</td>
            <td>
                {createAt.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric"
                }) +
                    " " +
                    createAt.toLocaleTimeString("en-US", {
                        hour12: false,
                        hour: "numeric",
                        minute: "numeric"
                    })}
            </td>
            <td>
                {dueAt.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric"
                }) +
                    " " +
                    dueAt.toLocaleTimeString("en-US", {
                        hour12: false,
                        hour: "numeric",
                        minute: "numeric"
                    })}
            </td>
            <td>{props.item.send_dept}</td>
            <td>{props.item.receive_dept}</td>
            <td>{props.item.room_id}</td>
            <td>{props.item.task_type}</td>
            <td>{props.item.note}</td>
            <td>{status}</td>

            <td>
                {showButton && (
                    <button
                        className="back btn btn-primary btn-sm"
                        onClick={props.onStatusChange}
                    >
                        {notion}
                    </button>
                )}
            </td>
        </tr>
    );
}

class TaskPanel extends Component {
    /* condition1 is a boolean variable.
  It is used to switch between task console view and form view
  */
    state = {
        taskList: [],
        currentDept: "",
        deptOptions: "",
        sortNotion: "",
        condition1: "",
        orderContentOptions: "",
        secondContentType: "",
        form_receiveDept: "",
        orderContentNotReady: "",
        form_orderContent: "",
        secondContentNotReady: "",
        form_secondContent: "",
        form_roomId: "",
        IsSecondSelectorInput: "",
        IsSecondTimeInput: "",
        readySubmit: "",
        note: ""
    };

    instance = ""

    constructor(props) {
        super(props);


        console.log("@@@@@@@", document.cookie)
        this.instance = axios.create({
            baseURL: 'http://47.111.8.31:8065',
            timeout: 1000,
            headers: {
                "X-CSRF-Token": document.cookie.slice(-26).toString()
            }
        });


        /* 真实场景中应该是取用户的数据决定 */
        const currentDept = "前厅部";

        /* 真实场景中应该是取用户的数据决定 */
        const deptOptions = ["前厅部", "客房部", "工程部"];
        const sortNotion = "只看发单信息";

        const orderContentOptions = {
            前厅部: ["预定车辆", "叫醒服务", "搬运行李"],
            客房部: ["配送客房用品", "客房清洁"],
            工程部: ["维修设备"],
            "": ["", "fake2"]
        };

        const secondContentType = {
            预定车辆: "form_secondContent_Time",
            叫醒服务: "form_secondContent_Time",
            搬运行李: "",
            客房清洁: "",
            配送客房用品: [
                "毛巾",
                "牙具套装",
                "拖鞋",
                "吹风机",
                "被子",
                "衣架",
                "饮用水",
                "沐浴用品套装"
            ],
            维修设备: [
                "门锁",
                "花洒",
                "热水器",
                "电视机",
                "空调",
                "床",
                "桌子",
                "椅子"
            ]
        };

        this.state = {
            taskList: [],
            currentDept,
            deptOptions,
            sortNotion,
            condition1: true,
            orderContentOptions,
            secondContentType,
            form_receiveDept: "",
            orderContentNotReady: true,
            form_orderContent: "",
            secondContentNotReady: true,
            form_secondContent: "",
            form_roomId: "",
            note: "",
            date: new Date(),
            IsSecondSelectorInput: false,
            IsSecondTimeInput: false,
            readySubmit: false
        };

        this.fetchTasks();
    }

    //每5s轮询一遍，更新task
    componentDidMount = () => {
        console.log("!!!!!", sessionStorage);
        this.fetchTasks();
        setInterval(() => {
            this.fetchTasks();
        }, 5000);
    }

    fetchTasks = () => {
        this.instance
            .get("/api/v4/tasks")
            .then((res) => {

                console.log(res);
                this.setState({
                    taskList: res.data
                });

            })
            .catch(err => console.log(err));
    };

    /* ************************* */
    getSchema = () => {
        return {
            form_receiveDept: Joi.string()
                .required()
                .label("Receive Department"),
            form_orderContent: Joi.string()
                .required()
                .label("Order Content"),
            form_secondContent_Time: Joi.date()
                .greater("now")
                .required()
                .label("Time info")
        };
    };

    handleSort = () => {
        let { sortNotion } = this.state;

        sortNotion =
            sortNotion === "只看发单信息" ? "只看收单信息" : "只看发单信息";

        // update state
        this.setState({ sortNotion });
    };

    /* tmp refers to taskList */
    filterTask = (tmp, currentDept, sortNotion) => {
        if (sortNotion === "只看发单信息") {
            return tmp.filter(option => option.receive_dept === currentDept);
        }
        if (sortNotion === "只看收单信息") {
            return tmp.filter(option => option.send_dept === currentDept);
        }
    };

    handleCreateTask = () => {
        this.setState({
            condition1: false,
            form_receiveDept: "",
            orderContentNotReady: true,
            form_orderContent: "",
            secondContentNotReady: true,
            form_secondContent: "",
            form_roomId: "",
            note: "",
            date: new Date(),
            IsSecondTimeInput: false,
            IsSecondSelectorInput: false,
            readySubmit: false
        });
    };

    handleSelectorChange = e => {
        const currentDept = e.currentTarget.value;
        console.log("my current pos is: ", currentDept);
        this.setState({ currentDept });
    };

    /* ********** Joi validation  *********** */

    validateProperty = ({ name, value }) => {
        // 这里不能传this.state.data和this.schema给Joi，因为我们只想validate正在input的那个栏
        const schema = this.getSchema();
        const obj = { [name]: value };
        const subSchema = { [name]: schema[name] };
        const result = Joi.validate(obj, subSchema);

        return result.error ? result.error.details[0].message : null;
    };

    validate = () => {
        const errors = {};
        const schema = this.getSchema();
        const { data } = this.state;
        const options = { abortEarly: false };
        const result = Joi.validate(data, schema, options);

        // console.log(result);
        if (!result.error) {
            return null;
        }

        result.error.details.map(detail => {
            errors[detail.path[0]] = detail.message;
        });
        return errors;
    };

    /* ******* Begin form control method   ********** */

    handleReceiveDeptChange = e => {
        const form_receiveDept = e.currentTarget.value;
        console.log("the receive dept is: ", form_receiveDept);
        this.setState({
            form_receiveDept,
            form_orderContent: "",
            secondContentNotReady: true,
            form_secondContent: "",
            form_roomId: "",
            note: "",
            date: new Date(),
            IsSecondTimeInput: false,
            IsSecondSelectorInput: false,
            readySubmit: false
        });

        const errorMessages = this.validateProperty(e.currentTarget); //current input DOM is passed as params
        if (errorMessages) {
            console.log("now is receive dept bar, error is: ", errorMessages);
            this.setState({ orderContentNotReady: true });
        } else {
            this.setState({ orderContentNotReady: false });
        }
    };

    handleOrderContentChange = e => {
        const form_orderContent = e.currentTarget.value;
        console.log("the order content is: ", form_orderContent);
        this.setState({ form_orderContent, readySubmit: false });

        const errorMessages = this.validateProperty(e.currentTarget); //current input DOM is passed as params
        if (errorMessages) {
            console.log("now is order content bar, error is: ", errorMessages);
            this.setState({ secondContentNotReady: true });
        } else {
            this.setState({ secondContentNotReady: false });
        }

        if (this.state.secondContentType[form_orderContent] === "") {
            this.setState({
                IsSecondSelectorInput: false,
                IsSecondTimeInput: false
            });
        } else if (
            this.state.secondContentType[form_orderContent] ===
            "form_secondContent_Time"
        ) {
            this.setState({
                IsSecondSelectorInput: false,
                IsSecondTimeInput: true
            });
        } else {
            this.setState({
                IsSecondSelectorInput: true,
                IsSecondTimeInput: false
            });
        }
    };

    handleSecondContentChange = e => {
        const form_secondContent = e.currentTarget.value;
        console.log("the second content is: ", form_secondContent);
        this.setState({ form_secondContent });

        const errorMessages = this.validateProperty(e.currentTarget); //current input DOM is passed as params
        if (errorMessages) {
            console.log("now is second content bar, error is: ", errorMessages);
            this.setState({ readySubmit: false });
        } else {
            this.setState({ readySubmit: true });
        }
    };

    handleTimeChange = date => {
        this.setState({ date });
        if (
            this.state.IsSecondSelectorInput === false &&
            this.state.IsSecondTimeInput === false
        ) {
            this.setState({ readySubmit: true });
        }
    };

    handleRoomChange = e => {
        const form_roomId = e.currentTarget.value;
        console.log("the room content is: ", form_roomId);
        this.setState({ form_roomId });
    };

    handleNoteChange = e => {
        const note = e.currentTarget.value;
        console.log("the note content is: ", note);
        this.setState({ note });
    };

    handleSubmit = e => {
        e.preventDefault();
        const {
            date,
            currentDept,
            form_receiveDept,
            form_roomId,
            form_orderContent,
            note,
            IsSecondTimeInput
        } = this.state;
        let { form_secondContent } = this.state;

        if (IsSecondTimeInput) {
            form_secondContent = new Date(form_secondContent);
            form_secondContent =
                form_secondContent.toLocaleDateString() +
                " " +
                form_secondContent.toLocaleTimeString();
        }


        const due_at = date;
        const send_dept = currentDept;
        const receive_dept = form_receiveDept;
        const room_id = form_roomId;
        const task_type = `${form_orderContent}：${form_secondContent}`;
        const status = 0;

        //发送给后端，现在先模拟一个本地添加
        this.instance
            .post(`/api/v4/tasks/1/insert?due_at=${0}&send_dept=${send_dept}&receive_dept=${receive_dept}&room_id=${room_id}&task_type=${task_type}&note=${note} &status=${status}`,
            )
            .then((res) => {
                console.log("create success! ", res);
            })
            .catch(err => console.log(err));

        this.setState({ condition1: true });
    };

    handleBack = e => {
        e.preventDefault();
        this.setState({ condition1: true });
    };

    //！！！！需要向后端交互，API
    handleStatusChange = task_id => {
        let taskList = [...this.state.taskList];
        const { sortNotion } = this.state;
        taskList = taskList.map(item => {
            if (item.task_id === task_id) {
                switch (item.status) {
                    case 0:
                        if (sortNotion === "只看发单信息") {
                            this.instance
                                .post(`/api/v4/tasks/${task_id}/update_status_quick?status=1`)
                                .then((res) => {
                                    console.log("change status success! ", res);
                                })
                        } else {
                            this.instance
                                .post(`/api/v4/tasks/${task_id}/update_status_quick?status=3`)
                                .then((res) => {
                                    console.log("change status success! ", res);
                                })
                        }
                        break;
                    case 1:
                        if (sortNotion === "只看发单信息") {
                            this.instance
                                .post(`/api/v4/tasks/${task_id}/update_status_quick?status=2`)
                                .then((res) => {
                                    console.log("change status success! ", res);
                                })
                        } else {
                            this.instance
                                .post(`/api/v4/tasks/${task_id}/update_status_quick?status=3`)
                                .then((res) => {
                                    console.log("change status success! ", res);
                                })
                        }
                        break;
                    case 4:
                        if (sortNotion === "只看发单信息") {
                            this.instance
                                .post(`/api/v4/tasks/${task_id}/update_status_quick?status=2`)
                                .then((res) => {
                                    console.log("change status success! ", res);
                                })
                        } else {
                            this.instance
                                .post(`/api/v4/tasks/${task_id}/update_status_quick?status=3`)
                                .then((res) => {
                                    console.log("change status success! ", res);
                                })
                        }
                        break;
                    default:
                        console.log("case exception appeared!");
                }
            }
            return item;
        });
        this.setState({ taskList });
    };

    render() {
        /* 解构赋值区域 */
        const {
            taskList,
            sortNotion,
            currentDept,
            deptOptions,
            condition1,
            orderContentOptions,
            secondContentType,
            IsSecondSelectorInput,
            form_receiveDept,
            form_orderContent,
            form_secondContent,
            form_roomId,
            orderContentNotReady,
            secondContentNotReady,
            readySubmit,
            note,
            date,
            IsSecondTimeInput
        } = this.state;

        /* 根据sortNotion来改变页面呈现的任务, 不影响state */
        const filteredtaskList = this.filterTask(
            taskList,
            currentDept,
            sortNotion
        );

        const orderContentList = orderContentOptions[form_receiveDept];
        return (
            <React.Fragment>
                {condition1 && (
                    <div className="card">
                        <div className="card-header header">
                            <FormattedMessage
                                id="root.title"
                                defaultMessage="任务中心"
                                className="header-text"
                            />
                            <button
                                type="button"
                                className="btn btn-danger close-btn"
                                onClick={this.props.onClose}
                            >
                                X
                            </button>
                        </div>
                        <div className="table-responsive">
                            <table
                                id="taskListTable"
                                className="table  table-striped"
                            >
                                <thead>
                                    <tr>
                                        <th>
                                            <FormattedMessage
                                                id="panel.id"
                                                defaultMessage="任务编码"
                                            />
                                        </th>
                                        <th>
                                            <FormattedMessage
                                                id="panel.createTime"
                                                defaultMessage="任务创建时间"
                                            />
                                        </th>
                                        <th>
                                            <FormattedMessage
                                                id="panel.dueTime"
                                                defaultMessage="要求完成时间"
                                            />
                                        </th>
                                        <th>
                                            <FormattedMessage
                                                id="panel.send_dept"
                                                defaultMessage="发单部门"
                                            />
                                        </th>
                                        <th>
                                            <FormattedMessage
                                                id="panel.receive_dept"
                                                defaultMessage="收单部门"
                                            />
                                        </th>
                                        <th>
                                            <FormattedMessage
                                                id="panel.room"
                                                defaultMessage="客房号"
                                            />
                                        </th>
                                        <th>
                                            <FormattedMessage
                                                id="panel.task"
                                                defaultMessage="任务内容"
                                            />
                                        </th>
                                        <th>
                                            <FormattedMessage
                                                id="panel.note"
                                                defaultMessage="备注"
                                            />
                                        </th>
                                        <th>
                                            <FormattedMessage
                                                id="panel.status"
                                                defaultMessage="状态"
                                            />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredtaskList.map(item => (
                                        <Task
                                            key={item[0]}
                                            item={item}
                                            sortNotion={this.state.sortNotion}
                                            onStatusChange={() =>
                                                this.handleStatusChange(
                                                    item.task_id
                                                )
                                            }
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <button
                                className="btn btn-primary btn-sm mr-2"
                                onClick={this.handleSort}
                            >
                                {sortNotion}
                            </button>
                            <button
                                className="btn btn-primary btn-sm mr-2"
                                onClick={this.handleCreateTask}
                            >
                                新建任务单
                            </button>
                            <Select
                                name="部门"
                                label="您所属的部门是 "
                                value={currentDept}
                                options={deptOptions}
                                onChange={this.handleSelectorChange}
                                small={true}
                            />
                        </div>
                    </div>
                )}
                {!condition1 && (
                    <div className="card">
                        <p className="card-header text-center py-4 form-header">
                            <button
                                className="back btn-primary btn-sm"
                                onClick={this.handleBack}
                            >
                                取消
                            </button>
                            <div className="form-title">
                                <strong>创建新任务单</strong>
                            </div>
                        </p>
                        <form className="Form" onSubmit={this.handleSubmit}>
                            <div className="w-100">收单部门</div>
                            <p className="form-selector">
                                <Select
                                    name="form_receiveDept"
                                    value={form_receiveDept}
                                    options={deptOptions.filter(
                                        option => option != currentDept
                                    )}
                                    onChange={this.handleReceiveDeptChange}
                                    small={false}
                                    disabled={false}
                                />
                            </p>
                            <div className="w-100">任务类别</div>
                            <p className="form-selector">
                                <Select
                                    name="form_orderContent"
                                    value={form_orderContent}
                                    options={orderContentList}
                                    onChange={this.handleOrderContentChange}
                                    small={false}
                                    disabled={orderContentNotReady}
                                />
                            </p>
                            {!orderContentNotReady &&
                                !secondContentNotReady &&
                                IsSecondSelectorInput && (
                                    <React.Fragment>
                                        <div className="w-100">
                                            物品/设备名称
                                        </div>
                                        <p className="form-selector">
                                            <Select
                                                name="form_orderContent"
                                                value={form_secondContent}
                                                options={
                                                    secondContentType[
                                                    form_orderContent
                                                    ]
                                                }
                                                onChange={
                                                    this
                                                        .handleSecondContentChange
                                                }
                                                small={false}
                                                disabled={secondContentNotReady}
                                            />
                                        </p>
                                    </React.Fragment>
                                )}
                            {!orderContentNotReady &&
                                !secondContentNotReady &&
                                IsSecondTimeInput && (
                                    <React.Fragment>
                                        <div className="w-100">
                                            客人指定时间
                                        </div>
                                        <p className="form-selector">
                                            <Flatpickr
                                                data-enable-time={true}
                                                value={form_secondContent}
                                                options={{
                                                    minDate: "today",
                                                    maxDate: new Date().fp_incr(
                                                        7
                                                    ),
                                                    time_24hr: true
                                                }}
                                                onChange={date =>
                                                    this.setState({
                                                        form_secondContent: date,
                                                        readySubmit: true
                                                    })
                                                }
                                            />
                                        </p>
                                    </React.Fragment>
                                )}
                            {!orderContentNotReady && !secondContentNotReady && (
                                <React.Fragment>
                                    <div className="w-100 my-4" />
                                    <p className="form-selector">
                                        <div className="input-group textinput">
                                            <div className="input-group-prepend room">
                                                <span className="input-group-text">
                                                    客房号
                                                </span>
                                            </div>
                                            <textarea
                                                className="room-content form-control"
                                                aria-label="With textarea"
                                                value={form_roomId}
                                                onChange={this.handleRoomChange}
                                                required={true}
                                            />
                                        </div>
                                    </p>
                                    <div className="w-100 my-4" />
                                    <p className="form-selector">
                                        <div className="input-group textinput">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    备注
                                                </span>
                                            </div>
                                            <textarea
                                                className="form-control"
                                                aria-label="With textarea"
                                                placeholder="输入备注信息..."
                                                value={note}
                                                onChange={this.handleNoteChange}
                                            />
                                        </div>
                                    </p>
                                    <div className="w-100">要求完成时间</div>
                                    <p className="form-selector">
                                        <Flatpickr
                                            data-enable-time={true}
                                            value={date}
                                            options={{
                                                minDate: "today",
                                                maxDate: new Date().fp_incr(7),
                                                time_24hr: true
                                            }}
                                            onChange={date =>
                                                this.handleTimeChange(date)
                                            }
                                        />
                                    </p>
                                </React.Fragment>
                            )}
                            {!orderContentNotReady &&
                                !secondContentNotReady &&
                                readySubmit && (
                                    <React.Fragment>
                                        <div className="w-100 my-2">
                                            提交任务单前请最后检查一遍任务内容和时间信息
                                        </div>
                                        <button className="btn btn-primary btn-sm m-3">
                                            提交任务单
                                        </button>
                                    </React.Fragment>
                                )}
                        </form>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

const Root = ({ visible, close, theme }) => {
    if (!visible) {
        return null;
    }


    const style = getStyle(theme);
    return (
        <div style={style.backdrop}>
            <div style={style.modal}>
                <TaskPanel onClose={close} />
            </div>
        </div>
    );
};

Root.propTypes = {
    visible: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
};

const getStyle = theme => ({
    backdrop: {
        position: "absolute",
        display: "flex",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.50)",
        zIndex: 2000,
        alignItems: "center",
        justifyContent: "center"
    },
    modal: {
        "max-height": "50%",
        width: "50%",
        padding: "0.4rem",
        border: "1px solid #000",
        "border-radius": "0.5rem",
        color: theme.centerChannelColor,
        backgroundColor: theme.centerChannelBg
    }
});

export default Root;
