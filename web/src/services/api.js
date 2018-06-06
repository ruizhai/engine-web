import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

//my

export async function queryTable(params) {
  const {current, pageSize, tableName, filter} = params;
  // return request('/api/table/');
  return request('/api/table/' + tableName + '/get', {
    method: 'POST',
    body: {current, pageSize, tableName, filter},
  });
}

export async function insertForm(params) {
  const { param, tableName } = params;
  return request('/api/table/' + tableName + '/insert', {
    method: 'POST',
    body: param,
  });
}

export async function updateForm(params) {
  const { param, tableName, id } = params;
  return request('/api/table/' + tableName + '/update', {
    method: 'POST',
    body: {...param, id},
  });
}

export async function deleteTable(params) {
  const { tableName, id } = params;
  return request('/api/table/' + tableName + '/delete', {
    method: 'POST',
    body: id,
  });
}

export async function queryForm(params) {
  const { id, tableName } = params;
  return request('/api/table/' + tableName + '/form', {
    method: 'POST',
    body: id,
  });
}

export async function getSelect(params) {
  const { selectName, param } = params;
  return request('/api/select/' + selectName, {
    method: 'POST', 
    body: param,
  });
}
