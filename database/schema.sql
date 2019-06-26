DROP TABLE IF EXISTS Tasks CASCADE;
CREATE TABLE Tasks (
  TaskId SERIAL PRIMARY KEY,
  CreateAt TIMESTAMP DEFAULT current_timestamp,
--   confirm_at TIMESTAMP DEFAULT current_timestamp,
--   timestamp TIMESTAMP DEFAULT current_timestamp,
  SendDept TEXT,
  ReceiveDept TEXT,
  RoomId INT,
  TaskType TEXT,
  Note TEXT,
  Status INT DEFAULT 0 -- 0 in progress, 1 complete
)CHARACTER SET = utf8;

INSERT INTO Tasks (SendDept, ReceiveDept, RoomId, TaskType, Note, Status) VALUES ("前厅部", "客房部", 503, "运送矿泉水", "evan", 1);
INSERT INTO Tasks (SendDept, ReceiveDept, RoomId, TaskType, Note, Status) VALUES ("前厅部", "工程部", 101, "维修空调", "gree", 2);
INSERT INTO Tasks (SendDept, ReceiveDept, RoomId, TaskType, Note, Status) VALUES ("前厅部", "餐饮部", 907, "订餐", "steak", 3);