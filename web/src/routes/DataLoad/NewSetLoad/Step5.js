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
  selectInfo: form.selectInfo,
  modal,
  tableloading: loading.models.table,
}))
@Form.create()
class Step5 extends Component {

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
      payload: 'relModal',
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

  setInitialValue(key) {
    const { data } = this.props.formInfo;
    if(data === undefined) {
      return "";
    }
    return data[key];
  }

  taskId = "";
  id = "";
  tableName = 'bi_map_rel';

  getRelOperation = (need) => {   
    this.props.dispatch({
      type:'form/select', 
      payload:{
        key: 'REL_CN_NM',
        selectName: 'rel',
        need,
        param: {
          taskId: this.taskId,
          id: this.id,
        },
      },
    });
  };


  render() {
    const { dispatch, table, tableloading, modal, form, selectInfo } = this.props;
    const { current, pageSize, data } = table;
    const { relModal } = modal;
    const { validateFields, getFieldsValue } = form;

    const { state } = this.props.location; 
    if(state !== undefined) {
      this.taskId = state.id;
    }
    const nextStep = () => {
      dispatch(routerRedux.push('/data-load/set-load'));
    }

    const prevStep = () => {
      dispatch(routerRedux.push({pathname:'/data-load/set-add/act', state:{id:this.taskId}}));
    }

    const showModal = (modalName) => {
      this.id = 'new';
      dispatch({
        type: 'form/clean',
      });
      // this.cleanForm();
      const need = {
        type: 'modal/show',
        payload: modalName,
      };
      this.getRelOperation(need);
    };

    const formConfig = [
      {
        span: 24,
        key: 'REL_CN_NM',
        rules: [
          {
            required: true,
            message: '关系名称不能为空',
          },
        ],
        label: '关系名称',
        style: this.formItemLayout,
        initialValue: this.setInitialValue('REL_CN_NM'),
        itemType: 'select',
        itemConfig: {
          placeholder: '请选择关系名称',
          isFilter:true,
          disabled: this.modalDisabled,
          options: selectInfo['REL_CN_NM'],
        },
      },
      {
        span: 24,
        key: 'SRC_NM',
        initialValue: this.setInitialValue('SRC_NM'),
        rules: [
          {
            required: true,
            message: '源字段不能为空',
          },
        ],
        label: '来源实体字段',
        style: this.formItemLayout,
        itemType: 'input',
        itemConfig: {
          placeholder: '请输入源表字段名称',
        },
      },
      {
        span: 24,
        key: 'TGT_NM',
        initialValue: this.setInitialValue('TGT_NM'),
        style: this.formItemLayout,
        rules: [
          {
            required: true,
            message: '源字段不能为空',
          },
        ],
        label: '目标实体字段',
        itemType: 'input',
        itemConfig: {
          placeholder: '请输入源表字段名称',
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
        <Button onClick={() => showModal('relModal')} type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus">
          添加关系映射
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
          title="新建关系映射"
          style={{ top: 0, marginRight: '0px' }}
          bodyStyle={{ minHeight: 'calc(100vh - 108px)', paddingTop: '20px', paddingLeft: '0px' }}
          visible={relModal}
          onOk={() => saveModal('relModal')}
          onCancel={() => hideModal('relModal')}
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
            完成
          </Button>
          <Button onClick={prevStep} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </div>
      </div>
    );
  }
}

export default Step5;
