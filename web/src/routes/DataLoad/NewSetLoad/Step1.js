import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Form, FormItem, Input, Button, Select, Divider, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './AddSetLoad.less';
import BasicFormItem from '../../../components/FormItem';

@connect(({ form, loading }) => ({
  formInfo: form.formInfo,
  formloading: loading.models.form,
}))
@Form.create()
class Step1 extends PureComponent {

  componentWillMount() {
    const { id } = this.props.match.params;
    if('new' !== id) {
      this.props.dispatch({
        type: 'form/fetch',
        payload: {id, 'tableName':'bi_map_data_collect'},
      });
    } else {
     this.props.dispatch({
        type: 'form/clean',
      });
    }
  }

  setInitialValue(key) {
    const{ data } = this.props.formInfo;
    if(data === undefined) {
      return null;
    }
    return data[key];
  }

  render() {
    const { form, dispatch, formInfo, formloading } = this.props;
    const { getFieldDecorator, validateFields, setFields, getFieldsValue } = form;
    const { id } = this.props.match.params;


    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 15 },
      },
    };
    const formItemLayoutS = {
      labelCol: {
        sm: { span: 12 },
      },
      wrapperCol: {
        sm: { span: 12 },
      },
    };
     const formItemLayoutA = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 12 },
      },
    };
    const formConfig = [
     {
        span: 24,
        key: 'TASK_NM',
        rules: [
          {
            required: true,
            message: '任务名不能为空',
          },
        ],
        label: '任务名称',
        style: formItemLayout,
        initialValue: this.setInitialValue('TASK_NM'),
        itemType: 'input',
        itemConfig: {
          placeholder: '请输入任务名称',
        },
      },
      {
        span: 24,
        key: 'TABLE_NM',
        initialValue: this.setInitialValue('TABLE_NM'),
        rules: [
          {
            required: true,
            message: '表名不能为空',
          },
        ],
        label: '表英文名',
        style: formItemLayout,
        itemType: 'input',
        itemConfig: {
          placeholder: '请输入表名',
        },
      },
      {
        span: 12,
        key: 'TABLE_CN_NM',
        initialValue: this.setInitialValue('TABLE_CN_NM'),
        style: formItemLayoutS,
        rules: [],
        label: '表中文名',
        itemType: 'input',
        itemConfig: {
          placeholder: '请输入表中文名',
        },
      }, {
        span: 12,
        key: 'INCR_FIELD',
        initialValue: this.setInitialValue('INCR_FIELD'),
        style: formItemLayoutA,
        rules: [],
        label: '增量字段',
        itemType: 'input',
        itemConfig: {
          placeholder: '请输入字段名',
        },
      }, {
        span: 12,
        key: 'COLLECT_MODE',
        initialValue: this.setInitialValue('COLLECT_MODE'),
        style: formItemLayoutS,
        rules: [],
        label: '加载模式',
        itemType: 'select',
        initialValue: '增量',
        itemConfig: {
          options:[
            {
              key: '01',
              value: '全量',
            },
            {
              key: '02',
              value: '增量',
            },
          ],
        },
      }, {
        span: 12,
        key: 'COLLECT_FREQ',
        initialValue: this.setInitialValue('COLLECT_FREQ'),
        style: formItemLayoutA,
        rules: [],
        label: '加载频率',
        itemType: 'select',
        initialValue: '10分钟',
        itemConfig: {
          options:[
            {
              key: '01',
              value: '10分钟',
            },
            {
              key: '02',
              value: '30分钟',
            },
            {
              key: '03',
              value: '1天',
            },
            {
              key: '04',
              value: '1周',
            },
             {
              key: '05',
              value: '1月',
            },
          ],
        },
      }, {
        span: 24,
        key: 'COLLECTSQL',
        initialValue: this.setInitialValue('COLLECTSQL'),
        style: formItemLayout,
        rules: [],
        label: '执行sql',
        itemType: 'textarea',
        itemConfig: {
          'row': 5,
          'placeholder': '不填默认select * from tableName',
        },
      },
    ];

    const onValidateForm = () => {
      validateFields((err, values) => {
        let t = 'form/save';
        if('new' !== id) {
          t = 'form/update';
        }
        if (!err) {
          const values = getFieldsValue();
          dispatch({
            type: t,
            payload: { 
              'param': values, 
              'id': id,
              'tableName': 'bi_map_data_collect', 
              'url': '/data-load/set-add/clean', 
            }
          });
        }
      });
    };
    
    return (
      <div className={styles.stepForm}>
        <Form> 
          <BasicFormItem form={form} formConfig={formConfig} /> 
          <Row>
            <Col span={8} offset={6}>
            <Button type="primary" onClick={onValidateForm}>
                下一步
            </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Step1;
