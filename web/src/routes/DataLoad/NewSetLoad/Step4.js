import React, { PureComponent } from 'react';
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

@connect(({ table, modal, form, loading }) => ({
  table,
  modal,
  formInfo: form.formInfo,
  selectInfo: form.selectInfo,
  loading: loading.models.table,
}))
@Form.create()
class Step4 extends PureComponent {

  componentDidMount() {
    this.props.dispatch({
      type: 'table/fetch',
      payload: {
        operation: this.getOperation(this.onEditChange, this.deleteHandler), 
        tableName: this.tableName, 
        filter: {
          TASK_ID: this.taskId,
        }
      },
    });
  }

  tableName = 'bi_map_act';
  attrName = 'bi_map_attr';
  actNm = "";
  taskId = "";
  actId = "new";
  attrId = "new";
  modalDisabled = false;
  isUpdate = true;

  formItemLayout = {
    labelCol: {
      sm: { span: 3 },
    },
    wrapperCol: {
      sm: { span: 14 },
    },
  };

  attrItemLayout = {
    labelCol: {
      sm: { span: 5 },
    },
    wrapperCol: {
      sm: { span: 16 },
    },
  };

  setUpdate = () => {
    this.isUpdate = true;
  };

  getOperation = (editFunc, deleteFunc) => {
    const operation = {
      title: '操作',
      key: 'operation',
      width: '74px',
      render: (text, record) => {
        const { id } = record;
        return (
          <div>
            <a onClick={() => editFunc(id, record)}><Icon type="edit"/></a>
            <Divider type="vertical"/>
            <Popconfirm title="是否删除?" onConfirm={deleteFunc.bind(null, id)}>
              <a><Icon type="delete"/></a>
            </Popconfirm>
          </div>
        );
      }
    };
    return operation;
  };  

  getAttrData = (current, pageSize) => {
    this.props.dispatch({
      type: 'table/fetch',
      payload: {
        operation: this.getOperation(this.onEditAttr, this.deleteAttr), 
        tableName: this.attrName, 
        current,
        pageSize,
        filter: {
          TASK_ID: this.taskId,
          LOAD_TASK_ID: this.actId,
          BELONG_TYPE: '02',
        }
      },
    });
  };

  onEditChange = (id, record) => {
    this.actNm = record.ACTION_NM;
    this.actId = id;
    this.modalDisabled = true;
    this.isUpdate = false;
    this.getAttrData();
    this.getTgtFieldOperation();
    this.props.dispatch({
      type: 'form/fetch',
      payload: { id, tableName: this.tableName },
    });
    this.props.dispatch({
      type: 'modal/show',
      payload: 'actModal',
    });
  };
  
  deleteHandler = (id) => {
    this.props.dispatch({
      type: 'table/delete',
      payload: { 
        tableName: this.tableName,
        id,
        filter: {
          TASK_ID: this.taskId,
        },
      },
    });
  };

  onEditAttr = (id) => {
    this.attrId = id;
    this.props.dispatch({
      type: 'form/fetch',
      payload: { id, tableName: this.attrName },
    });
    const need = {
      type: 'modal/show',
      payload: 'fieldModal',
    };
    this.getActAttrOperation(need, id);
  };

  deleteAttr = (id) => {
    this.props.dispatch({
      type: 'table/delete',
      payload: { 
        tableName: this.attrName,
        id,
        filter: {
          TASK_ID: this.taskId,
          LOAD_TASK_ID: this.actId,
        },
      },
    });
  };

  setInitialValue = (key) => {
    const { data } = this.props.formInfo;
    if(data === undefined) {
      return undefined;
    }
    return data[key];
  };

  getActOperation = (need) => {   
    this.props.dispatch({
      type:'form/select', 
      payload:{
        key: 'ACTION_CN_NM',
        selectName: 'act',
        need,
        param: {
          taskId: this.taskId,
        },
      },
    });
  };

  getTgtFieldOperation = () => {   
    this.props.dispatch({
      type:'form/select', 
      payload:{
        key: 'SRC_FIELD_NM',
        selectName: 'tgtField',
        param: {
          taskId: this.taskId,
        },
      },
    });
  };

  getActAttrOperation = (need, attrId) => {   
    this.props.dispatch({
      type:'form/select', 
      payload:{
        key: 'TGT_FIELD_NM',
        selectName: 'actAttr',
        need,
        param: {
          loadTaskId: this.actId,
          actNm: this.actNm,
          attrId,
        },
      },
    });
  };

  render() {
    const { dispatch, table, loading, modal, form, formInfo, selectInfo } = this.props;
    const { current, pageSize, data } = table;
    const { actModal, fieldModal} = modal;
    const { validateFields, getFieldsValue, isFieldsTouched } = form;

    const { state } = this.props.location; 
    if(state !== undefined) {
      this.taskId = state.id;
    }
    const formConfig = [
      {
        span: 24,
        key: 'ACTION_CN_NM',
        initialValue: this.setInitialValue('ACTION_CN_NM'),
        rules: [
          {
            required: true,
            message: '行为名称不能为空',
          },
        ],
        label: '行为名称',
        style: this.formItemLayout,
        itemType: 'select',
        itemConfig: {
          placeholder: '请选择一个行为',
          isFilter:true,
          disabled: this.modalDisabled,
          options: selectInfo['ACTION_CN_NM'],
        },
      },
      {
        span: 24,
        key: 'PK',
        initialValue: this.setInitialValue('PK'),
        rules: [
          {
            required: true,
            message: '唯一标识不能为空',
          },
        ],
        label: '唯一标识',
        style: this.formItemLayout,
        itemType: 'input',
        itemConfig: {
          placeholder: '请输入源表字段名称',
          onChange: this.setUpdate,
        },
      },
      {
        span: 24,
        key: 'TIME_FIELD',
        initialValue: this.setInitialValue('TIME_FIELD'),
        rules: [
          {
            required: true,
            message: '请输入源表字段名称',
          },
        ],
        label: '时间字段',
        style: this.formItemLayout,
        itemType: 'input',
        itemConfig: {
          placeholder: '请输入源表字段名称',
          onChange: this.setUpdate,
        },
      },
    ];

    const formAttrConfig = [
      {
        span: 24,
        key: 'SRC_FIELD_NM',
        initialValue: this.setInitialValue('SRC_FIELD_NM'),
        rules: [
          {
            required: true,
            message: '来源字段名称不能为空',
          },
        ],
        label: '来源名称',
        style: this.attrItemLayout,
        itemType: 'select',
        itemConfig: {
          placeholder: '请输入来源字段名称',
          isFilter:true,
          options: selectInfo['SRC_FIELD_NM'],
        },
      },
      {
        span: 24,
        key: 'TGT_FIELD_NM',
        initialValue: this.setInitialValue('TGT_FIELD_NM'),
        rules: [
          {
            required: true,
            message: '目标字段名称不能为空',
          },
        ],
        label: '目标名称',
        style: this.attrItemLayout,
        itemType: 'select',
        itemConfig: {
          placeholder: '请选择目标字段名称',
          isFilter:true,
          options: selectInfo['TGT_FIELD_NM'],
        },
      },
      {
        span: 24,
        key: 'LOAD_RULE',
        initialValue: this.setInitialValue('LOAD_RULE'),
        style: this.attrItemLayout,
        rules: [],
        label: '加载规则',
        itemType: 'select',
        itemConfig: {
          options:[
            {
              key: '转码',
              value: '转码',
            },
            {
              key: '电话号码转换',
              value: '电话号码转换',
            },
            {
              key: '身份证转换',
              value: '身份证转换',
            },
          ],
        },
      }, 
    ];

    const nextStep = () => {
      dispatch(routerRedux.push({pathname:'/data-load/set-add/rel', state:{id:this.taskId}}));
    };

    const prevStep = () => {
      dispatch(routerRedux.push({pathname:'/data-load/set-add/ent', state:{id:this.taskId}}));
    }


    const saveAct = () => {
      let t = 'form/save';
      if(this.modalDisabled) {
        t = 'form/update';
      }
      validateFields(['ACTION_CN_NM', 'PK', 'UPDATE_RULE', 'TIME_FIELD'], (err, values) => {
        if (!err) {
          this.modalDisabled = true;
          values.TASK_ID = this.taskId;
          if(this.isUpdate) {
            dispatch({
              type: t,
              payload: { 
                'param': values, 
                'tableName': this.tableName,
                'id': this.actId,
              }
            });
            this.getAttrData();
            this.isUpdate = false;
            this.actNm = values.ACTION_CN_NM;
          } else {
            this.attrId = 'new';
            dispatch({
              type: 'form/clean',
              payload : ['SRC_FIELD_NM','TGT_FIELD_NM', 'LOAD_RULE', 'TIME_FIELD'],
            });
            const need = { type: 'modal/show', payload: 'fieldModal' };
            this.getActAttrOperation(need);
          } 
        }
      });
    };

    const saveAttr = () => {
      let t = 'form/save';
      if(this.actId === 'new') {
        this.actId = formInfo.data.id;
      }
      if('new' !== this.attrId) {
        t = 'form/update';
      }
      validateFields(['SRC_FIELD_NM', 'TGT_FIELD_NM', 'LOAD_RULE'], (err, values) => {
        if (!err) {
          this.modalDisabled = true;
          values.TASK_ID = this.taskId;
          values.LOAD_TASK_ID = this.actId;
          values.BELONG_TYPE = '02';
          const need = [
            {
              type: 'modal/hide',
              payload: 'fieldModal',
            },
            {
              type: 'table/reflash',
              payload: {
                tableName: this.attrName,
                filter : {
                  TASK_ID: this.taskId,
                  LOAD_TASK_ID: this.actId,
                  BELONG_TYPE: '02',
                },
              },
            }
          ];
          dispatch({
            type: t,
            payload: { 
              'param': values, 
              'tableName': this.attrName,
              'need': need, 
              'id': this.attrId,
            }
          });
        }
      });
    };

    const onShowSizeChange = (current, pageSize) => {
      this.getAttrData(current, pageSize);
    }

    const onPageChange = (current) => {
      this.getAttrData(current);
    };

    const showModal = (modalName) => {
      this.actId = 'new';
      this.modalDisabled = false;
      this.isUpdate = true;
      const need = {
        type: 'modal/show',
        payload: modalName,
      }
      this.getActOperation(need);
      this.getTgtFieldOperation();
      dispatch({
        type: 'form/clean',
      });
    };

    const saveModal = (modalName) => {
      validateFields((err, values) => {
        if (!err) {
          this.props.dispatch({
            type: 'modal/hide',
            payload: modalName,
          });
        }
      });
    };

    const hideModal = (modalName) => {
      dispatch({
        type: 'modal/hide',
        payload: modalName,
      });
      dispatch({
        type: 'table/reflash',
        payload: {
          tableName: this.tableName,
          filter : {
            TASK_ID: this.taskId,
          },
        },
      });
    };

    return (
      <div className={styles.stepTable} >
        <Button onClick={() => showModal('actModal')} type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus">
          添加行为映射
        </Button>
        {data[this.tableName] !== undefined ?
        <div style={{minHeight: '50vh'}}>
          <DataTable
            loading={loading}
            dispatch={dispatch}
            tableName={this.tableName}
            current={current}
            pageSize={pageSize}
            total={data[this.tableName].total}
            dataSource={data[this.tableName].dataSource}
            columns={data[this.tableName].columns}
          />
        </div> : null}
        <Modal
          title="字段映射"
          destroyOnClose={true}
          visible={fieldModal}
          onOk={() => saveAttr()}
          onCancel={() => hideModal('fieldModal')}
        >
         <Form>
            <BasicFormItem form={form} formConfig={formAttrConfig} /> 
          </Form>
        </Modal>
        <Modal
          width={800}
          transitionName="slide-right"
          destroyOnClose={true}
          title="新建行为映射"
          style={{ top: 0, marginRight: '0px' }}
          bodyStyle={{ minHeight: 'calc(100vh - 54px)', paddingTop: '20px', paddingLeft: '10px' }}
          visible={actModal}
          onCancel={() => hideModal('actModal')}
          footer={null}
          closable={true}
          keyboard={false}
          maskClosable={false}
        >
        <Form>
          <BasicFormItem form={form} formConfig={formConfig} /> 
        </Form>
        <Button onClick={() => saveAct('fieldModal')} type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus">
          {!this.isUpdate ? '添加字段映射' : '保存基本信息'}
        </Button>
        {this.modalDisabled && data[this.attrName] !== undefined ?
        <div style={{minHeight: '50vh'}}>
          <DataTable
            loading={loading}
            dispatch={dispatch}
            tableName={this.attrName}
            current={current}
            wpagination={true}
            pageSize={5}
            hasPagination={true}
            onShowSizeChange={onShowSizeChange}
            onPageChange={onPageChange}
            total={data[this.attrName].total}
            dataSource={data[this.attrName].dataSource}
            columns={data[this.attrName].columns}
          />
        </div> : null}
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

export default Step4;
