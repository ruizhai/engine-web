import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';
import { TimelineChart, WaterWave } from 'components/Charts';

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.models.chart,
}))
export default class Monitor extends PureComponent {

  componentWillMount() {
    this.props.dispatch({
      type: 'chart/fetch',
    });
  }

  render() {

    const { chart, loading } = this.props;
    const { offlineChartData } = chart;

    return (
      <div style={{ margin: '-18px -18px 0px' }}>
        <Fragment>
          <Row>
            <Col xl={24} lg={12} sm={24} xs={24}>
              <Card
                title="任务情况监控"
                bodyStyle={{ textAlign: 'center', fontSize: 0 }}
                bordered={false}
              >
                <Row>
                  <Col xl={8} lg={12} sm={24} xs={24}>
                    <WaterWave height={161} title="正在运行任务" percent={63} num={63} />
                  </Col>
                  <Col xl={8} lg={12} sm={24} xs={24}>
                    <WaterWave height={161} title="待运行任务" percent={12} num={12} color='#FFD700'/>
                  </Col>
                  <Col xl={8} lg={12} sm={24} xs={24}>
                    <WaterWave height={161} title="运行出错任务" percent={25} num={25} color='#CD2626' />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Card
            bordered={false}
            loading={loading}
            bodyStyle={{ paddingTop: '1px' }}
            title="流量监控"
            style={{ marginTop: 12 }}
          >
            <TimelineChart
              height={400}
              data={offlineChartData}
              titleMap={{ y1: '流量' }}
            />
          </Card>
        </Fragment>
      </div>
    );
  }
}