import { gql } from "apollo-server-core";

// password는 묻지 않을 거야. 필요 없다.
export default gql`
  type User {
    id: String!
    firstName: String!
    lastName: String
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
    bio: String
    avatar: String
  }
`;
