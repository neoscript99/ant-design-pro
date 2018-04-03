import gql from 'graphql-tag';
import graphql from '../utils/graphql';

const propertiesFlag = 'id,name,seq,enabled';
const errorsFrag = 'errors{ field,message }';

const departmentList = gql`
  query departmentList {
    departmentList {
      ${propertiesFlag}         
    }
  }       
`;

const departmentCreate = gql`
  mutation departmentCreate($department: DepartmentCreate!) {
    departmentCreate(department: $department) {
      ${propertiesFlag}         
      ${errorsFrag}
    }
  }
`;

// const departmentDelete = gql`
//   mutation departmentDelete($id: String!) {
//     departmentDelete(id: $id) {
//       success
//       error
//     }
//   }
// `;

export async function list(params) {
  return graphql.query({
    query: departmentList,
    variables: params,
  });
}

export async function create(dept) {
  return graphql.mutate({
    mutation: departmentCreate,
    variables: { department: dept },
  });
}
