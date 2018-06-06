import React, { PureComponent, Fragment } from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import { Card, Steps } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import NotFound from '../../Exception/404';
import { getRoutes } from '../../../utils/utils';
import styles from './AddSetLoad.less';

const { Step } = Steps;

export default class StepForm extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'basic':
        return 0;
      case 'clean':
        return 1;
      case 'ent':
        return 2;
      case 'act':
        return 3;
      case 'rel':
        return 4;
      default:
        return 0;
    }
  }
  
  render() {
    const { match, routerData } = this.props;
    const { state } = this.props.location;
    let basicUrl = "/data-load/set-add/basic/"
    if(state !== undefined) {
      basicUrl = basicUrl + state.id;
    }
    return (
      <div className={styles.addSetLoad}>
        <Card title="新建加载任务" bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="基本信息" />
              <Step title="数据清洗" />
              <Step title="实体映射" />
              <Step title="行为映射" />
              <Step title="关系映射" />
            </Steps>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from="/data-load/set-add" to={basicUrl} />
              <Route render={NotFound} />
            </Switch>
          </Fragment>
        </Card>
      </div>
    );
  }
}
