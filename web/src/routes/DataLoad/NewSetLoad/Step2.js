import React, { Component } from 'react';
import { connect } from 'dva';
import { 
Form, 
FormItem, 
Input, 
Button, 
Select, 
Divider, 
Row, 
Col, 
Modal, 
Popconfirm,
Icon } from 'antd';

import { routerRedux } from 'dva/router';
import styles from './AddSetLoad.less';
import DataTable from '../../../components/BasicTable';
import BasicFormItem from '../../../components/FormItem';
import { queryForm } from '../../../services/api';

@connect(({ table, modal, form, loading }) => ({
  table,
  formInfo: form.formInfo,
  modal,
  tableloading: loading.models.table,
}))
@Form.create()
class Step2 extends Component {

  componentDidMount() {
    this.props.dispatch({
      type: 'table/fetch',
      payload: {
        operation:this.operation, 
        tableName:this.tableName, 
        filter: {
          TASK_ID: this.taskId,
        }
      },
    });
  }

  operation = {
    title: '操作',
    key: 'operation',
    width: '74px',
    render: (text, record) => {
      const { id } = record;
      return (
        <div>
          <a onClick={() => this.onEditChange(id)}><Icon type="edit"/></a>
          <Divider type="vertical"/>
          <Popconfirm title="是否删除?" onConfirm={this.deleteHandler.bind(null, id)}>
            <a><Icon type="delete"/></a>
          </Popconfirm>
        </div>
      );
    }
  };

  onEditChange = (id) => {
    this.id = id;
    this.props.dispatch({
      type: 'form/fetch',
      payload: { id, tableName: this.tableName },
    });
    this.props.dispatch({
      type: 'modal/show',
      payload: 'cleanModal',
    });
  };

  deleteHandler = (editId) => {
    this.props.dispatch({
      type: 'table/delete',
      payload: { 
        tableName: this.tableName,
        id: editId,
        filter : {
          TASK_ID: this.taskId,
        },
      },
    });
  };

  formItemLayout = {
    labelCol: {
      sm: { span: 6 },
    },
    wrapperCol: {
      sm: { span: 18 },
    },
  };

  setInitialValue(key, defaultVal) {
    const { data } = this.props.formInfo;
    if(data === undefined) {
      return defaultVal;
    }
    return data[key];
  }

  taskId = "";
  id = "";
  tableName = 'bi_map_clean';

  render() {
    const { dispatch, table, tableloading, modal, form } = this.props;
    const { current, pageSize, data } = table;
    const { cleanModal } = modal;
    const { validateFields, getFieldsValue } = form;

    const { state } = this.props.location; 
    if(state !== undefined) {
      this.taskId = state.id;
    }

    const nextStep = () => {
      dispatch(routerRedux.push({pathname:'/data-load/set-add/ent', state:{id:this.taskId}}));
    }

    const prevStep = () => {
      dispatch(routerRedux.push('/data-load/set-add/basic/' + this.taskId));
    }

    const showModal = (modalName) => {
      this.id = 'new';
      dispatch({
        type: 'form/clean',
        // payload: modalName,
      });
      // this.cleanForm();
      dispatch({
        type: 'modal/show',
        payload: modalName,
      });
    };

    const formConfig = [
      {
        span: 24,
        key: 'CLEAN_NM',
        rules: [
          {
            required: true,
            message: '清理任务名称不能为空',
          },
        ],
        label: '任务名称',
        style: this.formItemLayout,
        initialValue: this.setInitialValue('CLEAN_NM'),
        itemType: 'input',
        itemConfig: {
          placeholder: '请输入清理任务名称',
        },
      },
      {
        span: 24,
        key: 'FIELD_NM',
        initialValue: this.setInitialValue('FIELD_NM'),
        rules: [
          {
            required: true,
            message: '清理字段不能为空',
          },
        ],
        label: '清理字段',
        style: this.formItemLayout,
        itemType: 'input',
        itemConfig: {
          placeholder: '请输入源表字段名称',
        },
      },
      {
        span: 24,
        key: 'CLEAN_RULE',
        initialValue: this.setInitialValue('CLEAN_RULE'),
        style: this.formItemLayout,
        rules: [
          {
            required: true,
            message: '清理任务名称不能为空',
          },
        ],
        label: '清理规则',
        itemType: 'select',
        itemConfig: {
          placeholder: '请选择一个清理规则',
          isFilter:true,
          options:[
            {
              key: '身份证清理',
              value: '身份证清理',
            },
            {
              key: '电话号码清理',
              value: '电话号码清理',
            },
            {
              key: '时间清理',
              value: '时间清理',
            },
          ],
        },
      },
      {
        span: 24,
        key: 'CLEAN_TYPE',
        initialValue: this.setInitialValue('CLEAN_TYPE', '01'),
        style: this.formItemLayout,
        rules: [],
        label: '清理类型',
        itemType: 'select',
        itemConfig: {
          options:[
            {
              key: '01',
              value: '清理整行',
            },
            {
              key: '02',
              value: '清理字段',
            },
          ],
        },
      },  
    ];

    const saveModal = (modalName) => {
      let t = 'form/save';
      if('new' !== this.id) {
        t = 'form/update';
      }
      validateFields((err, values) => {
        if (!err) {
          const values = getFieldsValue();
          values.TASK_ID = this.taskId;
          const need = [
            {
              type: 'modal/hide',
              payload: modalName,
            },
            {
              type: 'table/reflash',
              payload: {
                tableName: this.tableName,
                filter : {
                  TASK_ID: this.taskId,
                },
              },
            },
          ];
          dispatch({
            type: t,
            payload: { 
              'param': values, 
              'tableName': this.tableName,
              'need': need, 
              'id': this.id,
            }
          });
        }
      });
    };

    const hideModal = (modalName) => {
      this.props.dispatch({
        type: 'modal/hide',
        payload: modalName,
      });
    };

    return (
      <div className={styles.stepTable} >
        <Button onClick={() => showModal('cleanModal')} type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus">
          添加清理规则
        </Button>
        {data[this.tableName] !== undefined ?
          <div style={{minHeight: '50vh'}}>
            <DataTable
              loading={tableloading}
              dispatch={dispatch}
              tableName={this.tableName}
              current={current}
              pageSize={pageSize}
              total={data[this.tableName].total}
              dataSource={data[this.tableName].dataSource}
              columns={data[this.tableName].columns}
            />
          </div> : null
        }
        <Modal
          transitionName="slide-right"
          destroyOnClose={true}
          title="新建数据清理任务"
          style={{ top: 0, marginRight: '0px' }}
          bodyStyle={{ minHeight: 'calc(100vh - 108px)', paddingTop: '20px', paddingLeft: '0px' }}
          visible={cleanModal}
          onOk={() => saveModal('cleanModal')}
          onCancel={() => hideModal('cleanModal')}
          closable={false}
          keyboard={false}
          maskClosable={false}
        >
        <Form>
          <BasicFormItem form={form} formConfig={formConfig} /> 
        </Form>
        </Modal>
        <div className={styles.stepButton}>
          <Button onClick={nextStep} type="primary" >
            下一步
          </Button>
          <Button onClick={prevStep} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </div>
      </div>
    );
  }
}

export default Step2;
