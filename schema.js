import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";

// __dirname = 현재 실행 중인 폴더 경로.
// __filename = 현재 실행 중인 파일 경로.
// "/**/" =모든 폴더, "/**/*"" = 모든 폴더의 모든 파일. 패턴랭기지라고 함.
// 모든 폴더에 파일의 뒤에가 typeDefs.js로 끝나는 걸 검색함.
// 합칠 파일에서 export를 해야 loadFiles를 할 수 있다.
const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
// .queries.js나 mutations.js를 찾는다.
// const loadedResolvers = loadFilesSync(`${__dirname}/**/*.{queries,mutations}.js`);
const loadedResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.js`);

export const typeDefs = mergeTypeDefs(loadedTypes);
export const resolvers = mergeResolvers(loadedResolvers);
