import React, { Component } from "react";
import { Button, Input, Collapse, Modal, Table, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Form, Label, FormGroup } from "reactstrap";

const { Panel } = Collapse;

type EmployeeSkillsProps = {
  data: {
    employeeSkillsData: [];
  };
  submit: (any) => Promise<void>;
};
type EmployeeSkillsState = {
  isOpenModal: boolean;
  dataSource: [];
  columns: any[];
  name: string;
  color: string;
};

class EmployeeSkills extends Component<
  EmployeeSkillsProps,
  EmployeeSkillsState
> {
  state: EmployeeSkillsState = {
    isOpenModal: false,

    dataSource: [],

    columns: [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (name) => <span>{name}</span>,
      },
      {
        title: "Action",
        key: "action",
        render: (text, record, index) => (
          <Space>
            <EditOutlined color="blue" />
            {index === 0 ? "" : <DeleteOutlined color="blue" />}
          </Space>
        ),
      },
    ],

    name: "",
    color: "",
  };

  modalToggle = (event) => {
    event.stopPropagation();
    this.setState({
      isOpenModal: !this.state.isOpenModal,
    });
  };

  onChangeColor = (color) => {
    this.setState({
      color: color.hex,
    });
  };

  addPluseButton = () => (
    <Button
      onClick={(event) => this.modalToggle(event)}
      type="primary"
      className="d-flex align-items-center"
      icon={<PlusOutlined />}
    >
      Añadir
    </Button>
  );

  componentDidUpdate = (prevProps) => {
    if (prevProps !== this.props) {
      this.setState({
        dataSource: this.props.data.employeeSkillsData,
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    var { name } = this.state;
    var data = { name };
    this.props.submit(data);
  };

  render() {
    return (
      <>
        <Collapse defaultActiveKey={["1"]}>
          <Panel
            header="Habilidades de los empleados"
            key="1"
            extra={this.addPluseButton()}
          >
            <Table
              columns={this.state.columns}
            //   rowKey={(record) => record._id}
              pagination={false}
              dataSource={this.state.dataSource}
            />
          </Panel>
        </Collapse>
        <Modal
          title="Habilidades de los empleados"
          visible={this.state.isOpenModal}
          width={800}
          footer={""}
          onCancel={this.modalToggle}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="exampleEmail">Nombre</Label>
              <Input
                type="text"
                placeholder="Nombre"
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value })}
                required
              />
            </FormGroup>
            <Space>
              <Button type="primary" htmlType="submit">
                Accept
              </Button>
              <Button type="primary" onClick={this.modalToggle}>
                Cancel
              </Button>
            </Space>
          </Form>
        </Modal>
      </>
    );
  }
}

export default EmployeeSkills;
