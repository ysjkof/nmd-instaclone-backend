import { gql } from "apollo-server-core";

export default gql`
  scalar Upload
  type MutationResponse {
    ok: Boolean!
    id: Int
    error: String
  }
`;
