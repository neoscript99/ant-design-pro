import { message } from 'antd';
import { list, create } from '../services/department';

export default {
  namespace: 'department',
  state: {
    formValues: {},
    list: [],
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(list, payload);
      yield put({
        type: 'listed',
        payload: {
          formValues: { ...payload },
          list: response.data.departmentList,
        },
      });
    },
    *create({ payload }, { call, put }) {
      const { data: { departmentCreate } } = yield call(create, {
        ...payload,
        seq: 1,
        enabled: true,
      });
      if (departmentCreate.errors.length > 0) message.error(departmentCreate.errors);
      else message.success(`添加成功 - ${departmentCreate.name}`);
      yield put({
        type: 'created',
        payload: departmentCreate,
      });
    },
  },

  reducers: {
    listed(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    created(state, action) {
      return {
        ...state,
        list: [action.payload].concat(state.list),
      };
    },
  },
};
