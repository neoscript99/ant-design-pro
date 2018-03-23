import graphql from '../utils/graphql';
import gql from 'graphql-tag';

export async function queryDepartment() {
  return graphql.query({
    query: gql`
          query DepartmentList {
            departmentList {
              id
              name
              seq
              version              
            }
          }          
        `,
  });
}