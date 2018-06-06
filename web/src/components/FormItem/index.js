import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, FormItem, Input, Button, Select, Row, Col } from 'antd';


const { Option } = Select;
const { TextArea } = Input;
class BasicFormItem extends PureComponent {

  getInput(itemConfig) {
    const { placeholder, disabled, onChange } = itemConfig;
    return (
      <Input 
        disabled={disabled} 
        placeholder={placeholder} 
        onChange={undefined !== onChange ? () => onChange() : null} />
    );
  };

  getSelect(itemConfig) {
    const { options, disabled, onChange, placeholder, isFilter } = itemConfig;
    const filter = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    const children = [];
    for(let i in options) {
      children.push(<Option key={options[i].key}>{options[i].value}</Option>)
    }
    return(
      <Select 
        placeholder={placeholder}
        disabled={disabled} 
        onChange={undefined !== onChange ? () => onChange() : null}
        showSearch={isFilter ? true : false}
        optionFilterProp={isFilter ? "children" : null}
        // filterOption={undefined !== filterOption ? filter : null}
      >
        {children}
      </Select>
    );
  };

  getTextArea(itemConfig) {
    const { row, placeholder } = itemConfig;
    return (
      <TextArea rows={row} placeholder={placeholder} />
    );
  };

  chooseItem(itemType, itemConfig) {
    if(itemType === 'input') {
      return this.getInput(itemConfig);
    } else if (itemType === 'textarea') {
      return this.getTextArea(itemConfig);
    } else if (itemType == 'select') {
      return this.getSelect(itemConfig);
    }
  }

  getFormItems(formConfig) {
    const { getFieldDecorator } = this.props.form;
    const children = [];
    for (let i in formConfig) {
      const { span, key, style, rules, label, itemType, itemConfig, initialValue } = formConfig[i];
      const item = this.chooseItem(itemType, itemConfig);
      children.push(
        <Col span={span} key={i} >
          <Form.Item {...style} label={label} >
            {getFieldDecorator(key, {
              initialValue: initialValue,
              rules: rules,
            })(
              item
            )}
          </Form.Item>
        </Col>
      );
    }
    return children;
  };

  render() {  
    const { formConfig } = this.props;
    const items = this.getFormItems(formConfig);
    return (
      <Row>{items}</Row>
    );
  }
}

export default BasicFormItem;
