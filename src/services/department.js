import graphql from '../utils/graphql';
import gql from 'graphql-tag';

const departmentList = gql`
  query departmentList {
    departmentList {
      id
      name
      seq
      enabled
      version              
    }
  }          
`;

const departmentCreate = gql`
  mutation departmentCreate($department: DepartmentCreate!) {
    departmentCreate(department: $department) {
      id
      name
      seq
      enabled
      version   
    }
  }
`;

const departmentDelete = gql`
  mutation departmentDelete($id: String!) {
    departmentDelete(id: $id) {
    error
  }
}
`;

export async function list() {
  return graphql.query({
    query: departmentList
  });
}

export async function create(dept) {
  return graphql.mutate({
    mutation: departmentCreate,
    variables:{department:dept}
  });
}

