import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Alert, Row, Col, Card, Form, Input, Select, Button, Modal, Table, Divider, Switch } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, item } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="部门信息"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="部门名称">
        {form.getFieldDecorator('name', {
          initialValue: item.name,
          rules: [{ required: true, message: '不能为空...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="是否启用">
        {form.getFieldDecorator('enabled', {
          initialValue: item.enabled,
        })(
          <Switch checkedChildren="启用" unCheckedChildren="停用" />
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ department, loading }) => ({
  department,
  loading: loading.models.department,
}))
@Form.create()
export default class DepartmentList extends PureComponent {
  state = {
    modalVisible: false,
  };

  componentDidMount() {
    const { department, dispatch } = this.props;
    if (department.list.length === 0)
      dispatch({ type: 'department/list' });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'department/list',
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      dispatch({
        type: 'department/list',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    this.props.dispatch({
      type: 'department/create',
      payload: fields,
    });

    this.setState({
      modalVisible: false,
    });
  };

  renderForm() {
    const { form: { getFieldDecorator }, department: { formValues } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="部门名称">
              {getFieldDecorator('name', { initialValue: formValues.name })(
                <Input placeholder="请输入" />
              )
              }
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否启用">
              {getFieldDecorator('enabled', { initialValue: formValues.enabled })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="true">是</Option>
                  <Option value="false">否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <Divider type="vertical" />
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              新建
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { department: { list }, loading } = this.props;
    const { modalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };


    const columns = [
      {
        title: '部门名称',
        dataIndex: 'name',
      },
      {
        title: '显示排序',
        dataIndex: 'seq',
      },
      {
        title: '是否启用',
        dataIndex: 'enabled',
        render: val => (val ? '是' : '否'),
        filters: [
          {
            text: '是',
            value: true,
          },
          {
            text: '否',
            value: false,
          },
        ],
        filterMultiple: false,
        onFilter: (value, record) => record.enabled === (value === 'true'),
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleUpdate(record)}>修改</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="部门列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Alert
              message={<Fragment>满足条件的查询记录总数为1000条，当前页面仅显示前100条</Fragment>}
              style={{ marginBottom: 16 }}
              type="info"
              showIcon
            />
            <Table loading={loading} dataSource={list} columns={columns} rowKey="id" />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} item={{ name: '新部门', enabled: true }} />
      </PageHeaderLayout>
    );
  }
}
